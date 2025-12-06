#!/bin/bash

# Script de inicialización para EC2
echo "🔧 Initializing EC2 instance..."

# Instalar AWS CLI
sudo apt-get update
sudo apt-get install -y awscli

# Crear directorio para la aplicación
mkdir -p /home/ubuntu/app
cd /home/ubuntu/app

# Clonar el repositorio (ajusta la URL)
git clone https://github.com/tu-usuario/technical-test.git .
cd infra/scripts

# Hacer ejecutables los scripts
chmod +x deploy.sh

echo "✅ EC2 initialization completed!"
echo "📝 Next steps:"
echo "1. Configure AWS credentials: aws configure"
echo "2. Run deployment: ./deploy.sh <your-ecr-registry>"