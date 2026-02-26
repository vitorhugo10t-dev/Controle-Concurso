'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useStudyStore } from '@/store/useStudyStore';

export function Header() {
  const search = useStudyStore((state) => state.search);
  const setSearch = useStudyStore((state) => state.setSearch);

  return (
    <header className="sticky top-0 z-20 border-b bg-white/95 p-4 backdrop-blur">
      <label className="relative block max-w-md">
        <span className="sr-only">Busca global</span>
        <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          aria-label="Busca global por matéria ou submatéria"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar matéria ou submatéria"
          className="pl-9"
        />
      </label>
    </header>
  );
}
