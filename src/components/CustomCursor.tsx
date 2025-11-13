import { useEffect, useState } from 'react';

/**
 * CustomCursor - Lightning effect that follows the cursor
 * Does NOT hide the default cursor - just adds visual enhancement
 */
export const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', updatePosition);
    return () => window.removeEventListener('mousemove', updatePosition);
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-50"
      style={{
        background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(0, 255, 255, 0.15), transparent 40%)`,
      }}
    />
  );
};
