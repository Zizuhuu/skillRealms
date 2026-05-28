#!/bin/bash

# Neko Deployment Script for skillRealms
echo "🚀 Deploying Neko virtual browser..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Get the public IP (you may need to update this manually)
PUBLIC_IP=$(curl -s ifconfig.me 2>/dev/null || curl -s ipinfo.io/ip 2>/dev/null)
echo "📍 Detected public IP: $PUBLIC_IP"

# Update docker-compose.yml with the public IP
if [ ! -z "$PUBLIC_IP" ]; then
    sed -i.bak "s/your_public_ip/$PUBLIC_IP/g" docker-compose.neko.yml
    echo "✅ Updated docker-compose.neko.yml with public IP"
else
    echo "⚠️  Could not detect public IP. Please manually update NEKO_NAT1TO1 in docker-compose.neko.yml"
fi

# Stop existing Neko container if running
echo "🛑 Stopping existing Neko container..."
docker-compose -f docker-compose.neko.yml down 2>/dev/null || true

# Pull latest Neko image
echo "📦 Pulling latest Neko image..."
docker-compose -f docker-compose.neko.yml pull

# Start Neko container
echo "🚀 Starting Neko container..."
docker-compose -f docker-compose.neko.yml up -d

# Wait for Neko to be ready
echo "⏳ Waiting for Neko to start..."
sleep 10

# Check if Neko is running
if docker-compose -f docker-compose.neko.yml ps | grep -q "Up"; then
    echo "✅ Neko is running successfully!"
    echo "🌐 Neko should be available at: http://localhost:8080"
    echo "🔑 Default credentials:"
    echo "   User: neko"
    echo "   Admin: admin"
    echo ""
    echo "📝 To expose Neko publicly, you'll need to:"
    echo "   1. Configure port forwarding on your router (port 8080)"
    echo "   2. Update the NEKO_NAT1TO1 environment variable with your public IP"
    echo "   3. Consider setting up HTTPS with a reverse proxy"
else
    echo "❌ Failed to start Neko. Check the logs with:"
    echo "   docker-compose -f docker-compose.neko.yml logs"
    exit 1
fi

echo "🎉 Neko deployment complete!"
