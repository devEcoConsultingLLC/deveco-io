import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { files } from '@deveco/db';

export const uploadRouter = router({
  createPresignedUrl: protectedProcedure
    .input(
      z.object({
        filename: z.string().min(1).max(255),
        mimeType: z.string().min(1),
        sizeBytes: z.number().min(1).max(50_000_000), // 50MB max
        purpose: z.enum(['cover', 'content', 'schematic', 'attachment']),
        projectId: z.string().uuid().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const storageKey = `uploads/${ctx.user.id}/${Date.now()}-${input.filename}`;

      // Record file metadata in DB
      const [file] = await ctx.db
        .insert(files)
        .values({
          uploaderId: ctx.user.id,
          projectId: input.projectId,
          filename: input.filename,
          mimeType: input.mimeType,
          sizeBytes: input.sizeBytes,
          storageKey,
          purpose: input.purpose,
        })
        .returning();

      // In production, generate an actual presigned URL from S3/MinIO
      // For now, return the storage key for the client to use
      const publicUrl = `${process.env.S3_PUBLIC_URL || 'http://localhost:9000/deveco'}/${storageKey}`;

      return {
        fileId: file!.id,
        uploadUrl: `${process.env.S3_ENDPOINT || 'http://localhost:9000'}/${process.env.S3_BUCKET || 'deveco'}/${storageKey}`,
        publicUrl,
        storageKey,
      };
    }),
});
