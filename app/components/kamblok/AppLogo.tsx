'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';

export const AppLogo = () => {
  const { resolvedTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Default logos for SSR (pick one, e.g., light theme)
  const defaultLogoSrc = '/img/kamblok3-black.png';
  const defaultLogoSrc2 = '/img/kamblok2-black.png';

  // Use theme-dependent logos only after mounting
  const logoSrc = isMounted && resolvedTheme === 'dark' ? '/img/kamblok3-white.png' : defaultLogoSrc;
  const logoSrc2 = isMounted && resolvedTheme === 'dark' ? '/img/kamblok2-white.png' : defaultLogoSrc2;

  return (
    <div className="sidebar_header_logo">
      <Link href="/" className="flex gap-2">
        <Image
          src={logoSrc}
          alt="Kamblok"
          width={100}
          height={27}
          style={{ height: '27px', width: 'auto' }}
          priority={false}
        />
        <Image
          src={logoSrc2}
          alt="Kamblok"
          width={100}
          height={32}
          style={{ height: '32px', width: 'auto' }}
          priority={false}
        />
      </Link>
    </div>
  );
};