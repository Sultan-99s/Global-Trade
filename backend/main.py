from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from prisma import Prisma
import os
from dotenv import load_dotenv
from typing import Optional, List
from pydantic import BaseModel

load_dotenv()

app = FastAPI(title="Global Export Visibility Platform API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
SECRET_KEY = os.getenv("SECRET_KEY", "gevp-fallback-secret-key")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Database
prisma = Prisma()

# Pydantic models
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class UserCreate(BaseModel):
    email: str
    password: str
    role: str = "EDITOR"
    country_id: Optional[str] = None

class UserResponse(BaseModel):
    id: str
    email: str
    role: str
    countryId: Optional[str]
    isActive: bool

class ProductCreate(BaseModel):
    name: str
    unit: str
    quantity: float
    tax_rate: float
    time_period: str
    tags: List[str]
    category: str

class ProductResponse(BaseModel):
    id: str
    name: str
    unit: str
    quantity: float
    tax_rate: float
    time_period: str
    tags: List[str]
    category: str
    countryId: str
    created_at: datetime
    updated_at: datetime

class ExporterCreate(BaseModel):
    name: str
    license_id: str
    contact: Optional[str] = None
    website: Optional[str] = None

class CountryResponse(BaseModel):
    id: str
    name: str
    code: str
    region: str
    flagUrl: Optional[str]
    contactInfo: Optional[str]

# Utility functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except JWTError:
        raise credentials_exception
    
    user = await prisma.user.find_unique(where={"email": token_data.email})
    if user is None:
        raise credentials_exception
    return user

# Startup event
@app.on_event("startup")
async def startup():
    await prisma.connect()
    print("✅ Database connected successfully")

@app.on_event("shutdown")
async def shutdown():
    await prisma.disconnect()

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "GEVP API is running"}

# Authentication endpoints
@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    try:
        user = await prisma.user.find_unique(where={"email": form_data.username})
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        if not verify_password(form_data.password, user.password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        if not user.isActive:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Account not activated. Please contact administrator.",
            )
        
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.email}, expires_delta=access_token_expires
        )
        
        print(f"✅ User {user.email} logged in successfully")
        return {"access_token": access_token, "token_type": "bearer"}
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Login error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error during login"
        )

@app.post("/register")
async def register_user(user: UserCreate):
    try:
        existing_user = await prisma.user.find_unique(where={"email": user.email})
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        hashed_password = get_password_hash(user.password)
        new_user = await prisma.user.create(
            data={
                "email": user.email,
                "password": hashed_password,
                "role": user.role,
                "countryId": user.country_id,
                "isActive": False  # Requires admin approval
            }
        )
        print(f"✅ New user registered: {user.email}")
        return {"message": "User registered successfully. Awaiting admin approval."}
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Registration error: {e}")
        raise HTTPException(status_code=500, detail="Registration failed")

@app.get("/me", response_model=UserResponse)
async def read_users_me(current_user = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "role": current_user.role,
        "countryId": current_user.countryId,
        "isActive": current_user.isActive
    }

# Countries endpoints
@app.get("/countries", response_model=List[CountryResponse])
async def get_countries():
    try:
        countries = await prisma.country.find_many()
        return countries
    except Exception as e:
        print(f"❌ Error fetching countries: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch countries")

@app.get("/countries/{country_id}/products")
async def get_country_products(country_id: str):
    try:
        products = await prisma.product.find_many(
            where={"countryId": country_id},
            include={"country": True}
        )
        return products
    except Exception as e:
        print(f"❌ Error fetching country products: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch country products")

# Products endpoints
@app.get("/products")
async def get_products(search: Optional[str] = None, category: Optional[str] = None):
    try:
        where_clause = {}
        if search:
            where_clause["name"] = {"contains": search, "mode": "insensitive"}
        if category:
            where_clause["category"] = category
        
        products = await prisma.product.find_many(
            where=where_clause,
            include={"country": True}
        )
        return products
    except Exception as e:
        print(f"❌ Error fetching products: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch products")

@app.post("/products", response_model=ProductResponse)
async def create_product(
    product: ProductCreate,
    current_user = Depends(get_current_user)
):
    try:
        if current_user.role not in ["SUPER_ADMIN", "COUNTRY_ADMIN", "EDITOR"]:
            raise HTTPException(status_code=403, detail="Not enough permissions")
        
        if not current_user.countryId and current_user.role != "SUPER_ADMIN":
            raise HTTPException(status_code=400, detail="User must be assigned to a country")
        
        new_product = await prisma.product.create(
            data={
                "name": product.name,
                "unit": product.unit,
                "quantity": product.quantity,
                "taxRate": product.tax_rate,
                "timePeriod": product.time_period,
                "tags": product.tags,
                "category": product.category,
                "countryId": current_user.countryId
            }
        )
        
        # Log the action
        await prisma.auditlog.create(
            data={
                "userId": current_user.id,
                "action": "CREATE_PRODUCT",
                "description": f"Created product: {product.name}"
            }
        )
        
        print(f"✅ Product created: {product.name} by {current_user.email}")
        return new_product
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error creating product: {e}")
        raise HTTPException(status_code=500, detail="Failed to create product")

@app.put("/products/{product_id}")
async def update_product(
    product_id: str,
    product: ProductCreate,
    current_user = Depends(get_current_user)
):
    try:
        existing_product = await prisma.product.find_unique(where={"id": product_id})
        if not existing_product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        if current_user.role != "SUPER_ADMIN" and existing_product.countryId != current_user.countryId:
            raise HTTPException(status_code=403, detail="Not enough permissions")
        
        updated_product = await prisma.product.update(
            where={"id": product_id},
            data={
                "name": product.name,
                "unit": product.unit,
                "quantity": product.quantity,
                "taxRate": product.tax_rate,
                "timePeriod": product.time_period,
                "tags": product.tags,
                "category": product.category
            }
        )
        
        await prisma.auditlog.create(
            data={
                "userId": current_user.id,
                "action": "UPDATE_PRODUCT",
                "description": f"Updated product: {product.name}"
            }
        )
        
        print(f"✅ Product updated: {product.name} by {current_user.email}")
        return updated_product
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error updating product: {e}")
        raise HTTPException(status_code=500, detail="Failed to update product")

@app.delete("/products/{product_id}")
async def delete_product(
    product_id: str,
    current_user = Depends(get_current_user)
):
    try:
        existing_product = await prisma.product.find_unique(where={"id": product_id})
        if not existing_product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        if current_user.role != "SUPER_ADMIN" and existing_product.countryId != current_user.countryId:
            raise HTTPException(status_code=403, detail="Not enough permissions")
        
        await prisma.product.delete(where={"id": product_id})
        
        await prisma.auditlog.create(
            data={
                "userId": current_user.id,
                "action": "DELETE_PRODUCT",
                "description": f"Deleted product: {existing_product.name}"
            }
        )
        
        print(f"✅ Product deleted: {existing_product.name} by {current_user.email}")
        return {"message": "Product deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error deleting product: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete product")

# Exporters endpoints
@app.get("/exporters")
async def get_exporters(country_id: Optional[str] = None):
    try:
        where_clause = {}
        if country_id:
            where_clause["countryId"] = country_id
        
        exporters = await prisma.exporter.find_many(
            where=where_clause,
            include={"country": True}
        )
        return exporters
    except Exception as e:
        print(f"❌ Error fetching exporters: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch exporters")

@app.post("/exporters")
async def create_exporter(
    exporter: ExporterCreate,
    current_user = Depends(get_current_user)
):
    try:
        if current_user.role not in ["SUPER_ADMIN", "COUNTRY_ADMIN", "EDITOR"]:
            raise HTTPException(status_code=403, detail="Not enough permissions")
        
        if not current_user.countryId and current_user.role != "SUPER_ADMIN":
            raise HTTPException(status_code=400, detail="User must be assigned to a country")
        
        new_exporter = await prisma.exporter.create(
            data={
                "name": exporter.name,
                "licenseId": exporter.license_id,
                "contact": exporter.contact,
                "website": exporter.website,
                "countryId": current_user.countryId
            }
        )
        
        await prisma.auditlog.create(
            data={
                "userId": current_user.id,
                "action": "CREATE_EXPORTER",
                "description": f"Created exporter: {exporter.name}"
            }
        )
        
        print(f"✅ Exporter created: {exporter.name} by {current_user.email}")
        return new_exporter
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error creating exporter: {e}")
        raise HTTPException(status_code=500, detail="Failed to create exporter")

# Admin endpoints
@app.get("/admin/users")
async def get_all_users(current_user = Depends(get_current_user)):
    try:
        if current_user.role != "SUPER_ADMIN":
            raise HTTPException(status_code=403, detail="Super admin access required")
        
        users = await prisma.user.find_many(include={"country": True})
        return users
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error fetching users: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch users")

@app.patch("/admin/users/{user_id}/activate")
async def activate_user(user_id: str, current_user = Depends(get_current_user)):
    try:
        if current_user.role != "SUPER_ADMIN":
            raise HTTPException(status_code=403, detail="Super admin access required")
        
        await prisma.user.update(
            where={"id": user_id},
            data={"isActive": True}
        )
        
        print(f"✅ User activated: {user_id} by {current_user.email}")
        return {"message": "User activated successfully"}
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error activating user: {e}")
        raise HTTPException(status_code=500, detail="Failed to activate user")

@app.get("/admin/audit-logs")
async def get_audit_logs(current_user = Depends(get_current_user)):
    try:
        if current_user.role != "SUPER_ADMIN":
            raise HTTPException(status_code=403, detail="Super admin access required")
        
        logs = await prisma.auditlog.find_many(
            include={"user": True},
            order={"timestamp": "desc"},
            take=100  # Limit to last 100 logs
        )
        return logs
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error fetching audit logs: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch audit logs")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)