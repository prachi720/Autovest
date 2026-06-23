import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

interface MousePosition {
  x: number;
  y: number;
  normalizedX: number;
  normalizedY: number;
}

const MouseContext = createContext<MousePosition>({ x: 0, y: 0, normalizedX: 0, normalizedY: 0 });

export const useMouse = () => useContext(MouseContext);

export const MouseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [position, setPosition] = useState<MousePosition>({ x: 0, y: 0, normalizedX: 0, normalizedY: 0 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const normalizedX = (e.clientX / window.innerWidth - 0.5) * 2;
    const normalizedY = (e.clientY / window.innerHeight - 0.5) * 2;
    setPosition({ x: e.clientX, y: e.clientY, normalizedX, normalizedY });
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  return <MouseContext.Provider value={position}>{children}</MouseContext.Provider>;
};
