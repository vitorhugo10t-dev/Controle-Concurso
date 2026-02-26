'use client';

import { create } from 'zustand';
import { Subject, Status, StudyData, Topic, studyDataSchema } from '@/lib/schemas';
import { clearStorageData, loadStorageData, saveStorageData } from '@/lib/storage';

interface StudyState {
  subjects: Subject[];
  topics: Topic[];
  hydrated: boolean;
  search: string;
  initialize: () => void;
  setSearch: (search: string) => void;
  addSubject: (name: string) => void;
  updateSubject: (id: string, name: string) => void;
  deleteSubject: (id: string) => void;
  addTopic: (subjectId: string, name: string, status?: Status, questionsDone?: number) => void;
  updateTopic: (id: string, patch: Partial<Pick<Topic, 'name' | 'status' | 'questionsDone'>>) => void;
  deleteTopic: (id: string) => void;
  exportData: () => StudyData;
  importData: (payload: unknown) => { success: boolean; error?: string };
  resetData: () => void;
}

const createSeedData = (): StudyData => {
  const constitucionalId = crypto.randomUUID();
  const administrativoId = crypto.randomUUID();

  return {
    subjects: [
      { id: constitucionalId, name: 'Direito Constitucional', createdAt: Date.now() - 1000 },
      { id: administrativoId, name: 'Direito Administrativo', createdAt: Date.now() }
    ],
    topics: [
      {
        id: crypto.randomUUID(),
        subjectId: constitucionalId,
        name: 'Controle de Constitucionalidade',
        status: 'pendente',
        questionsDone: 0,
        updatedAt: Date.now()
      },
      {
        id: crypto.randomUUID(),
        subjectId: constitucionalId,
        name: 'Direitos e Garantias Fundamentais',
        status: 'atencao',
        questionsDone: 15,
        updatedAt: Date.now()
      },
      {
        id: crypto.randomUUID(),
        subjectId: administrativoId,
        name: 'Atos Administrativos',
        status: 'pendente',
        questionsDone: 0,
        updatedAt: Date.now()
      },
      {
        id: crypto.randomUUID(),
        subjectId: administrativoId,
        name: 'Poderes Administrativos',
        status: 'concluido',
        questionsDone: 40,
        updatedAt: Date.now()
      }
    ]
  };
};

const persist = (subjects: Subject[], topics: Topic[]) => {
  saveStorageData({ subjects, topics });
};

export const useStudyStore = create<StudyState>((set, get) => ({
  subjects: [],
  topics: [],
  hydrated: false,
  search: '',
  initialize: () => {
    const existing = loadStorageData();
    if (existing) {
      set({ ...existing, hydrated: true });
      return;
    }
    const seeded = createSeedData();
    persist(seeded.subjects, seeded.topics);
    set({ ...seeded, hydrated: true });
  },
  setSearch: (search) => set({ search }),
  addSubject: (name) => {
    const normalized = name.trim();
    if (!normalized) return;
    const next = [...get().subjects, { id: crypto.randomUUID(), name: normalized, createdAt: Date.now() }];
    set({ subjects: next });
    persist(next, get().topics);
  },
  updateSubject: (id, name) => {
    const normalized = name.trim();
    if (!normalized) return;
    const next = get().subjects.map((subject) => (subject.id === id ? { ...subject, name: normalized } : subject));
    set({ subjects: next });
    persist(next, get().topics);
  },
  deleteSubject: (id) => {
    const nextSubjects = get().subjects.filter((subject) => subject.id !== id);
    const nextTopics = get().topics.filter((topic) => topic.subjectId !== id);
    set({ subjects: nextSubjects, topics: nextTopics });
    persist(nextSubjects, nextTopics);
  },
  addTopic: (subjectId, name, status = 'pendente', questionsDone = 0) => {
    const normalized = name.trim();
    if (!normalized) return;
    const nextTopics = [
      ...get().topics,
      {
        id: crypto.randomUUID(),
        subjectId,
        name: normalized,
        status,
        questionsDone: Math.max(0, Math.floor(questionsDone)),
        updatedAt: Date.now()
      }
    ];
    set({ topics: nextTopics });
    persist(get().subjects, nextTopics);
  },
  updateTopic: (id, patch) => {
    const nextTopics = get().topics.map((topic) => {
      if (topic.id !== id) return topic;
      return {
        ...topic,
        ...patch,
        name: patch.name !== undefined ? patch.name.trim() || topic.name : topic.name,
        questionsDone:
          patch.questionsDone !== undefined ? Math.max(0, Math.floor(patch.questionsDone)) : topic.questionsDone,
        updatedAt: Date.now()
      };
    });
    set({ topics: nextTopics });
    persist(get().subjects, nextTopics);
  },
  deleteTopic: (id) => {
    const nextTopics = get().topics.filter((topic) => topic.id !== id);
    set({ topics: nextTopics });
    persist(get().subjects, nextTopics);
  },
  exportData: () => ({ subjects: get().subjects, topics: get().topics }),
  importData: (payload) => {
    const parsed = studyDataSchema.safeParse(payload);
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0]?.message ?? 'JSON inválido' };
    }
    set({ ...parsed.data });
    persist(parsed.data.subjects, parsed.data.topics);
    return { success: true };
  },
  resetData: () => {
    clearStorageData();
    const seeded = createSeedData();
    set({ ...seeded });
    persist(seeded.subjects, seeded.topics);
  }
}));
