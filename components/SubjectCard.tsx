'use client';

import { useMemo, useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { Subject } from '@/lib/schemas';
import { useStudyStore } from '@/store/useStudyStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TopicRow } from '@/components/TopicRow';
import { ConfirmDialog } from '@/components/ConfirmDialog';

export function SubjectCard({ subject }: { subject: Subject }) {
  const [newTopicName, setNewTopicName] = useState('');
  const [editName, setEditName] = useState(subject.name);
  const [topicOpen, setTopicOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const topics = useStudyStore((state) => state.topics.filter((topic) => topic.subjectId === subject.id));
  const addTopic = useStudyStore((state) => state.addTopic);
  const updateSubject = useStudyStore((state) => state.updateSubject);
  const deleteSubject = useStudyStore((state) => state.deleteSubject);

  const questionsTotal = useMemo(() => topics.reduce((sum, topic) => sum + topic.questionsDone, 0), [topics]);

  return (
    <Card>
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg">{subject.name}</CardTitle>
          <div className="flex gap-1">
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <DialogTrigger asChild>
                <Button size="icon" variant="ghost" aria-label="Editar matéria">
                  <Pencil className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Editar Matéria</DialogTitle>
                  <DialogDescription>Atualize o nome da matéria.</DialogDescription>
                </DialogHeader>
                <div className="space-y-3">
                  <Input aria-label="Nome da matéria" value={editName} onChange={(event) => setEditName(event.target.value)} />
                  <div className="flex justify-end">
                    <Button
                      onClick={() => {
                        updateSubject(subject.id, editName);
                        setEditOpen(false);
                      }}
                    >
                      Salvar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Button size="icon" variant="ghost" aria-label="Excluir matéria" onClick={() => setConfirmOpen(true)}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          {topics.length} submatérias • {questionsTotal} questões
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        <Dialog open={topicOpen} onOpenChange={setTopicOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Submatéria
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Submatéria</DialogTitle>
              <DialogDescription>Crie uma nova submatéria para {subject.name}.</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <Input
                aria-label="Nome da nova submatéria"
                value={newTopicName}
                onChange={(event) => setNewTopicName(event.target.value)}
                placeholder="Ex: Licitações"
              />
              <div className="flex justify-end">
                <Button
                  onClick={() => {
                    addTopic(subject.id, newTopicName);
                    setNewTopicName('');
                    setTopicOpen(false);
                  }}
                >
                  Adicionar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Submatéria</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Questões</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {topics.map((topic) => (
                <TopicRow key={topic.id} topic={topic} />
              ))}
              {topics.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    Nenhuma submatéria cadastrada.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Excluir matéria"
        description="A matéria e todas as submatérias serão removidas."
        onConfirm={() => deleteSubject(subject.id)}
      />
    </Card>
  );
}
