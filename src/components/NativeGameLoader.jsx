import React, { useState, useEffect, useRef } from 'react';
import { X, Maximize2, RotateCcw } from 'lucide-react';

const NativeGameLoader = ({ game, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);
  const iframeRef = useRef(null);

  useEffect(() => {
    // Create a custom iframe that looks like native content
    const iframe = document.createElement('iframe');
    iframe.src = game.url;
    iframe.style.cssText = `
      width: 100%;
      height: 100%;
      border: none;
      background: white;
      position: absolute;
      top: 0;
      left: 0;
    `;
    iframe.allowFullscreen = true;
    iframe.loading = 'eager';
    iframe.referrerPolicy = 'no-referrer';

    iframe.onload = () => {
      setIsLoading(false);
      iframe.focus();
    };

    iframe.onerror = () => {
      setIsLoading(false);
      setHasError(true);
    };

    if (containerRef.current) {
      containerRef.current.appendChild(iframe);
      iframeRef.current = iframe;
    }

    // Cleanup
    return () => {
      if (iframeRef.current && iframeRef.current.parentNode) {
        iframeRef.current.parentNode.removeChild(iframeRef.current);
      }
    };
  }, [game.url]);

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.log('Error attempting to enable fullscreen:', err);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleReload = () => {
    setIsLoading(true);
    setHasError(false);
    if (iframeRef.current) {
      iframeRef.current.src = game.url;
    }
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    };

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isFullscreen]);

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 bg-black bg-opacity-90 backdrop-blur-md border-b border-white border-opacity-10 z-10">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">🎮</span>
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">{game.name}</h1>
              <p className="text-purple-200 text-sm">{game.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleReload}
              className="flex items-center gap-2 px-4 py-2 bg-white bg-opacity-10 hover:bg-opacity-20 text-white rounded-lg transition-all border border-white border-opacity-20"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="text-sm font-medium">Reload</span>
            </button>
            <button
              onClick={handleFullscreen}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all"
            >
              <Maximize2 className="w-4 h-4" />
              <span className="text-sm font-medium">Fullscreen</span>
            </button>
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all"
            >
              <X className="w-4 h-4" />
              <span className="text-sm font-medium">Close</span>
            </button>
          </div>
        </div>
      </div>

      {/* Game Content */}
      <div className="w-full h-full pt-16">
        {isLoading && (
          <div className="flex flex-col items-center justify-center h-full text-white">
            <div className="w-16 h-16 border-4 border-white border-opacity-30 border-t-4 border-t-green-500 rounded-full animate-spin mb-4"></div>
            <div className="text-2xl font-bold mb-2">Loading {game.name}...</div>
            <div className="text-purple-200 text-center max-w-md">{game.description}</div>
          </div>
        )}

        {hasError && (
          <div className="flex flex-col items-center justify-center h-full text-white">
            <div className="text-6xl mb-4">⚠️</div>
            <div className="text-2xl font-bold mb-2">Game Loading Failed</div>
            <div className="text-purple-200 text-center max-w-md mb-6">
              Unable to load the game. Please check your connection and try again.
            </div>
            <button
              onClick={handleReload}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all"
            >
              Retry
            </button>
          </div>
        )}

        {!isLoading && !hasError && (
          <div ref={containerRef} className="w-full h-full">
            {/* Game iframe will be inserted here */}
          </div>
        )}
      </div>
    </div>
  );
};

export default NativeGameLoader;
