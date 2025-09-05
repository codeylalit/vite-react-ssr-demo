import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToHashElement = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;

    const id = hash.replace('#', '');

    // Try multiple times in case the element isn't in the DOM yet
    const scrollToElement = () => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'auto' }); // or 'smooth'
      } else {
        // Try again in 100ms
        setTimeout(scrollToElement, 100);
      }
    };

    scrollToElement();
  }, [hash]);

  return null;
};

export default ScrollToHashElement;
