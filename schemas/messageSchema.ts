import { z } from "zod";

export const voiceMessageSchema = z.object({
  audioUrl: z.string().url({ message: "Invalid audio URL" }),
  duration: z.number().positive({ message: "Invalid duration" }),
  content: z.string().max(150, { message: "Transcript must be no more than 150 characters" }).optional(),
});
