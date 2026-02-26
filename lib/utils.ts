import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatStatus(status: 'concluido' | 'atencao' | 'pendente') {
  return {
    concluido: 'Concluído',
    atencao: 'Atenção',
    pendente: 'Pendente'
  }[status];
}
