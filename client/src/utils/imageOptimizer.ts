/**
 * Helper to optimize external images (e.g. Unsplash CDN images)
 * by appending width, quality, and format parameters.
 */
export function getOptimizedImageUrl(url: string | undefined, width = 800, quality = 75): string {
  if (!url) return '';
  
  // If it's an Unsplash URL, replace or append width and quality
  if (url.includes('images.unsplash.com')) {
    try {
      const parsedUrl = new URL(url);
      parsedUrl.searchParams.set('w', width.toString());
      parsedUrl.searchParams.set('q', quality.toString());
      parsedUrl.searchParams.set('auto', 'format');
      parsedUrl.searchParams.set('fit', 'crop');
      return parsedUrl.toString();
    } catch {
      return url;
    }
  }

  return url;
}
