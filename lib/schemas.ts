import { z } from 'zod';

export const statusSchema = z.enum(['concluido', 'atencao', 'pendente']);

export const subjectSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  createdAt: z.number()
});

export const topicSchema = z.object({
  id: z.string().uuid(),
  subjectId: z.string().uuid(),
  name: z.string().min(1),
  status: statusSchema,
  questionsDone: z.number().int().min(0),
  updatedAt: z.number()
});

export const studyDataSchema = z.object({
  subjects: z.array(subjectSchema),
  topics: z.array(topicSchema)
});

export type Status = z.infer<typeof statusSchema>;
export type Subject = z.infer<typeof subjectSchema>;
export type Topic = z.infer<typeof topicSchema>;
export type StudyData = z.infer<typeof studyDataSchema>;
