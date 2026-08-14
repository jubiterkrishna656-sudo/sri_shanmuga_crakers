import { useEffect } from 'react';

const BASE_TITLE = 'Sri Shanmuga Grand Crackers - Premium Fireworks & Crackers Online | Sivakasi';
const BASE_DESCRIPTION = 'Buy certified premium crackers online at factory prices. Flower pots, sparklers, rockets, gift boxes & more from Sivakasi with free delivery across Tamil Nadu above ₹2500.';

function setMeta(selector, attr, value) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}

export default function Seo({ title, description }) {
  useEffect(() => {
    document.title = title ? `${title} | Sri Shanmuga Grand Crackers` : BASE_TITLE;
    setMeta('meta[name="description"]', 'content', description || BASE_DESCRIPTION);
    setMeta('meta[name="robots"]', 'content', 'index, follow');

    const url = window.location.origin + window.location.pathname;
    const pageTitle = title ? `${title} | Sri Shanmuga Grand Crackers` : BASE_TITLE;
    const pageDesc = description || BASE_DESCRIPTION;

    setMeta('meta[property="og:title"]', 'content', pageTitle);
    setMeta('meta[property="og:description"]', 'content', pageDesc);
    setMeta('meta[property="og:url"]', 'content', url);
    setMeta('meta[name="twitter:title"]', 'content', pageTitle);
    setMeta('meta[name="twitter:description"]', 'content', pageDesc);

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);
  }, [title, description]);

  return null;
}
