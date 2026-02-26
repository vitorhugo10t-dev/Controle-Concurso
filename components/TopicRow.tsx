'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Topic } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TableCell, TableRow } from '@/components/ui/table';
import { useStudyStore } from '@/store/useStudyStore';
import { ConfirmDialog } from '@/components/ConfirmDialog';

interface TopicRowProps {
  topic: Topic;
}

export function TopicRow({ topic }: TopicRowProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const updateTopic = useStudyStore((state) => state.updateTopic);
  const deleteTopic = useStudyStore((state) => state.deleteTopic);

  return (
    <>
      <TableRow>
        <TableCell>
          <Input
            aria-label="Nome da submatéria"
            value={topic.name}
            onChange={(event) => updateTopic(topic.id, { name: event.target.value })}
            className="h-9"
          />
        </TableCell>
        <TableCell>
          <Select value={topic.status} onValueChange={(value) => updateTopic(topic.id, { status: value as Topic['status'] })}>
            <SelectTrigger aria-label="Status da submatéria">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="concluido">Concluído</SelectItem>
              <SelectItem value="atencao">Atenção</SelectItem>
              <SelectItem value="pendente">Pendente</SelectItem>
            </SelectContent>
          </Select>
        </TableCell>
        <TableCell>
          <Input
            aria-label="Quantidade de questões"
            type="number"
            min={0}
            value={topic.questionsDone}
            onChange={(event) => updateTopic(topic.id, { questionsDone: Number(event.target.value) || 0 })}
            className="h-9"
          />
        </TableCell>
        <TableCell>
          <Button aria-label="Excluir submatéria" variant="ghost" size="icon" onClick={() => setConfirmOpen(true)}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </TableCell>
      </TableRow>
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Excluir submatéria"
        description="Essa ação não pode ser desfeita."
        onConfirm={() => deleteTopic(topic.id)}
      />
    </>
  );
}
