'use client';

import { useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStudyStore } from '@/store/useStudyStore';
import { formatStatus } from '@/lib/utils';

type FilterStatus = 'all' | 'concluido' | 'atencao' | 'pendente';
type OrderBy = 'nome' | 'questoes' | 'pendentes';

const COLORS = ['#16a34a', '#f59e0b', '#64748b'];

export default function StatusPage() {
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [orderBy, setOrderBy] = useState<OrderBy>('nome');
  const hydrated = useStudyStore((state) => state.hydrated);
  const subjects = useStudyStore((state) => state.subjects);
  const topics = useStudyStore((state) => state.topics);
  const search = useStudyStore((state) => state.search.toLowerCase());

  const filteredTopics = useMemo(() => {
    return topics.filter((topic) => {
      const matchStatus = statusFilter === 'all' || topic.status === statusFilter;
      const subject = subjects.find((item) => item.id === topic.subjectId);
      const term = `${subject?.name ?? ''} ${topic.name}`.toLowerCase();
      const matchSearch = !search || term.includes(search);
      return matchStatus && matchSearch;
    });
  }, [topics, statusFilter, search, subjects]);

  const stats = useMemo(() => {
    const totalQuestions = filteredTopics.reduce((sum, topic) => sum + topic.questionsDone, 0);
    return {
      concluido: filteredTopics.filter((topic) => topic.status === 'concluido').length,
      atencao: filteredTopics.filter((topic) => topic.status === 'atencao').length,
      pendente: filteredTopics.filter((topic) => topic.status === 'pendente').length,
      totalQuestions
    };
  }, [filteredTopics]);

  const statusChartData = [
    { name: 'Concluídas', value: stats.concluido },
    { name: 'Atenção', value: stats.atencao },
    { name: 'Pendentes', value: stats.pendente }
  ];

  const bySubject = useMemo(() => {
    const rows = subjects.map((subject) => {
      const related = filteredTopics.filter((topic) => topic.subjectId === subject.id);
      return {
        subject: subject.name,
        questions: related.reduce((sum, topic) => sum + topic.questionsDone, 0),
        pending: related.filter((topic) => topic.status === 'pendente').length
      };
    });

    return rows.sort((a, b) => {
      if (orderBy === 'questoes') return b.questions - a.questions;
      if (orderBy === 'pendentes') return b.pending - a.pending;
      return a.subject.localeCompare(b.subject);
    });
  }, [subjects, filteredTopics, orderBy]);

  if (!hydrated) {
    return <p className="text-sm text-muted-foreground">Carregando dados...</p>;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="Concluídas" value={stats.concluido} />
        <KpiCard title="Atenção" value={stats.atencao} />
        <KpiCard title="Pendentes" value={stats.pendente} />
        <KpiCard title="Total de questões feitas" value={stats.totalQuestions} />
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Filtro por status</label>
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as FilterStatus)}>
            <SelectTrigger aria-label="Filtro por status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="concluido">{formatStatus('concluido')}</SelectItem>
              <SelectItem value="atencao">{formatStatus('atencao')}</SelectItem>
              <SelectItem value="pendente">{formatStatus('pendente')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Ordenação</label>
          <Select value={orderBy} onValueChange={(value) => setOrderBy(value as OrderBy)}>
            <SelectTrigger aria-label="Ordenação">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nome">Nome</SelectItem>
              <SelectItem value="questoes">Mais questões</SelectItem>
              <SelectItem value="pendentes">Mais pendentes</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Distribuição de status</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusChartData} dataKey="value" nameKey="name" outerRadius={100} label>
                  {statusChartData.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Questões por matéria</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bySubject}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="questions" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function KpiCard({ title, value }: { title: string; value: number }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}
