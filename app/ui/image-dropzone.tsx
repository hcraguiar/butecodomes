'use client';

import { upload } from '@vercel/blob/client';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-hot-toast';

interface ImageDropzoneProps {
  onUpload: (url: string) => void;
  label?: string;
}

export default function ImageDropzone({ onUpload, label = 'Upload da Imagem' }: ImageDropzoneProps) {
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploading(true);
    try {
      toast.loading('Carregando imagem.')
      const result = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/image/upload'
      });

      onUpload(result.url);
      toast.dismiss();
      toast.success('Imagem enviada com sucesso!');
    } catch (err) {
      toast.dismiss();
      toast.error('Erro ao enviar a imagem.');
      console.error(err);
    } finally {
      setUploading(false);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': [] }, multiple: false });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-md p-6 cursor-pointer text-center transition-all
        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-muted'}
        ${uploading ? 'opacity-50 pointer-events-none' : ''}
      `}
    >
      <input {...getInputProps()} />
      <p className="text-sm text-muted-foreground">
        {isDragActive ? 'Solte a imagem aqui...' : label}
      </p>
    </div>
  );
}
