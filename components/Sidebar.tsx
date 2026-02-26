'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const items = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Status Geral', href: '/status' }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full border-b bg-white p-4 md:min-h-screen md:w-60 md:border-b-0 md:border-r">
      <h1 className="mb-4 text-lg font-bold">Controle de Estudos</h1>
      <nav className="flex gap-2 md:flex-col">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'rounded-md px-3 py-2 text-sm transition hover:bg-slate-100',
              pathname === item.href && 'bg-slate-100 font-semibold'
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
