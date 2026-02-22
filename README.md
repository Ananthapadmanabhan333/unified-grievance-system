# 🏛️ National Unified Citizen Grievance & Accountability Platform

## 🚀 Production-Ready Enterprise B2G SaaS Platform

A comprehensive, production-grade national unified citizen grievance tracking and accountability platform designed for Government-to-Government (B2G) SaaS deployment.

### ✨ Key Features

- **🏛️ Multi-Tenant B2G SaaS** - Support for multiple government entities (National, State, District, Municipal)
- **🤖 AI-Powered Intelligence** - Automated classification, sentiment analysis, and SLA breach prediction
- **⚡ Real-Time SLA Monitoring** - Proactive escalation with auto-notifications
- **🔐 Enterprise Security** - JWT auth, rate limiting, RBAC, audit logging, encryption
- **📊 Advanced Analytics** - Command center dashboard with real-time insights
- **🌍 National Jurisdiction Support** - Complete hierarchy: National → State → District → Ward
- **📱 Multi-Channel Notifications** - In-app, Email, SMS, Push notifications
- **🔍 Comprehensive Audit Trail** - Immutable logs for compliance and accountability
- **🐳 Cloud-Ready Deployment** - Docker, Kubernetes, AWS/Azure/GCP compatible

---

## 🛠️ Tech Stack

**Backend**: Node.js 18+, Express.js, Sequelize ORM, PostgreSQL/SQLite  
**Frontend**: React 19, Vite, Axios  
**Security**: Helmet, JWT, Rate Limiting, Input Validation  
**AI/ML**: Natural NLP, Sentiment Analysis  
**DevOps**: Docker, Docker Compose, Health Checks

---

## 📦 Prerequisites

- Node.js >= 18.0.0
- PostgreSQL >= 14.0 (production) or SQLite (development)
- Docker >= 20.10 (optional, for containerized deployment)

---

## 🚀 Quick Start

### Development Mode

```bash
# 1. Install dependencies
cd server && npm install
cd ../client && npm install

# 2. Configure environment
cd server
cp .env.example .env
# Edit .env with your configuration

# 3. Seed database
npm run seed:india      # National jurisdiction data
npm run seed:categories # Grievance categories

# 4. Start servers
npm run dev             # Backend (port 5000)
cd ../client && npm run dev  # Frontend (port 5173)
```

### Production Deployment (Docker)

```bash
# 1. Configure environment
cp server/.env.example server/.env
# Edit .env with production values

# 2. Start all services
docker-compose up -d

# 3. View logs
docker-compose logs -f
```

**Services:**
- API: http://localhost:5000
- Frontend: http://localhost:3000
- PostgreSQL: localhost:5432
- Redis: localhost:6379

---

## 🗄️ Database Setup

### PostgreSQL (Production)

```bash
# Create database
psql -U postgres
CREATE DATABASE govtech_prod;
CREATE USER govtech WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE govtech_prod TO govtech;
```

### Seed Data

```bash
cd server
npm run seed:india      # 28 States + 8 UTs + Departments
npm run seed:categories # 29 Categories + Escalation Levels
```

---

## 🔐 Security Features

✅ JWT Authentication with refresh tokens  
✅ Role-Based Access Control (RBAC)  
✅ Rate Limiting (API protection)  
✅ Input Validation (SQL injection, XSS prevention)  
✅ Security Headers (Helmet)  
✅ Immutable Audit Logs  
✅ Account Lockout (failed login protection)  
✅ Encrypted Sensitive Fields  
✅ CORS Configuration  
✅ Non-root Docker Containers

---

## 📊 API Endpoints

### Authentication
- `POST /api/auth/send-otp` - Send OTP
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/login` - Login

### Grievances
- `GET /api/grievances` - List (paginated, filtered)
- `POST /api/grievances` - Create
- `PUT /api/grievances/:id/status` - Update status

### Analytics
- `GET /api/analytics/stats` - Statistics
- `GET /api/analytics/command-center` - Command center data

### Health
- `GET /health` - Health check

---

## 🏗️ Architecture

```
Frontend (React) → API Gateway (Express + Middleware)
                 → Service Layer (Business Logic)
                 → Data Layer (Sequelize ORM)
                 → PostgreSQL Database
```

**Key Components:**
- **7 Enterprise Models**: GrievanceCategory, GrievanceStatusLog, EscalationLevel, AIPrediction, Notification, AuditLog, Tenant
- **3 Core Services**: GrievanceService, NotificationService, AuditService
- **5 Middleware**: Rate Limiting, Validation, Security Headers, Audit Logging, Tenant Isolation

---

## 📚 Documentation

- **Health Check**: http://localhost:5000/health
- **Environment Config**: `server/.env.example`
- **Seed Scripts**: `server/scripts/`
- **Docker Compose**: `docker-compose.yml`

---

## 🤝 Test Credentials

| Role | Email | Password | Scope |
|------|-------|----------|-------|
| Super Admin | `superadmin@gov.in` | `password123` | All India |
| State Admin | `cs.delhi@gov.in` | `password123` | Delhi NCT |
| Citizen | (Register via OTP) | - | Personal |

---

## 📄 License

MIT License - Built for Digital India Initiative

---

**Made with ❤️ for National Governance**

