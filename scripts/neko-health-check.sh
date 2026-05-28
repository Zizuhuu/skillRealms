#!/bin/bash

# Neko Health Check and Auto-Restart Script
echo "🏥 Neko Health Check Service"

NEKO_CONTAINER="skillrealms-neko-1"
NEKO_PORT=8080
HEALTH_CHECK_INTERVAL=30
MAX_FAILURES=3
FAILURE_COUNT=0

check_neko_health() {
    echo "🔍 Checking Neko health..."
    
    # Check if container is running
    if ! docker ps | grep -q $NEKO_CONTAINER; then
        echo "❌ Neko container is not running"
        return 1
    fi
    
    # Check if port is accessible
    if ! curl -s --connect-timeout 5 http://localhost:$NEKO_PORT > /dev/null; then
        echo "❌ Neko port $NEKO_PORT is not accessible"
        return 1
    fi
    
    # Check container health
    HEALTH_STATUS=$(docker inspect --format='{{.State.Health.Status}}' $NEKO_CONTAINER 2>/dev/null || echo "unknown")
    if [[ "$HEALTH_STATUS" == "unhealthy" ]]; then
        echo "❌ Neko container health status: $HEALTH_STATUS"
        return 1
    fi
    
    echo "✅ Neko is healthy"
    return 0
}

restart_neko() {
    echo "🔄 Restarting Neko..."
    
    # Stop existing container
    docker-compose -f docker-compose.neko.yml down
    
    # Wait a moment
    sleep 5
    
    # Start container
    docker-compose -f docker-compose.neko.yml up -d
    
    # Wait for startup
    echo "⏳ Waiting for Neko to start..."
    sleep 15
    
    # Verify it started
    if check_neko_health; then
        echo "✅ Neko restarted successfully"
        FAILURE_COUNT=0
        return 0
    else
        echo "❌ Failed to restart Neko"
        return 1
    fi
}

# Main health check loop
echo "🚀 Starting Neko health monitoring (checking every $HEALTH_CHECK_INTERVAL seconds)"
echo "Press Ctrl+C to stop"

while true; do
    if check_neko_health; then
        FAILURE_COUNT=0
        echo "✅ Health check passed"
    else
        FAILURE_COUNT=$((FAILURE_COUNT + 1))
        echo "⚠️  Health check failed ($FAILURE_COUNT/$MAX_FAILURES)"
        
        if [[ $FAILURE_COUNT -ge $MAX_FAILURES ]]; then
            echo "🚨 Maximum failures reached, attempting restart..."
            if restart_neko; then
                echo "✅ Recovery successful"
            else
                echo "❌ Recovery failed, manual intervention required"
                # Send notification or alert here if needed
                exit 1
            fi
        fi
    fi
    
    sleep $HEALTH_CHECK_INTERVAL
done
