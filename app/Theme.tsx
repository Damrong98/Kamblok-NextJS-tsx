'use client';

import { useState, useEffect } from 'react';
import { cn } from '@lib/utils';
import { Icons } from '@components';
import { NavMenu } from './layouts/NavMenu';
import { AppLogo } from './components/kamblok/AppLogo';
import { Avatar } from './components/kamblok/Avatar';
import { DarkModeToggle } from './components/kamblok/DarkModeToggle';
import Link from 'next/link';

// Define props interface
interface ThemeProps {
  children: React.ReactNode;
}

export default function Theme({ children }: ThemeProps) {
  // Initialize isSidebarOpen based on client-side window width
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Set initial state and handle resize
  useEffect(() => {
    setIsMounted(true);
    const handleResize = () => {
      const isMobileView = window.innerWidth < 1080;
      setIsMobile(isMobileView);
      setIsSidebarOpen(window.innerWidth >= 1080);
    };

    // Set initial state
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = (): void => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = (): void => {
    setIsSidebarOpen(false);
  };

  // Set main content margin: no margin on mobile, use sidebar state on desktop
  const mainClass = isMounted && !isMobile && isSidebarOpen ? 'ml-64' : 'ml-0';

  return (
    <div className="flex min-h-screen transition-colors duration-300">
      {/* Sidebar */}
      <aside
        className={cn(
          'w-64 shadow-lg flex flex-col transition-all duration-300 transform fixed inset-y-0 left-0 z-50',
          'bg-[var(--background-alt)]',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="p-6 border-b border-sidebar-border dark:border-sidebar-border flex justify-between items-center">
          <AppLogo />
        </div>
        <NavMenu setIsSidebarOpen={setIsSidebarOpen} />
      </aside>

      {/* Overlay for Mobile */}
      {isMounted && isSidebarOpen && window.innerWidth < 1080 && (
        <div
          className={cn(
            'fixed inset-0 bg-gray-500 opacity-60 z-40 transition-all duration-500 ease-in-out',
            isSidebarOpen ? 'opacity-60' : 'opacity-0 pointer-events-none'
          )}
          onClick={closeSidebar}
          aria-label="Close Sidebar Overlay"
        />
      )}

      {/* Main Content */}
      <main
        className={cn(
          'w-full transition-all duration-300 ease-in-out flex flex-col justify-center',
          mainClass
        )}
      >
        {/* Header */}
        <header className="w-full flex justify-between h-[60px] items-center px-4">
          <div className="flex items-center">
            <button
              className={cn(
                'p-2 rounded-md hover:bg-sidebar-accent dark:bg-sidebar-background dark:text-sidebar-foreground dark:hover:bg-sidebar-accent'
              )}
              onClick={toggleSidebar}
              aria-label="Open Sidebar"
            >
              <Icons.menu className="w-5 h-5" />
            </button>
            <div
              className={cn(
                'transition-all duration-300 ease-in-out',
                isSidebarOpen
                  ? 'opacity-0 -translate-x-4 pointer-events-none'
                  : 'opacity-100 translate-x-0'
              )}
            >
              <AppLogo />
            </div>
          </div>
          <div className="flex gap-3 items-center">
            <Link href={"/"} className="bg-pink-600 hover:bg-pink-400 text-white text-sm rounded p-1 px-2">New Chat</Link>
            <div>
              <DarkModeToggle />
            </div>
            <Avatar src="no" alt="Damrong" />
          </div>
        </header>

        {/* Content */}
        <div className="mx-auto w-full">
          <div className="animate-in fade-in duration-300">{children}</div>
        </div>
      </main>
    </div>
  );
}