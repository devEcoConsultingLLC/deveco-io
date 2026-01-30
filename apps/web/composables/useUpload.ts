import { ref } from 'vue';

export function useUpload() {
  const uploading = ref(false);
  const progress = ref(0);
  const error = ref<string | null>(null);

  async function upload(
    file: File,
    options: {
      purpose: 'cover' | 'content' | 'schematic' | 'attachment';
      projectId?: string;
    },
  ) {
    uploading.value = true;
    progress.value = 0;
    error.value = null;

    try {
      const trpc = useTrpc();

      // Get presigned URL
      const { uploadUrl, publicUrl } = await trpc.upload.createPresignedUrl.mutate({
        filename: file.name,
        mimeType: file.type,
        sizeBytes: file.size,
        purpose: options.purpose,
        projectId: options.projectId,
      });

      // Upload directly to S3/MinIO
      const res = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });

      if (!res.ok) throw new Error('Upload failed');

      progress.value = 100;
      return { publicUrl };
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Upload failed';
      throw err;
    } finally {
      uploading.value = false;
    }
  }

  return { upload, uploading, progress, error };
}
