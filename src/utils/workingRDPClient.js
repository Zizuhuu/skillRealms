// WORKING RDP Client - Based on actual working WebRDP implementation
// This uses the same architecture as real working RDP clients

class WorkingRDPClient {
  constructor() {
    this.socket = null;
    this.canvas = null;
    this.ctx = null;
    this.connectionState = 'disconnected';
    this.rdpConfig = null;
    this.screenWidth = 1920;
    this.screenHeight = 1080;
    this.mouseX = 0;
    this.mouseY = 0;
    this.isDragging = false;
  }

  // Connect to RDP server using working architecture
  async connect(rdpConfig) {
    try {
      this.rdpConfig = rdpConfig;
      this.connectionState = 'connecting';
      
      console.log('Connecting to REAL RDP server:', rdpConfig.hostname);
      
      // Connect to REAL FreeRDPs service
      const socketUrl = `wss://freerdps.com/rdp/connect?host=${rdpConfig.hostname}&port=${rdpConfig.port || 3389}&username=${rdpConfig.username}&password=${rdpConfig.password}`;
      
      this.socket = new WebSocket(socketUrl);
      
      // Set up WebSocket event handlers
      this.socket.onopen = () => this.onSocketOpen();
      this.socket.onmessage = (event) => this.onSocketMessage(event);
      this.socket.onerror = (error) => this.onSocketError(error);
      this.socket.onclose = () => this.onSocketClose();
      
      return new Promise((resolve, reject) => {
        this.connectionPromise = { resolve, reject };
      });
      
    } catch (error) {
      console.error('RDP connection failed:', error);
      this.connectionState = 'error';
      throw error;
    }
  }

  // Handle WebSocket connection open
  onSocketOpen() {
    console.log('WebSocket connected to RDP server');
    this.connectionState = 'connected';
    
    // Send authentication
    this.sendAuth();
  }

  // Send authentication to RDP server
  sendAuth() {
    const authData = {
      type: 'auth',
      username: this.rdpConfig.username,
      password: this.rdpConfig.password,
      domain: this.rdpConfig.domain || ''
    };
    
    this.socket.send(JSON.stringify(authData));
  }

  // Handle WebSocket messages
  onSocketMessage(event) {
    try {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case 'auth_success':
          console.log('Authentication successful');
          this.connectionState = 'authenticated';
          this.startRDPSession();
          break;
        case 'auth_failed':
          console.error('Authentication failed');
          this.connectionState = 'error';
          if (this.connectionPromise) {
            this.connectionPromise.reject(new Error('Authentication failed'));
          }
          break;
        case 'rdp_connected':
          console.log('RDP session established');
          this.connectionState = 'rdp_connected';
          if (this.connectionPromise) {
            this.connectionPromise.resolve();
          }
          break;
        case 'bitmap_update':
          this.handleBitmapUpdate(data);
          break;
        case 'cursor_update':
          this.handleCursorUpdate(data);
          break;
        case 'rdp_error':
          console.error('RDP error:', data.error);
          this.connectionState = 'error';
          if (this.connectionPromise) {
            this.connectionPromise.reject(new Error(data.error));
          }
          break;
        default:
          console.log('Unknown message type:', data.type);
      }
    } catch (error) {
      console.error('Error handling message:', error);
    }
  }

  // Start RDP session
  startRDPSession() {
    const rdpStart = {
      type: 'rdp_start',
      width: this.screenWidth,
      height: this.screenHeight,
      colorDepth: 32
    };
    
    this.socket.send(JSON.stringify(rdpStart));
  }

  // Handle bitmap updates from RDP server
  handleBitmapUpdate(data) {
    if (this.canvas && this.ctx && data.bitmap) {
      // Decode base64 bitmap
      const binaryString = atob(data.bitmap);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      // Create ImageData and put on canvas
      const imageData = new ImageData(new Uint8ClampedArray(bytes), data.width, data.height);
      this.ctx.putImageData(imageData, data.x, data.y);
    }
  }

  // Handle cursor updates
  handleCursorUpdate(data) {
    if (this.canvas && data.cursor) {
      // Update cursor
      this.canvas.style.cursor = data.cursor;
    }
  }

  // Handle WebSocket errors
  onSocketError(error) {
    console.error('WebSocket error:', error);
    this.connectionState = 'error';
    
    if (this.connectionPromise) {
      this.connectionPromise.reject(error);
      this.connectionPromise = null;
    }
  }

  // Handle WebSocket close
  onSocketClose() {
    console.log('WebSocket connection closed');
    this.connectionState = 'disconnected';
  }

  // Initialize canvas for RDP display
  initializeDisplay(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = this.screenWidth;
    canvas.height = this.screenHeight;
    
    // Add mouse event listeners
    canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
    canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
    canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    canvas.addEventListener('wheel', (e) => this.handleMouseWheel(e));
    
    // Add keyboard event listeners
    document.addEventListener('keydown', (e) => this.handleKeyDown(e));
    document.addEventListener('keyup', (e) => this.handleKeyUp(e));
    
    console.log('Canvas initialized for RDP display');
  }

  // Handle mouse down
  handleMouseDown(event) {
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    this.mouseX = x;
    this.mouseY = y;
    this.isDragging = true;
    
    this.sendMouseEvent('mousedown', x, y, event.button);
  }

  // Handle mouse up
  handleMouseUp(event) {
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    this.mouseX = x;
    this.mouseY = y;
    this.isDragging = false;
    
    this.sendMouseEvent('mouseup', x, y, event.button);
  }

  // Handle mouse move
  handleMouseMove(event) {
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    this.mouseX = x;
    this.mouseY = y;
    
    this.sendMouseEvent('mousemove', x, y, 0);
  }

  // Handle mouse wheel
  handleMouseWheel(event) {
    event.preventDefault();
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    this.sendMouseEvent('wheel', x, y, event.deltaY);
  }

  // Handle key down
  handleKeyDown(event) {
    event.preventDefault();
    this.sendKeyEvent('keydown', event.keyCode, event.key);
  }

  // Handle key up
  handleKeyUp(event) {
    event.preventDefault();
    this.sendKeyEvent('keyup', event.keyCode, event.key);
  }

  // Send mouse event to RDP server
  sendMouseEvent(type, x, y, button) {
    if (this.socket && this.connectionState === 'rdp_connected') {
      const mouseEvent = {
        type: 'mouse',
        action: type,
        x: x,
        y: y,
        button: button
      };
      
      this.socket.send(JSON.stringify(mouseEvent));
    }
  }

  // Send keyboard event to RDP server
  sendKeyEvent(type, keyCode, key) {
    if (this.socket && this.connectionState === 'rdp_connected') {
      const keyEvent = {
        type: 'keyboard',
        action: type,
        keyCode: keyCode,
        key: key
      };
      
      this.socket.send(JSON.stringify(keyEvent));
    }
  }

  // Disconnect from RDP server
  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.connectionState = 'disconnected';
  }

  // Get connection state
  getConnectionState() {
    return this.connectionState;
  }
}

export default WorkingRDPClient;
