// Proxy service for better website embedding
export const PROXY_CONFIGS = {
  proxysite: {
    url: 'https://proxysite.pro/',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  },
  croxy: {
    url: 'https://croxyproxy.com/',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  },
  hide: {
    url: 'https://hide.me/en/proxy',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  }
};

export const getProxyUrl = (originalUrl) => {
  try {
    // Use proxysite as primary proxy for all sites
    return `${PROXY_CONFIGS.proxysite.url}${originalUrl}`;
  } catch (error) {
    console.error('Proxy URL generation error:', error);
    return originalUrl;
  }
};

export const getProxyHeaders = (domain) => {
  return PROXY_CONFIGS.proxysite.headers;
};

export const getAlternativeProxyUrl = (originalUrl) => {
  try {
    // Try alternative proxies if primary fails
    const alternatives = [
      `${PROXY_CONFIGS.croxy.url}${originalUrl}`,
      `${PROXY_CONFIGS.hide.url}${originalUrl}`,
      originalUrl // Fallback to original URL
    ];
    
    return alternatives[0] || originalUrl;
  } catch (error) {
    console.error('Alternative proxy URL generation error:', error);
    return originalUrl;
  }
};

export const getWorkingProxyUrl = (originalUrl) => {
  try {
    const url = new URL(originalUrl);
    const domain = url.hostname;
    
    // YouTube-specific handling to avoid IP blocking
    if (domain.includes('youtube.com') || domain.includes('youtu.be')) {
      // Use Invidious instance for YouTube to avoid blocking
      const invidiousInstances = [
        'https://yewtu.be',
        'https://yewtu.be', // Primary Invidious instance
        'https://invidious.snopyta.org',
        'https://yewtu.be' // Fallback
      ];
      
      // Convert YouTube URL to Invidious format
      if (domain.includes('youtube.com')) {
        const videoId = url.searchParams.get('v');
        if (videoId) {
          return `${invidiousInstances[0]}/watch?v=${videoId}`;
        }
        return `${invidiousInstances[0]}${url.pathname}${url.search}`;
      } else if (domain.includes('youtu.be')) {
        const videoId = url.pathname.substring(1);
        return `${invidiousInstances[0]}/watch?v=${videoId}`;
      }
    }
    
    // Social media, gaming, and search sites - use SSL Unblocker as primary
    if (domain.includes('instagram.com') || domain.includes('tiktok.com') || 
        domain.includes('poki.com') || domain.includes('crazygames.com') ||
        domain.includes('addictinggames.com') || domain.includes('miniclip.com')) {
      // Use SSL Unblocker for premium free access to latest versions
      return 'https://www.sslunblocker.com/'; // User enters URL manually for best experience
    }
    
    // Search engines - use SSL Unblocker for latest results
    if (domain.includes('google.com') || domain.includes('bing.com') || 
        domain.includes('yahoo.com') || domain.includes('duckduckgo.com')) {
      return 'https://www.sslunblocker.com/'; // User enters URL manually for best experience
    }
    
    // List of high-quality free proxy sites to try
    const workingProxies = [
      'https://www.sslunblocker.com/', // Primary - premium free proxy with latest versions
      'https://proxyium.com/', // Fallback to Proxyium
      'https://www.croxyproxy.com/', // Additional fallback
      'https://www.proxysite.com/proxy?url=',
      'https://hide.me/en/proxy?u=',
      'https://www.filterbypass.me/browse.php?u=',
      'https://r.jina.ai/http://' // Fallback for text content
    ];
    
    // For SSL Unblocker.com, return direct URL since it's browser-based
    if (workingProxies[0].includes('sslunblocker.com')) {
      return workingProxies[0]; // User will enter URL manually for best experience
    }
    
    // For other proxies, encode the URL
    const encodedUrl = encodeURIComponent(originalUrl);
    return `${workingProxies[1]}${encodedUrl}`;
  } catch (error) {
    console.error('Working proxy URL generation error:', error);
    return originalUrl;
  }
};
