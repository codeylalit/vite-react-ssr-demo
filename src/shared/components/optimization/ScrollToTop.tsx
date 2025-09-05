// ScrollToTop.tsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // This jumps to the top instantly (no animation)
    document.documentElement.style.scrollBehavior = 'auto'; // override any global smooth scroll
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
