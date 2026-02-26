'use client';

import { useMemo, useState } from 'react';
import { SubjectCard } from '@/components/SubjectCard';
import { ImportExportDialog } from '@/components/ImportExportDialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useStudyStore } from '@/store/useStudyStore';

export default function DashboardPage() {
  const [subjectOpen, setSubjectOpen] = useState(false);
  const [subjectName, setSubjectName] = useState('');
  const hydrated = useStudyStore((state) => state.hydrated);
  const subjects = useStudyStore((state) => state.subjects);
  const topics = useStudyStore((state) => state.topics);
  const search = useStudyStore((state) => state.search.toLowerCase());
  const addSubject = useStudyStore((state) => state.addSubject);

  const filtered = useMemo(() => {
    if (!search) return subjects;
    return subjects.filter((subject) => {
      const subjectMatch = subject.name.toLowerCase().includes(search);
      const topicMatch = topics.some(
        (topic) => topic.subjectId === subject.id && topic.name.toLowerCase().includes(search)
      );
      return subjectMatch || topicMatch;
    });
  }, [search, subjects, topics]);

  const totalQuestions = topics.reduce((sum, topic) => sum + topic.questionsDone, 0);

  if (!hydrated) {
    return <p className="text-sm text-muted-foreground">Carregando dados...</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Dialog open={subjectOpen} onOpenChange={setSubjectOpen}>
          <DialogTrigger asChild>
            <Button>Adicionar Matéria</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Matéria</DialogTitle>
              <DialogDescription>Adicione uma matéria para organizar as submatérias.</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <Input
                aria-label="Nome da matéria"
                value={subjectName}
                onChange={(event) => setSubjectName(event.target.value)}
                placeholder="Ex: Português"
              />
              <div className="flex justify-end">
                <Button
                  onClick={() => {
                    addSubject(subjectName);
                    setSubjectName('');
                    setSubjectOpen(false);
                  }}
                >
                  Adicionar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        <ImportExportDialog />
      </div>

      <Card>
        <CardContent className="flex flex-wrap gap-2 pt-6">
          <Badge variant="secondary">Matérias: {subjects.length}</Badge>
          <Badge variant="secondary">Submatérias: {topics.length}</Badge>
          <Badge>Total de questões: {totalQuestions}</Badge>
        </CardContent>
      </Card>

      <Tabs defaultValue="cards">
        <TabsList>
          <TabsTrigger value="cards">Cards</TabsTrigger>
          <TabsTrigger value="resumo">Resumo</TabsTrigger>
        </TabsList>
        <TabsContent value="cards">
          <section className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3">
            {filtered.map((subject) => (
              <SubjectCard key={subject.id} subject={subject} />
            ))}
            {filtered.length === 0 && (
              <p className="text-sm text-muted-foreground">Nenhuma matéria encontrada para o termo da busca.</p>
            )}
          </section>
        </TabsContent>
        <TabsContent value="resumo">
          <Card>
            <CardContent className="pt-6 text-sm text-muted-foreground">
              Use a aba Status Geral para visualizar KPIs e gráficos com os dados consolidados.
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
