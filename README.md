# Global Export Visibility Platform (GEVP)

A comprehensive full-stack web application that allows governments to manage their country's exportable products and enables public search of global export data.

## 🌟 Features

### Public Features
- **Global Export Directory**: Search and browse exportable products from all participating countries
- **Advanced Search & Filtering**: Filter by product, country, category, tax rate, and more
- **Unit Conversion Tool**: Convert between metric and imperial units
- **Multilingual Support**: Available in English, Spanish, French, and Bengali
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### Government Dashboard
- **Secure Authentication**: Role-based access control (SuperAdmin, CountryAdmin, Editor)
- **Product Management**: Add, edit, and delete exportable products
- **Exporter Management**: Manage authorized exporters and their licenses
- **Real-time Updates**: Live data synchronization across the platform
- **Activity Logging**: Track all user actions for audit purposes

### Super Admin Panel
- **User Management**: Approve new user registrations and manage roles
- **Country Management**: Oversee participating countries and their data
- **Activity Monitoring**: View comprehensive audit logs
- **System Analytics**: Dashboard with key metrics and statistics

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Router** for navigation
- **React Query** for data fetching
- **React Hook Form** for form management
- **Zustand** for state management
- **React i18next** for internationalization

### Backend
- **FastAPI** with async support
- **Prisma ORM** for database operations
- **PostgreSQL** database
- **JWT Authentication** with role-based permissions
- **Pydantic** for data validation
- **Python-Jose** for JWT handling

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+
- PostgreSQL database

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd gevp
   ```

2. **Install all dependencies**
   ```bash
   npm run setup
   ```

3. **Configure environment variables**
   ```bash
   # Copy and edit the .env file
   cp backend/.env.example backend/.env
   ```
   
   Update the database URL and other settings in `backend/.env`:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/gevp_db"
   SECRET_KEY="your-secret-key-here"
   ALGORITHM="HS256"
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   ```

4. **Set up the database**
   ```bash
   npm run setup:db
   ```

5. **Seed the database with sample data**
   ```bash
   npm run seed
   ```

6. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start:
   - Frontend on http://localhost:5173
   - Backend on http://localhost:8000

### Individual Commands

```bash
# Frontend only
npm run dev:frontend

# Backend only  
npm run dev:backend

# Install frontend dependencies
npm run install:frontend

# Install backend dependencies
npm run install:backend

# Build frontend for production
npm run build
```

## 📊 Database Schema

### Core Models
- **User**: Government officials with role-based access
- **Country**: Participating countries with contact information
- **Product**: Exportable products with quantities, tax rates, and categories
- **Exporter**: Authorized exporters with licenses and contact details
- **AuditLog**: Activity tracking for all user actions

### Relationships
- Users belong to Countries
- Products belong to Countries
- Exporters belong to Countries and can be linked to multiple Products
- AuditLogs track User activities

## 🔐 Authentication & Authorization

### User Roles
- **SuperAdmin**: Full system access, user management, and country oversight
- **CountryAdmin**: Manage products and exporters for their assigned country
- **Editor**: Limited CRUD access for products and exporters

### Test Login Credentials
After running the seed script, you can use these credentials:
- **Super Admin**: admin@gevp.org / admin123
- **USA Admin**: usa@trade.gov / usa123
- **Brazil Admin**: brazil@trade.gov / brazil123
- **India Editor**: india@trade.gov / india123
- **Germany Editor**: germany@trade.gov / germany123

## 🌍 Internationalization

The platform supports multiple languages:
- **English** (default)
- **Spanish** (Español)
- **French** (Français)
- **Bengali** (বাংলা)

Language files are located in `frontend/src/i18n/locales/` and can be easily extended for additional languages.

## 📱 Responsive Design

The application is fully responsive with breakpoints for:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🎨 Design System

### Color Palette
- **Primary**: Blue tones for government/official elements
- **Secondary**: Green tones for export/trade elements
- **Accent**: Orange for highlights and CTAs
- **Neutral**: Gray scale for text and backgrounds

### Typography
- **Headings**: Inter font family, 120% line height
- **Body**: Inter font family, 150% line height
- **Maximum 3 font weights**: Regular, Medium, Bold

### Spacing
- **8px grid system** for consistent spacing
- **Component padding**: 16px, 24px, 32px
- **Section margins**: 48px, 64px, 96px

## 🔧 API Endpoints

### Authentication
- `POST /token` - Login
- `POST /register` - Register new user
- `GET /me` - Get current user

### Products
- `GET /products` - List all products (with search/filter)
- `POST /products` - Create product
- `PUT /products/{id}` - Update product
- `DELETE /products/{id}` - Delete product

### Countries
- `GET /countries` - List all countries
- `GET /countries/{id}/products` - Get country's products

### Exporters
- `GET /exporters` - List exporters
- `POST /exporters` - Create exporter

### Admin
- `GET /admin/users` - List all users (SuperAdmin only)
- `PATCH /admin/users/{id}/activate` - Activate user
- `GET /admin/audit-logs` - Get activity logs

## 🧪 Testing

```bash
# Run frontend tests
cd frontend && npm test

# Run backend tests
cd backend && pytest
```

## 📦 Deployment

### Frontend (Netlify/Vercel)
```bash
npm run build
```

### Backend (Docker)
```dockerfile
FROM python:3.9
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Contact the development team
- Check the documentation wiki

## 🗺 Roadmap

### Phase 1 (Current)
- ✅ Core platform functionality
- ✅ User authentication and authorization
- ✅ Product and exporter management
- ✅ Public export directory

### Phase 2 (Upcoming)
- 📧 Email notifications
- 📊 Advanced analytics dashboard
- 🔄 Data import/export tools
- 🌐 Additional language support

### Phase 3 (Future)
- 📱 Mobile applications
- 🤖 AI-powered trade recommendations
- 📈 Market trend analysis
- 🔗 Third-party integrations

---

Built with ❤️ for global trade transparency and cooperation.