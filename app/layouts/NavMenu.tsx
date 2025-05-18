'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@lib/utils';
import { Icons } from '@/components';

interface NavMenuProps {
  setIsSidebarOpen: (open: boolean) => void;
}

export function NavMenu({ setIsSidebarOpen }: NavMenuProps) {
  const pathname = usePathname(); // Get current pathname (e.g., "/chat")

  const navItems = [
    // { path: '/', label: 'Home' },
    { path: '/', label: 'Chat', icon: Icons.chat },
    { path: '/lesson', label: 'កិច្ចតែងការបង្រៀន', icon: Icons.lesson },
    { path: '/slide', label: 'ស្លាយ', icon: Icons.slide },
    { path: '/exam-paper', label: 'សំណួរប្រលង', icon: Icons.exam },
    { path: '/howtoteach', label: 'របៀបបង្រៀន', icon: Icons.teach },
  ];

  return (
    <nav className="flex flex-col p-4">
      {navItems.map((item) => (
        <Link
          key={item.path}
          href={item.path}
          className={cn(
            'p-2 rounded hover:bg-pink-400 hover:text-white flex items-center gap-2',
            pathname === item.path ? 'bg-pink-600 text-white' : '' // Highlight active route
          )}
          // onClick={() => setIsSidebarOpen(false)} // Close sidebar on mobile
        >
          <item.icon/>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}