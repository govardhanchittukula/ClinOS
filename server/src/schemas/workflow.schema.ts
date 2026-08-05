import { z } from 'zod';

export const workflowInputSchema = z.object({
  clinicalCase: z.string().min(10, "Case description must be at least 10 characters long").max(3000),
  complexity: z.enum(["Routine", "Complex", "Deep Dive"]),
  enableCritic: z.boolean().default(true),
  outputFormat: z.enum(["Markdown", "JSON"]),
  temperature: z.number().min(0).max(0.5).default(0.1),
  userId: z.string().optional().default("demo-physician-01")
});

export type WorkflowInput = z.infer<typeof workflowInputSchema>;
