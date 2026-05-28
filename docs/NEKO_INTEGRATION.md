# Neko Virtual Browser Integration

This document explains how Neko is integrated into skillRealms for the free web browsing feature.

## What is Neko?

Neko is a self-hosted virtual browser that runs in Docker and uses WebRTC. It provides:
- Real browser functionality (not limited by iframe restrictions)
- Better compatibility with modern websites
- WebRTC-based streaming for low latency
- Containerized environment for security

## Architecture

```
skillRealms Frontend → NekoBrowser Component → Neko Server (Docker) → Real Browser
```

## Setup Instructions

### 1. Deploy Neko Server

Run the deployment script:
```bash
./scripts/deploy-neko.sh
```

Or manually:
```bash
docker-compose -f docker-compose.neko.yml up -d
```

### 2. Configuration

Update `docker-compose.neko.yml`:
- `NEKO_PASSWORD`: User password (default: neko)
- `NEKO_PASSWORD_ADMIN`: Admin password (default: admin)
- `NEKO_NAT1TO1`: Your public IP address
- `NEKO_EPR`: Port range for WebRTC (default: 52000-52100)

### 3. Port Forwarding (for production)

Forward these ports on your router:
- `8080`: HTTP access
- `52000-52100/udp`: WebRTC media streaming

## Components

### NekoBrowser Component (`src/components/NekoBrowser.jsx`)

Handles the frontend integration:
- Creates iframe pointing to Neko instance
- Manages loading states and error handling
- Provides fallback UI for connection issues

### FreeWeb Integration (`src/pages/FreeWeb.jsx`)

Replaces the old iframe proxy with NekoBrowser:
- Maintains same UI/UX
- Preserves existing authentication and time limits
- Uses Neko for actual browser functionality

## Benefits over Iframe Proxy

1. **Better Compatibility**: Works with sites that block iframes
2. **Full Browser Features**: Supports all modern web technologies
3. **Security**: Isolated in Docker container
4. **Performance**: WebRTC streaming is more efficient than proxying
5. **No CORS Issues**: Real browser doesn't have same-origin restrictions

## Troubleshooting

### Neko won't start
```bash
docker-compose -f docker-compose.neko.yml logs
```

### Connection issues
1. Check if ports 8080 and 52000-52100 are open
2. Verify NEKO_NAT1TO1 has correct public IP
3. Check firewall settings

### Audio/Video not working
1. Ensure UDP ports 52000-52100 are open
2. Check browser permissions for microphone/camera
3. Verify WebRTC connectivity

## Production Considerations

1. **HTTPS**: Set up reverse proxy with SSL/TLS
2. **Authentication**: Consider OAuth integration
3. **Scaling**: Multiple Neko instances for load balancing
4. **Monitoring**: Add health checks and logging
5. **Security**: Regular updates and security scanning

## API Integration

The NekoBrowser component expects Neko to be available at:
```
http://localhost:8080/?url={encoded_url}
```

For production, update the URL in `NekoBrowser.jsx` to your public Neko instance.
