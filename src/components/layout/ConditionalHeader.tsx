'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';

export default function ConditionalHeader() {
  const pathname = usePathname();

  // Do not show header on add or edit service pages
  if (
    pathname === '/services/new' ||
    (pathname.startsWith('/services/') && pathname.endsWith('/edit'))
  ) {
    return null;
  }

  return <Header />;
}
