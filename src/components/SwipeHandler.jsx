import { useEffect, useRef } from 'react';

const SwipeHandler = ({ onSwipeLeft, onSwipeRight, threshold = 100, restraint = 100, isTablet = false }) => {
  const startX = useRef(0);
  const startY = useRef(0);
  const distX = useRef(0);
  const distY = useRef(0);
  const startTime = useRef(0);
  const allowedTime = isTablet ? 800 : 500; // More time allowed for tablets

  useEffect(() => {
    const handleTouchStart = (e) => {
      const touchobj = e.changedTouches[0];
      startX.current = touchobj.pageX;
      startY.current = touchobj.pageY;
      startTime.current = new Date().getTime();
      
      // For tablets, prevent default to ensure gestures work
      if (isTablet) {
        e.preventDefault();
      }
    };

    const handleTouchEnd = (e) => {
      const touchobj = e.changedTouches[0];
      distX.current = touchobj.pageX - startX.current;
      distY.current = touchobj.pageY - startY.current;
      const elapsedTime = new Date().getTime() - startTime.current;

      // Check if it's a valid swipe
      if (elapsedTime <= allowedTime) {
        // Check if horizontal distance is within threshold and vertical distance is within restraint
        if (Math.abs(distX.current) >= threshold && Math.abs(distY.current) <= restraint) {
          // Enhanced area detection for tablets vs mobile
          const screenCenterY = window.innerHeight / 2;
          const touchY = touchobj.pageY;
          
          // For tablets: Allow gestures from a much larger area (80% of screen)
          // For mobile: Keep original smaller area (30% of screen)
          const centerThreshold = isTablet ? 
            window.innerHeight * 0.4 : 
            window.innerHeight * 0.3;

          // Allow swipes from almost anywhere on tablets, center area on mobile
          const isInValidArea = isTablet ? 
            touchY > window.innerHeight * 0.05 && touchY < window.innerHeight * 0.95 :
            Math.abs(touchY - screenCenterY) <= centerThreshold;

          if (isInValidArea) {
            if (distX.current > 0) {
              // Right swipe
              onSwipeRight?.();
            } else {
              // Left swipe
              onSwipeLeft?.();
            }
            
            // For tablets, prevent default to avoid browser navigation
            if (isTablet) {
              e.preventDefault();
            }
          }
        }
      }
    };

    // Add event listeners to document for global swipe detection
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onSwipeLeft, onSwipeRight, threshold, restraint, isTablet]);

  return null; // This component doesn't render anything
};

export default SwipeHandler;
