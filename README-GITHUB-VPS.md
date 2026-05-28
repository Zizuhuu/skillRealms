# GitHub Actions Windows VPS Setup

This guide shows you how to set up a free Windows VPS using GitHub Actions and ngrok tunneling.

## 🚀 Quick Setup

### 1. Get Ngrok Auth Token

1. Sign up for a free ngrok account at [https://ngrok.com](https://ngrok.com)
2. Go to your ngrok dashboard → Auth Tokens
3. Copy your authtoken (it looks like: `2abcdef1234567890abcdef1234567890`)

### 2. Add Ngrok Token to GitHub Secrets

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `NGROK_AUTH_TOKEN`
5. Value: Paste your ngrok authtoken
6. Click **Add secret**

### 3. Run the Workflow

1. Go to **Actions** tab in your GitHub repository
2. Select **Windows VPS with Ngrok** workflow
3. Click **Run workflow** → **Run workflow**
4. Wait for the workflow to start (takes 2-3 minutes)

### 4. Get Your VPS Connection Details

Once the workflow is running, check the workflow logs for:

```
=== Windows VPS Connection Information ===
RDP URL: tcp://6.tcp.ngrok.io:12345
Web URL: https://abc123.ngrok-free.app
Username: vpsuser
Password: SkillRealms2024!
==========================================
```

### 5. Connect to Your Windows VPS

#### Option A: RDP Connection
1. Open Windows Remote Desktop Connection
2. Enter the RDP URL (e.g., `tcp://6.tcp.ngrok.io:12345`)
3. Username: `vpsuser`
4. Password: `SkillRealms2024!`
5. Click Connect

#### Option B: Web Interface
1. Open the Web URL in your browser
2. See the VPS status and information
3. Use the web interface for basic monitoring

## 🔧 Configuration Details

### What the Workflow Does

1. **Spins up a Windows VM** - Uses GitHub Actions' Windows Server 2022 runner
2. **Enables RDP** - Configures Remote Desktop Protocol
3. **Creates User Account** - Sets up `vpsuser` with admin privileges
4. **Starts Ngrok Tunnel** - Creates secure tunnel to RDP port 3389
5. **Sets up Web Interface** - Simple status page at port 8080
6. **Runs for 6 Hours** - Maximum GitHub Actions workflow duration

### VM Specifications

- **OS**: Windows Server 2022
- **RAM**: 7GB
- **CPU**: 2 cores
- **Storage**: 14GB SSD
- **Runtime**: 6 hours maximum
- **Cost**: Free (GitHub Actions free tier)

## 📝 Updating the Application

Once you have your ngrok URL, update the Base64 encoded URL in the application:

1. Get your ngrok URL from the workflow logs
2. Encode it to Base64: `echo "https://your-ngrok-url.ngrok-free.app" | base64`
3. Update the encoded URL in:
   - `src/components/RealWindowsVPS.jsx`
   - `src/utils/realHypervisorVPS.js`

## 🔄 Automatic Restart

The workflow is scheduled to run every 6 hours to keep the VPS alive. You can also manually trigger it anytime from the Actions tab.

## 🛠️ Troubleshooting

### Common Issues

1. **Ngrok URL not working**
   - Make sure you added the NGROK_AUTH_TOKEN secret
   - Check the workflow logs for ngrok errors

2. **RDP Connection Failed**
   - Verify the ngrok URL is correct
   - Make sure you're using the right username/password
   - Check if the workflow is still running

3. **Workflow Times Out**
   - GitHub Actions has a 6-hour limit
   - Just run the workflow again to get a new VPS

### Getting Help

- Check the workflow logs for detailed error messages
- Ensure all GitHub secrets are correctly configured
- Make sure your ngrok account is active

## 🎯 Tips

- **Save your work**: The VPS is temporary (6 hours max)
- **Multiple connections**: You can connect multiple times to the same VPS
- **Web interface**: Use the web URL to check VPS status without RDP
- **Automation**: The workflow can be scheduled to run automatically

## 📋 Workflow Files

- `.github/workflows/windows-vps.yml` - Main workflow file
- Creates Windows VM with ngrok tunneling
- Runs for up to 6 hours
- Provides both RDP and web interface access

Enjoy your free Windows VPS! 🖥️
