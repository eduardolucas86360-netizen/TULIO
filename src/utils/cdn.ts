/// <reference types="vite/client" />

/**
 * Utility function to resolve asset URLs through a Content Delivery Network (CDN).
 * 
 * In production, if VITE_CDN_URL is configured, it will prepend the CDN domain
 * to the asset path, ensuring it is served from the edge network closest to the user.
 * 
 * @param path The relative path to the asset (e.g., '/images/logo.png')
 * @returns The fully qualified CDN URL or the original path if no CDN is configured
 */
export function getCdnUrl(path: string): string {
  // Ensure the path starts with a slash if it's relative
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  // Get the CDN URL from environment variables
  const cdnBase = import.meta.env.VITE_CDN_URL;
  
  // If a CDN is configured and we're in production, use it
  if (cdnBase && import.meta.env.PROD) {
    // Remove trailing slash from CDN base if it exists
    const normalizedCdnBase = cdnBase.endsWith('/') 
      ? cdnBase.slice(0, -1) 
      : cdnBase;
      
    return `${normalizedCdnBase}${normalizedPath}`;
  }
  
  // Fallback to local path for development or if no CDN is configured
  return normalizedPath;
}

/**
 * Utility for external image optimization services (like Cloudinary, Imgix)
 * Demonstrates how to format URLs for an image CDN to automatically
 * resize, compress, and convert formats (e.g., to WebP/AVIF) at the edge.
 */
export function getOptimizedImageUrl(url: string, width?: number, quality = 80): string {
  // If it's already an optimized external URL (like YouTube thumbnails), return as is
  if (url.includes('youtube.com') || url.includes('ytimg.com')) {
    return url;
  }
  
  // Example implementation for a generic image CDN
  // In a real scenario, you would replace this with your specific provider's logic
  // e.g., Cloudinary: `https://res.cloudinary.com/demo/image/fetch/w_${width},q_${quality}/${url}`
  
  const cdnBase = import.meta.env.VITE_IMAGE_CDN_URL;
  if (cdnBase && import.meta.env.PROD) {
    const params = new URLSearchParams();
    if (width) params.append('w', width.toString());
    params.append('q', quality.toString());
    params.append('url', url);
    
    return `${cdnBase}/optimize?${params.toString()}`;
  }
  
  return url;
}
