import React from 'react';
import { Outlet } from 'react-router-dom';

interface PageTransitionProps {
  children?: React.ReactNode;
}

/**
 * Simple wrapper that renders route content immediately.
 * Avoids animation libraries that can cause blank screens with React Router Outlet.
 */
export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  return (
    <div className="relative w-full min-h-full animate-[fadeIn_0.2s_ease-out]">
      {children || <Outlet />}
    </div>
  );
};

export default PageTransition;
