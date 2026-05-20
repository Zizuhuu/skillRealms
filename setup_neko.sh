#!/bin/bash

echo "Setting up Neko Browser Server..."

# Check if Docker is available
if ! command -v docker &> /dev/null; then
    echo "Docker is not installed. Please install Docker Desktop first."
    echo "Download from: https://www.docker.com/products/docker-desktop"
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "Installing Docker Compose plugin..."
    sudo apt-get update
    sudo apt-get install docker-compose-plugin
fi

# Download docker-compose file if not exists
if [ ! -f "docker-compose.yaml" ]; then
    echo "Downloading Neko docker-compose file..."
    wget https://raw.githubusercontent.com/m1k1o/neko/master/docker-compose.yaml
fi

# Start Neko container
echo "Starting Neko container..."
sudo docker compose up -d

echo "Neko server setup complete!"
echo "Access at: http://localhost:8080"
echo "User: neko"
echo "Admin: admin"
