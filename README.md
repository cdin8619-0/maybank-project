# Portfolio Management Dashboard

A full-stack application for managing investment portfolios with user authentication, transaction tracking, and investment management.

## Features

- 🔐 JWT-based authentication (login/logout)
- 📊 Portfolio overview with asset summaries
- 📈 Investment performance tracking
- 📋 Transaction history
- ➕ Add/Edit investments
- 🐳 Docker containerized deployment

## Tech Stack

- **Frontend:** React 18 + TypeScript + Vite
- **Backend:** Node.js + Express + TypeScript
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** JWT tokens
- **Styling:** Tailwind CSS
- **Containerization:** Docker & Docker Compose

## Project Structure

```
portfolio-dashboard/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API services
│   │   ├── types/          # TypeScript types
│   │   └── utils/          # Utility functions
│   ├── package.json
│   └── Dockerfile
├── backend/                  # Node.js backend
│   ├── src/
│   │   ├── routes/         # Express routes
│   │   ├── middleware/     # Express middleware
│   │   ├── services/       # Business logic
│   │   ├── types/          # TypeScript types
│   │   └── utils/          # Utility functions
│   ├── prisma/             # Database schema and migrations
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml        # Multi-container setup
└── README.md
```

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Git

### Installation & Running

1. **Clone the repository:**
```bash
git clone <your-repo-url>
cd portfolio-dashboard
```

2. **Run with Docker Compose:**
```bash
docker-compose up --build
```

3. **Access the application:**
    - Frontend: http://localhost:3000
    - Backend API: http://localhost:5000

### Development Setup (without Docker)

If you prefer to run locally for development:

1. **Backend setup:**
```bash
cd backend
npm install
npm run dev
```

2. **Frontend setup:**
```bash
cd frontend
npm install
npm run dev
```

3. **Database setup:**
```bash
cd backend
npx prisma generate
npx prisma migrate dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Portfolio
- `GET /api/portfolio` - Get user's portfolio overview
- `GET /api/investments` - Get all investments
- `POST /api/investments` - Add new investment
- `PUT /api/investments/:id` - Update investment
- `DELETE /api/investments/:id` - Delete investment

### Transactions
- `GET /api/transactions` - Get transaction history
- `POST /api/transactions` - Add new transaction

## Database Schema

### Users
- id (UUID)
- email (unique)
- password (hashed)
- name
- createdAt
- updatedAt

### Investments
- id (UUID)
- userId (foreign key)
- symbol
- name
- type (STOCK, BOND, MUTUAL_FUND)
- quantity
- purchasePrice
- currentPrice
- createdAt
- updatedAt

### Transactions
- id (UUID)
- userId (foreign key)
- investmentId (foreign key)
- type (BUY, SELL)
- quantity
- price
- date
- createdAt

## Environment Variables

Create `.env` files in both frontend and backend directories:

**Backend (.env):**
```
DATABASE_URL="postgresql://postgres:password@db:5432/portfolio"
JWT_SECRET="your-super-secret-jwt-key"
PORT=5000
```

**Frontend (.env):**
```
VITE_API_URL=http://localhost:5000
```

## Usage

1. **Register/Login:** Create an account or log in
2. **View Portfolio:** See your investment summary on the dashboard
3. **Add Investments:** Add stocks, bonds, or mutual funds
4. **Track Transactions:** View your buy/sell history
5. **Edit Investments:** Update existing investment details

## Docker Configuration

The application uses multi-stage Docker builds for optimization:
- **Frontend:** Nginx-served static build
- **Backend:** Node.js application
- **Database:** PostgreSQL container
- **All services** orchestrated with Docker Compose

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Protected API routes
- Input validation and sanitization
- CORS configuration

## Performance Considerations

- Frontend: Code splitting and lazy loading
- Backend: Database indexing and query optimization
- Caching strategies for frequently accessed data
- Optimized Docker images

## Future Enhancements

- Real-time stock price updates
- Portfolio analytics and charts
- Email notifications
- Export functionality
- Mobile responsiveness improvements

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request