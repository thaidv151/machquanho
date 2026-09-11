/**
 * Dynamic SEO & OpenGraph Meta Tag Manager for Single Page Application
 */

interface SeoMetaData {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}

export function updateSeoMeta({
  title,
  description,
  keywords,
  image,
  url,
}: SeoMetaData) {
  const defaultTitle = 'Mạch Quan Họ - Giữ mạch di sản, Khơi mạch tương lai';
  const defaultDescription = 'Nền tảng lưu giữ, số hóa và phát triển Di sản Văn hóa Phi vật thể Dân ca Quan họ Bắc Ninh.';
  const defaultKeywords = 'Mạch Quan Họ, Quan họ Bắc Ninh, Dân ca Quan họ, Di sản văn hóa, Kinh Bắc, Hát giao duyên';
  const defaultImage = 'https://machquanho.com/logo-machquanho.png';
  const defaultUrl = window.location.href;

  const finalTitle = title ? `${title} | Mạch Quan Họ` : defaultTitle;
  const finalDesc = description || defaultDescription;
  const finalKeywords = keywords || defaultKeywords;
  const finalImage = image || defaultImage;
  const finalUrl = url || defaultUrl;

  // 1. Update Document Title
  document.title = finalTitle;

  // Helper to set or create meta tag
  const setMetaTag = (selector: string, attributeName: string, attributeValue: string, content: string) => {
    let element = document.querySelector(selector);
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attributeName, attributeValue);
      document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  };

  // 2. Standard Meta Tags
  setMetaTag('meta[name="description"]', 'name', 'description', finalDesc);
  setMetaTag('meta[name="keywords"]', 'name', 'keywords', finalKeywords);

  // 3. Open Graph (Facebook / Zalo / LinkedIn)
  setMetaTag('meta[property="og:title"]', 'property', 'og:title', finalTitle);
  setMetaTag('meta[property="og:description"]', 'property', 'og:description', finalDesc);
  setMetaTag('meta[property="og:image"]', 'property', 'og:image', finalImage);
  setMetaTag('meta[property="og:url"]', 'property', 'og:url', finalUrl);
  setMetaTag('meta[property="og:type"]', 'property', 'og:type', 'website');

  // 4. Twitter Card
  setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
  setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', finalTitle);
  setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', finalDesc);
  setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', finalImage);

  // 5. Canonical Link
  let canonicalLink = document.querySelector('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute('href', finalUrl);
}
