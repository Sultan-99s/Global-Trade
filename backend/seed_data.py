import asyncio
from prisma import Prisma
from passlib.context import CryptContext
import os
from dotenv import load_dotenv

load_dotenv()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def seed_database():
    prisma = Prisma()
    await prisma.connect()
    
    try:
        # Create countries
        countries_data = [
            {
                "name": "United States",
                "code": "USA",
                "region": "North America",
                "flagUrl": "🇺🇸",
                "contactInfo": "trade@usa.gov"
            },
            {
                "name": "Brazil",
                "code": "BRA", 
                "region": "South America",
                "flagUrl": "🇧🇷",
                "contactInfo": "comercio@brasil.gov.br"
            },
            {
                "name": "India",
                "code": "IND",
                "region": "Asia",
                "flagUrl": "🇮🇳", 
                "contactInfo": "trade@india.gov.in"
            },
            {
                "name": "Germany",
                "code": "GER",
                "region": "Europe",
                "flagUrl": "🇩🇪",
                "contactInfo": "handel@deutschland.de"
            },
            {
                "name": "Bangladesh",
                "code": "BGD",
                "region": "Asia", 
                "flagUrl": "🇧🇩",
                "contactInfo": "trade@bangladesh.gov.bd"
            }
        ]
        
        created_countries = []
        for country_data in countries_data:
            country = await prisma.country.upsert(
                where={"code": country_data["code"]},
                data={
                    "create": country_data,
                    "update": country_data
                }
            )
            created_countries.append(country)
            print(f"Created/Updated country: {country.name}")
        
        # Create users
        users_data = [
            {
                "email": "admin@gevp.org",
                "password": pwd_context.hash("admin123"),
                "role": "SUPER_ADMIN",
                "countryId": None,
                "isActive": True
            },
            {
                "email": "usa@trade.gov",
                "password": pwd_context.hash("usa123"),
                "role": "COUNTRY_ADMIN", 
                "countryId": created_countries[0].id,
                "isActive": True
            },
            {
                "email": "brazil@trade.gov",
                "password": pwd_context.hash("brazil123"),
                "role": "COUNTRY_ADMIN",
                "countryId": created_countries[1].id,
                "isActive": True
            },
            {
                "email": "india@trade.gov",
                "password": pwd_context.hash("india123"),
                "role": "EDITOR",
                "countryId": created_countries[2].id,
                "isActive": True
            },
            {
                "email": "germany@trade.gov", 
                "password": pwd_context.hash("germany123"),
                "role": "EDITOR",
                "countryId": created_countries[3].id,
                "isActive": True
            }
        ]
        
        created_users = []
        for user_data in users_data:
            user = await prisma.user.upsert(
                where={"email": user_data["email"]},
                data={
                    "create": user_data,
                    "update": user_data
                }
            )
            created_users.append(user)
            print(f"Created/Updated user: {user.email}")
        
        # Create products
        products_data = [
            {
                "name": "Soybeans",
                "unit": "tons",
                "quantity": 96000000,
                "taxRate": 2.5,
                "timePeriod": "2024 Annual",
                "tags": ["agriculture", "organic", "non-gmo"],
                "category": "Agriculture",
                "countryId": created_countries[0].id  # USA
            },
            {
                "name": "Corn",
                "unit": "tons", 
                "quantity": 54000000,
                "taxRate": 1.8,
                "timePeriod": "2024 Annual",
                "tags": ["agriculture", "feed", "export-grade"],
                "category": "Agriculture",
                "countryId": created_countries[0].id  # USA
            },
            {
                "name": "Coffee Beans",
                "unit": "tons",
                "quantity": 2500000,
                "taxRate": 5.0,
                "timePeriod": "2024 Annual", 
                "tags": ["arabica", "premium", "fair-trade"],
                "category": "Food & Beverages",
                "countryId": created_countries[1].id  # Brazil
            },
            {
                "name": "Sugar",
                "unit": "tons",
                "quantity": 29000000,
                "taxRate": 3.2,
                "timePeriod": "2024 Annual",
                "tags": ["raw", "refined", "organic"],
                "category": "Food & Beverages", 
                "countryId": created_countries[1].id  # Brazil
            },
            {
                "name": "Basmati Rice",
                "unit": "tons",
                "quantity": 4500000,
                "taxRate": 0.0,
                "timePeriod": "2024 Annual",
                "tags": ["premium", "aromatic", "export-quality"],
                "category": "Agriculture",
                "countryId": created_countries[2].id  # India
            },
            {
                "name": "Textiles",
                "unit": "tons",
                "quantity": 1200000,
                "taxRate": 8.5,
                "timePeriod": "2024 Annual",
                "tags": ["cotton", "silk", "handwoven"],
                "category": "Textiles",
                "countryId": created_countries[2].id  # India
            },
            {
                "name": "Automobiles",
                "unit": "units",
                "quantity": 4500000,
                "taxRate": 12.0,
                "timePeriod": "2024 Annual",
                "tags": ["luxury", "electric", "hybrid"],
                "category": "Manufacturing",
                "countryId": created_countries[3].id  # Germany
            },
            {
                "name": "Machinery",
                "unit": "units",
                "quantity": 850000,
                "taxRate": 6.5,
                "timePeriod": "2024 Annual",
                "tags": ["industrial", "precision", "high-tech"],
                "category": "Manufacturing",
                "countryId": created_countries[3].id  # Germany
            },
            {
                "name": "Ready-Made Garments",
                "unit": "pieces",
                "quantity": 750000000,
                "taxRate": 4.2,
                "timePeriod": "2024 Annual",
                "tags": ["cotton", "sustainable", "fair-trade"],
                "category": "Textiles",
                "countryId": created_countries[4].id  # Bangladesh
            }
        ]
        
        created_products = []
        for product_data in products_data:
            product = await prisma.product.upsert(
                where={"id": f"temp-{product_data['name'].lower().replace(' ', '-')}"},
                data={
                    "create": product_data,
                    "update": product_data
                }
            )
            created_products.append(product)
            print(f"Created/Updated product: {product.name}")
        
        # Create exporters
        exporters_data = [
            {
                "name": "American Grain Exports LLC",
                "licenseId": "AGE-USA-2024-001",
                "contact": "+1-555-0123, grain@age-usa.com",
                "website": "https://age-usa.com",
                "countryId": created_countries[0].id  # USA
            },
            {
                "name": "Midwest Agricultural Corp",
                "licenseId": "MAC-USA-2024-002", 
                "contact": "+1-555-0456, info@midwest-ag.com",
                "website": "https://midwest-ag.com",
                "countryId": created_countries[0].id  # USA
            },
            {
                "name": "Santos Coffee Exporters",
                "licenseId": "SCE-BRA-2024-001",
                "contact": "+55-11-9876-5432, santos@coffee-br.com",
                "website": "https://santos-coffee.com.br",
                "countryId": created_countries[1].id  # Brazil
            },
            {
                "name": "Brazilian Sugar Trading",
                "licenseId": "BST-BRA-2024-002",
                "contact": "+55-21-8765-4321, trade@sugar-br.com", 
                "website": "https://brazilian-sugar.com",
                "countryId": created_countries[1].id  # Brazil
            },
            {
                "name": "Punjab Rice Mills",
                "licenseId": "PRM-IND-2024-001",
                "contact": "+91-98765-43210, export@punjab-rice.in",
                "website": "https://punjab-rice.in",
                "countryId": created_countries[2].id  # India
            },
            {
                "name": "Mumbai Textile Exports",
                "licenseId": "MTE-IND-2024-002",
                "contact": "+91-22-1234-5678, mumbai@textiles.in",
                "website": "https://mumbai-textiles.in", 
                "countryId": created_countries[2].id  # India
            },
            {
                "name": "BMW Export Division",
                "licenseId": "BMW-GER-2024-001",
                "contact": "+49-89-1234-5678, export@bmw.de",
                "website": "https://bmw.de/export",
                "countryId": created_countries[3].id  # Germany
            },
            {
                "name": "Dhaka Garments International",
                "licenseId": "DGI-BGD-2024-001",
                "contact": "+880-2-9876543, dhaka@garments.bd",
                "website": "https://dhaka-garments.com",
                "countryId": created_countries[4].id  # Bangladesh
            }
        ]
        
        for exporter_data in exporters_data:
            exporter = await prisma.exporter.upsert(
                where={"licenseId": exporter_data["licenseId"]},
                data={
                    "create": exporter_data,
                    "update": exporter_data
                }
            )
            print(f"Created/Updated exporter: {exporter.name}")
        
        print("\n✅ Database seeded successfully!")
        print("\n🔑 Test Login Credentials:")
        print("Super Admin: admin@gevp.org / admin123")
        print("USA Admin: usa@trade.gov / usa123") 
        print("Brazil Admin: brazil@trade.gov / brazil123")
        print("India Editor: india@trade.gov / india123")
        print("Germany Editor: germany@trade.gov / germany123")
        
    except Exception as e:
        print(f"❌ Error seeding database: {e}")
    finally:
        await prisma.disconnect()

if __name__ == "__main__":
    asyncio.run(seed_database())