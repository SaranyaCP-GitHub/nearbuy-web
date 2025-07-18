# NearBuy - Vue.js E-commerce Application

## Docker Setup

This application includes Docker configuration for both development and production environments.

### Production Build

To build and run the production version:

```bash
# Build the Docker image
docker build -t nearbuy-app .

# Run the container
docker run -p 80 nearbuy-app
```

Or using Docker Compose:

```bash
# Build and run with docker-compose
docker-compose up --build

# Run in background
docker-compose up -d --build
```

The application will be available at `http://localhost:80`

### Development Build

For development with hot reloading:

```bash
# Build and run development container
docker-compose --profile dev up --build

# Or build manually
docker build -f Dockerfile.dev -t nearbuy-dev .
docker run -p 3000:3000 -v $(pwd):/app nearbuy-dev
```

The development server will be available at `http://localhost:3000`

### Docker Commands

```bash
# Stop containers
docker-compose down

# View logs
docker-compose logs -f

# Access container shell
docker exec -it nearbuy-frontend sh

# Remove all containers and images
docker-compose down --rmi all --volumes --remove-orphans
```

### Environment Variables

You can customize the application by setting environment variables:

```bash
# Production
docker run -p 80 -e NODE_ENV=production nearbuy-app

# Development
docker run -p 80 -e NODE_ENV=development nearbuy-dev
```

### Health Check

The production container includes a health check endpoint at `/health` that returns "healthy" when the application is running properly.

## Local Development (without Docker)

If you prefer to run the application locally without Docker:

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```
