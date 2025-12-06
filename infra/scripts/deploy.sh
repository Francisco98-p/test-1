#!/bin/bash

set -e

echo "🚀 Starting deployment..."

# Variables
ECR_REGISTRY="$1"
BACKEND_IMAGE="$ECR_REGISTRY/auto-blog-backend:latest"
FRONTEND_IMAGE="$ECR_REGISTRY/auto-blog-frontend:latest"

# Actualizar e instalar dependencias
echo "📦 Updating system packages..."
sudo apt-get update
sudo apt-get upgrade -y

# Instalar Docker si no está instalado
if ! command -v docker &> /dev/null; then
    echo "🐳 Installing Docker..."
    sudo apt-get install -y docker.io
    sudo systemctl start docker
    sudo systemctl enable docker
fi

# Instalar Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo "📦 Installing Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi

# Login a ECR
echo "🔐 Logging into ECR..."
aws ecr get-login-password --region us-east-1 | sudo docker login --username AWS --password-stdin $ECR_REGISTRY

# Pull latest images
echo "⬇️ Pulling latest Docker images..."
sudo docker pull $BACKEND_IMAGE
sudo docker pull $FRONTEND_IMAGE

# Crear docker-compose para producción
echo "📝 Creating production docker-compose..."
cat > docker-compose.prod.yml << EOF
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: blogdb
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: password123
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  backend:
    image: $BACKEND_IMAGE
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      PORT: 3000
      DATABASE_URL: postgresql://admin:password123@postgres:5432/blogdb
      HF_API_KEY: ${HF_API_KEY}
    depends_on:
      - postgres
    restart: unless-stopped

  frontend:
    image: $FRONTEND_IMAGE
    ports:
      - "80:80"
    environment:
      VITE_API_URL: http://localhost:3000/api
    depends_on:
      - backend
    restart: unless-stopped

volumes:
  postgres_data:
EOF

# Detener contenedores existentes
echo "🛑 Stopping existing containers..."
sudo docker-compose -f docker-compose.prod.yml down || true

# Iniciar nuevos contenedores
echo "🚀 Starting new containers..."
sudo docker-compose -f docker-compose.prod.yml up -d

# Verificar que los servicios estén corriendo
echo "✅ Checking services..."
sleep 10
sudo docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo "🎉 Deployment completed successfully!"
echo "🌐 Frontend: http://$(curl -s ifconfig.me)"
echo "🔧 Backend API: http://$(curl -s ifconfig.me):3000"