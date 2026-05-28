# Neko Browser Setup Guide

## Why Neko Requires High System Resources

Neko runs a full desktop environment in your browser, which requires significant resources:

### Resource Requirements:
- **Minimum**: 1024×576@30fps, 2GB RAM
- **Recommended**: 1280×720@30fps, 4-8GB RAM
- **Best Performance**: 1280×720@30fps, 8GB+ RAM

### Why High Specs Are Needed:
- **Desktop Encoding**: Full screen capture at 30-60 FPS
- **Browser Engine**: Complete Chromium/Firefox instance server-side
- **Video Streaming**: Real-time multimedia compression
- **Network I/O**: Constant data transmission for user interactions

## Setup Options

### Option 1: Use Built-in BlockAway Fallback (Recommended)
✅ **No setup required** - Works immediately
✅ **No local resources** - All processing on BlockAway servers
✅ **Works on any device** - Just needs modern browser
✅ **30 minutes free time** - After completing lessons

### Option 2: Self-Hosted Neko Server

#### Prerequisites:
- Docker and Docker Compose installed
- 4GB+ RAM available
- Stable internet connection

#### Installation Steps:

1. **Install Docker**:
```bash
curl -sSL https://get.docker.com/ | CHANNEL=stable bash
```

2. **Install Docker Compose**:
```bash
sudo apt-get update
sudo apt-get install docker-compose-plugin
```

3. **Download and Start Neko**:
```bash
wget https://raw.githubusercontent.com/m1k1o/neko/master/docker-compose.yaml
sudo docker compose up -d
```

4. **Configure for Local Network** (Optional):
Edit `docker-compose.yaml` and add:
```yaml
environment:
  - NEKO_NAT1TO1=<your-local-ip>
```

#### Admin Access:
- **SSH**: Login via SSH for admin controls
- **GUI**: Browser-based admin panel
- **Resolution**: Can be adjusted in admin panel

## Free User Time System

### How It Works:
- **30 minutes** of free browsing after each completed lesson
- **Automatic tracking** via localStorage
- **Pro users** get unlimited time
- **Time resets** daily with lesson completion

### Time Management:
- Free users see countdown timer in browser
- Session automatically ends when time expires
- Pro users have no time restrictions

## Troubleshooting

### Common Issues:
1. **High Resource Usage**: Normal for desktop streaming
2. **Connection Failed**: Falls back to BlockAway automatically
3. **Time Expired**: Complete another lesson for more time

### Performance Tips:
- Use BlockAway fallback for better performance
- Close other browser tabs when using Neko
- Ensure stable internet connection

## Security Notes

- Neko sessions are isolated per user
- Admin can monitor active sessions
- All connections are logged
- Time limits enforced automatically

## Alternative Solutions

If Neko requirements are too high:
1. **BlockAway Fallback**: Built-in, no setup needed
2. **Direct Browsing**: Open sites in new tabs
3. **Lower Resolution**: Admin can reduce to 1024×576

## Support

For setup issues or questions:
- Check Docker logs: `sudo docker compose logs`
- Verify port availability: Ensure port 8080 is open
- Network configuration: Check NAT settings for local access
