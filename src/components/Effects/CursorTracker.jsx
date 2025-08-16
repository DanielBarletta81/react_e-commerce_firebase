import { useEffect } from 'react';

const CursorTracker = () => {
  useEffect(() => {
    const handleMouseMove = (e) => {
      // Track cursor for product cards
      const productCards = document.querySelectorAll('.product-card');
      productCards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        card.style.setProperty('--mouse-x', `${x}%`);
        card.style.setProperty('--mouse-y', `${y}%`);
      });

      // Track cursor for nav links
      const navLinks = document.querySelectorAll('.nav-link');
      navLinks.forEach(link => {
        const rect = link.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        link.style.setProperty('--mouse-x', `${x}%`);
        link.style.setProperty('--mouse-y', `${y}%`);
      });
    };

    // Add event listener
    document.addEventListener('mousemove', handleMouseMove);

    // Cleanup
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return null; // This component doesn't render anything
};

export default CursorTracker;
