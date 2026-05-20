import React, { useEffect, useRef } from 'react';

const SimpleBrowser = ({ user, onError, onLoad }) => {
  const hasLoaded = useRef(false);
  
  useEffect(() => {
    if (!hasLoaded.current && onLoad) {
      hasLoaded.current = true;
      onLoad();
    }
  }, [onLoad]);

  return (
    <div className="w-full h-full bg-gray-900 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
        </div>
        <h3 className="text-white text-lg font-semibold mb-2">Virtual Browser Loading</h3>
        <p className="text-gray-400 text-sm">Signed in as: {user?.email || 'Unknown'}</p>
        <div className="mt-4 p-4 bg-gray-800 rounded-lg">
          <p className="text-gray-300 text-xs">Features:</p>
          <ul className="text-gray-400 text-xs mt-2 space-y-1">
            <li>• Windows Virtual Machine</li>
            <li>• Persistent Storage</li>
            <li>• Game Support (Roblox, Minecraft)</li>
            <li>• Fullscreen Mode</li>
            <li>• Download Support</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SimpleBrowser;
