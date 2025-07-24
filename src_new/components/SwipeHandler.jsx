import { useEffect, useRef } from 'react';

const SwipeHandler = ({ onSwipeLeft, onSwipeRight, threshold = 100, restraint = 100 }) => {
  const startX = useRef(0);
  const startY = useRef(0);
  const distX = useRef(0);
  const distY = useRef(0);
  const startTime = useRef(0);
  const allowedTime = 300; // Maximum time allowed to travel that distance

  useEffect(() => {
    const handleTouchStart = (e) => {
      const touchobj = e.changedTouches[0];
      startX.current = touchobj.pageX;
      startY.current = touchobj.pageY;
      startTime.current = new Date().getTime();
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
          // Get the center area of the screen for swipe detection
          const screenCenterY = window.innerHeight / 2;
          const touchY = touchobj.pageY;
          const centerThreshold = window.innerHeight * 0.3; // 30% of screen height around center

          // Only trigger swipe if touch is in the center area
          if (Math.abs(touchY - screenCenterY) <= centerThreshold) {
            if (distX.current > 0) {
              // Right swipe
              onSwipeRight?.();
            } else {
              // Left swipe
              onSwipeLeft?.();
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
  }, [onSwipeLeft, onSwipeRight, threshold, restraint]);

  return null; // This component doesn't render anything
};

export default SwipeHandler;
