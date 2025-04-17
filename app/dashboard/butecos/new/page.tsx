'use client';

import { useState } from 'react';
import Image from 'next/image';
import Button from '@/app/ui/button';

export default function NewButecoPage() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [logo, setLogo] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogo(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('address', address);
      formData.append('latitude', latitude);
      formData.append('longitude', longitude);
      if (image) formData.append('image', image);
      if (logo) formData.append('logo', logo);

      const res = await fetch('/api/butecos', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Erro ao cadastrar o buteco');

      // redirecionar ou mostrar sucesso
    } catch (err) {
      console.error(err);
      // exibir alerta de erro
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-semibold mb-6">Cadastrar novo Buteco</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium">Nome</label>
          <input
            type="text"
            className="mt-1 w-full rounded-md border px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Endereço</label>
          <input
            type="text"
            className="mt-1 w-full rounded-md border px-3 py-2"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Latitude</label>
            <input
              type="number"
              step="any"
              className="mt-1 w-full rounded-md border px-3 py-2"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Longitude</label>
            <input
              type="number"
              step="any"
              className="mt-1 w-full rounded-md border px-3 py-2"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Imagem do Buteco</label>
          <input type="file" accept="image/*" onChange={handleImageChange} className="mt-1" />
          {imagePreview && (
            <div className="mt-2">
              <Image
                src={imagePreview}
                alt="Preview"
                width={400}
                height={250}
                className="rounded-md object-cover"
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Logo</label>
          <input type="file" accept="image/*" onChange={handleLogoChange} className="mt-1" />
          {logoPreview && (
            <div className="mt-2">
              <Image
                src={logoPreview}
                alt="Logo Preview"
                width={100}
                height={100}
                className="rounded-full object-cover"
              />
            </div>
          )}
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? 'Cadastrando...' : 'Cadastrar'}
        </Button>
      </form>
    </div>
  );
}
