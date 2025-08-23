# Portfolio Management Dashboard

A modern portfolio management application built with React, Node.js, TypeScript, and PostgreSQL. This application provides a comprehensive solution for managing investment portfolios with real-time analytics and transaction tracking.

## 🚀 Quick Start with Docker Compose

### Prerequisites
- **Docker** (version 20.10 or higher)
- **Docker Compose** (version 2.0 or higher)

### 🐳 Running the Application

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd maybank-project
   ```

2. **Start all services using Docker Compose**
   ```bash
   # Build and start all services
   docker-compose up --build -d
   
   # Or start without detaching to see logs
   docker-compose up --build
   ```

3. **Access the application**
   - **🌐 Frontend Application**: http://localhost:3000
   - **🔌 Backend API**: http://localhost:3001
   - **🗄️ Database**: localhost:5432 (PostgreSQL)

4. **First-time setup**
   - Navigate to http://localhost:3000
   - Click "Register" to create your first account
   - Login and start building your portfolio

### 🛠️ Docker Commands Reference

```bash
# Start all services
docker-compose up -d

# Start with rebuild (recommended for first run)
docker-compose up --build -d

# View running services
docker-compose ps

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Stop and remove volumes (database data)
docker-compose down -v

# Restart a specific service
docker-compose restart frontend
docker-compose restart backend

# Rebuild and restart a specific service
docker-compose up --build frontend -d
```

## 🏗️ Architecture Overview

This application is built using a microservices architecture with Docker containers:

- **Frontend Container**: React SPA served by Nginx
- **Backend Container**: Node.js/Express API with Prisma ORM
- **Database Container**: PostgreSQL with persistent storage

## 🔧 Development Setup (Alternative to Docker)

### Backend Setup

1. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database and JWT settings
   ```

3. **Set up database**
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

## 🌐 Application URLs & Access Points

### Production URLs (Docker)
- **Main Application**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Documentation**: http://localhost:3001/api (available endpoints)

### Development URLs (Local)
- **Frontend Dev Server**: http://localhost:5173
- **Backend Dev Server**: http://localhost:3001

### Database Access
- **PostgreSQL**: localhost:5432
- **Username**: postgres
- **Password**: password
- **Database**: portfolio_db

## 📱 Features

- **🔐 User Authentication**: JWT-based login/logout system
- **📊 Portfolio Overview**: Dashboard with asset allocation and performance metrics
- **💼 Investment Management**: Add, edit, and delete investments
- **📈 Transaction History**: Track buy/sell transactions with pagination
- **📊 Real-time Analytics**: Performance charts and metrics
- **📱 Responsive Design**: Works on desktop and mobile devices
- **🎨 Modern UI**: Clean, professional interface with Tailwind CSS

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based authentication
- **Protected Routes**: API endpoints require valid authentication
- **Input Validation**: Comprehensive validation using Zod
- **CORS Protection**: Configured for secure cross-origin requests
- **Error Handling**: Graceful error handling and logging

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/verify` - Verify JWT token

### Portfolio
- `GET /api/portfolio` - Get portfolio overview
- `GET /api/portfolio/summary` - Get portfolio summary

### Investments
- `GET /api/investments` - Get all investments
- `GET /api/investments/:id` - Get specific investment
- `POST /api/investments` - Create new investment
- `PUT /api/investments/:id` - Update investment
- `DELETE /api/investments/:id` - Delete investment

### Transactions
- `GET /api/transactions` - Get transactions (with pagination)
- `GET /api/transactions/:id` - Get specific transaction
- `POST /api/transactions` - Create new transaction
- `GET /api/transactions/stats` - Get transaction statistics

## 🏗️ Project Structure

```
maybank-project/
├── backend/                 # Node.js/Express API
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Auth & error handling
│   │   ├── services/       # Business logic
│   │   └── utils/          # Utilities
│   ├── prisma/             # Database schema & migrations
│   └── Dockerfile
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── contexts/       # React contexts
│   │   └── types/          # TypeScript types
│   ├── config/             # Nginx configuration
│   └── Dockerfile
├── docker-compose.yml      # Multi-service setup
└── README.md
```

## 🚨 Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 3000, 3001, and 5432 are available
2. **Database connection**: Wait for PostgreSQL to fully start before accessing the app
3. **Build errors**: Use `docker-compose up --build` to rebuild containers
4. **Permission issues**: Ensure Docker has proper permissions on your system

### Reset Everything
```bash
# Stop and remove everything
docker-compose down -v

# Remove all images
docker system prune -a

# Start fresh
docker-compose up --build -d
```

## 🤖 Development Disclaimer

**AI-Assisted Development**: This application was developed with the assistance of GitHub Copilot and other AI coding tools to improve development efficiency and code quality. While AI tools were used to accelerate development, all code has been reviewed, tested, and validated to ensure proper functionality and security.

**Benefits of AI-Assisted Development**:
- Faster code generation and prototyping
- Consistent coding patterns and best practices
- Reduced development time for boilerplate code
- Enhanced code quality through AI suggestions
- Improved error handling and edge case coverage

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern web technologies and best practices
- Enhanced development experience through AI-assisted coding tools
- Designed for scalability and maintainability
- Focused on user experience and performance

---

**Happy Portfolio Management! 🚀📈**