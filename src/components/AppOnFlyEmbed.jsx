import React, { useState, useRef } from 'react';
import { Monitor, ExternalLink, AlertCircle } from 'lucide-react';

const AppOnFlyEmbed = ({ onError, onLoad }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const vmWindowRef = useRef(null);

  const launchAppOnFly = () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Create about:blank window first
      const aboutBlankWindow = window.open('about:blank', '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes,toolbar=yes,menubar=yes');
      
      if (!aboutBlankWindow) {
        throw new Error('Popup blocked. Please allow popups for this site.');
      }

      // Write the AppOnFly embedding HTML
      const appOnFlyHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>AppOnFly Virtual Desktop</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body, html { 
              width: 100%; 
              height: 100%; 
              overflow: hidden; 
              background: #1a1a1a;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
            .loading {
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
              color: white;
              font-size: 18px;
            }
            .spinner {
              width: 40px;
              height: 40px;
              border: 4px solid #333;
              border-top: 4px solid #4CAF50;
              border-radius: 50%;
              animation: spin 1s linear infinite;
              margin-right: 15px;
            }
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            iframe {
              border: none;
              width: 100%;
              height: 100%;
              position: absolute;
              top: 0;
              left: 0;
            }
            .error {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100vh;
              color: #ff6b6b;
              text-align: center;
              padding: 20px;
            }
            .error-icon {
              font-size: 48px;
              margin-bottom: 20px;
            }
            .retry-btn {
              margin-top: 20px;
              padding: 10px 20px;
              background: #4CAF50;
              color: white;
              border: none;
              border-radius: 5px;
              cursor: pointer;
              font-size: 16px;
            }
            .retry-btn:hover {
              background: #45a049;
            }
          </style>
        </head>
        <body>
          <div id="loading" class="loading">
            <div class="spinner"></div>
            Loading AppOnFly Virtual Desktop...
          </div>
          <div id="error" class="error" style="display: none;">
            <div class="error-icon">⚠️</div>
            <h2>Failed to load AppOnFly</h2>
            <p id="error-message">Please check your connection and try again.</p>
            <button class="retry-btn" onclick="location.reload()">Retry</button>
          </div>
          <iframe 
            id="apponfly-frame"
            src="https://www.apponfly.com" 
            onload="document.getElementById('loading').style.display='none'"
            onerror="document.getElementById('loading').style.display='none'; document.getElementById('error').style.display='flex';"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
            allowfullscreen
            loading="eager">
          </iframe>
          
          <script>
            // Handle iframe loading errors
            const iframe = document.getElementById('apponfly-frame');
            const errorDiv = document.getElementById('error');
            const loadingDiv = document.getElementById('loading');
            const errorMessage = document.getElementById('error-message');
            
            iframe.addEventListener('error', function() {
              loadingDiv.style.display = 'none';
              errorDiv.style.display = 'flex';
              errorMessage.textContent = 'Failed to load AppOnFly. The service might be temporarily unavailable.';
            });
            
            // Timeout handling
            setTimeout(function() {
              if (loadingDiv.style.display !== 'none') {
                loadingDiv.style.display = 'none';
                errorDiv.style.display = 'flex';
                errorMessage.textContent = 'Loading timed out. Please check your internet connection.';
              }
            }, 15000);
            
            // Prevent right-click and certain keyboard shortcuts for security
            document.addEventListener('contextmenu', function(e) {
              e.preventDefault();
              return false;
            });
            
            document.addEventListener('keydown', function(e) {
              if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
                e.preventDefault();
                return false;
              }
            });
          </script>
        </body>
        </html>
      `;

      // Write the HTML to the about:blank window
      aboutBlankWindow.document.write(appOnFlyHTML);
      aboutBlankWindow.document.close();
      
      vmWindowRef.current = aboutBlankWindow;
      setIsLoading(false);
      
      if (onLoad) {
        onLoad();
      }

    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      if (onError) {
        onError(err);
      }
    }
  };

  const focusWindow = () => {
    if (vmWindowRef.current && !vmWindowRef.current.closed) {
      vmWindowRef.current.focus();
    }
  };

  const closeWindow = () => {
    if (vmWindowRef.current && !vmWindowRef.current.closed) {
      vmWindowRef.current.close();
      vmWindowRef.current = null;
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6 max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <Monitor className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">AppOnFly Virtual Desktop</h2>
        <p className="text-gray-400">
          Access a cloud-based Windows desktop through AppOnFly
        </p>
      </div>

      {error && (
        <div className="bg-red-600 text-white p-4 rounded-lg mb-4 flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex gap-4 justify-center">
        <button
          onClick={launchAppOnFly}
          disabled={isLoading}
          className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg transition-colors flex items-center gap-2"
        >
          <Monitor className="w-5 h-5" />
          {isLoading ? 'Launching...' : 'Launch Virtual Desktop'}
        </button>

        {vmWindowRef.current && !vmWindowRef.current.closed && (
          <>
            <button
              onClick={focusWindow}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <ExternalLink className="w-5 h-5" />
              Focus Window
            </button>
            
            <button
              onClick={closeWindow}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Close
            </button>
          </>
        )}
      </div>

      <div className="mt-6 text-center text-gray-400 text-sm">
        <p>Note: This will open AppOnFly in a new window. Please allow popups if blocked.</p>
        <p className="mt-2">Service provided by AppOnFly - cloud Windows desktop solution.</p>
      </div>
    </div>
  );
};

export default AppOnFlyEmbed;
