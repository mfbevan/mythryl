import { z } from "zod";

export const getProfileByFidSchema = z.object({
  fid: z.number().int().positive(),
});

export const getProfileByUsernameSchema = z.object({
  username: z.string().min(1).max(50),
});

export const getProfilesByFidsSchema = z.object({
  fids: z.array(z.number().int().positive()).max(100),
});
