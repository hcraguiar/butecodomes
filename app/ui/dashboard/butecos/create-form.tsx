'use client';

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Input from "../../input";
import { 
  DocumentTextIcon, 
  GlobeAltIcon, 
  MapPinIcon, 
} from "@heroicons/react/24/outline";
import Image from "next/image";
import Button from "../../button";
import ImageDropzone from "../../image-dropzone";
import { ButecoCard } from "./buteco-card";
import { z } from "zod";
import { useForm } from  "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useDebounce } from 'use-debounce';
import dynamic from "next/dynamic";

const MapSelector = dynamic(() => import('@/app/ui/maps/map-selector'), { ssr: false })

const DEFAULT_IMAGE = '/bar-image.png'
const DEFAULT_LOGO = '/logo.png'

const butecoSchema = z.object({
  name: z.string().min(3, 'o nome deve ter pelo menos 3 caracteres'),
  address: z.string().min(5, 'Endereço inválido'),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  image_url: z.string().url('Imagem inválida'),
  logo_url: z.string().url('Logo inválida'),
});

type ButecoFormValues = z.infer<typeof butecoSchema>;

export default function ButecoForm() {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting},
    watch,
  } = useForm<ButecoFormValues>({
    resolver: zodResolver(butecoSchema),
    defaultValues: {
      name: '',
      address: '',
      latitude: -19.93208,
      longitude: -43.93808,
      image_url: '',
      logo_url: '',
      
    }
  });
  const router = useRouter();

  const fetchCoordinates = async (address: string) => {
    if (!address) return

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
      )
      const data = await res.json()

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        setValue('latitude', lat);
        setValue('longitude', lon);
      }
    } catch (e) {
      console.error('Erro ao buscar coordenadas', e);
      toast.error('Não foi possível localizar o endereço.');
    }
  }

  const [debouncedAdress] = useDebounce(watch('address'), 800);

  useEffect(() => {
    fetchCoordinates(debouncedAdress);
  }, [debouncedAdress])
  
  const image_url = watch('image_url');
  const logo_url = watch('logo_url') ;

  const [imagePreview, setImagePreview] = useState(DEFAULT_IMAGE);
  const [logoPreview, setLogoPreview] = useState(DEFAULT_LOGO);

  const butecoPreviewData = {
    id: "",
    name: watch('name'),
    address: "", 
    image_url: imagePreview,
    logo_url: logoPreview,
    food: 5,
    drink: 5,
    ambiance: 5,
    service: 5,
    price: 5,
    rating: 5,
  }


  const onSubmit = async (data: ButecoFormValues) => {
    try {
      const res = await fetch('/api/butecos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data), 
      });

      if (!res.ok) throw new Error('Erro ao cadastrar buteco');
      toast.success('Buteco cadastrado com sucesso!');

      reset();
      setImagePreview(DEFAULT_IMAGE);
      setLogoPreview(DEFAULT_LOGO);
      router.push('/dashboard/butecos');
    } catch (err) {
      console.error(err);
      toast.error('Erro ao cadastrar');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Formulário */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input 
          placeholder="Nome do bar"
          {...register('name')}
          icon={<DocumentTextIcon />}
          error={errors.name?.message}
        />
        <Input 
          placeholder="Endereço"
          {...register('address')}
          icon={<MapPinIcon />}
          error={errors.address?.message}
        />
        <div className="grid grid-cols-2 gap-4">
          <Input 
            placeholder="Latitude"
            type="number"
            step="any"
            {...register('latitude')}
            icon={<GlobeAltIcon />}
            error={errors.latitude?.message}
          />
          <Input 
            placeholder="Longitude"
            type="number"
            step="any"
            {...register('longitude')}
            icon={<GlobeAltIcon />}
            error={errors.longitude?.message}
          />
        </div>

        {/* Map selector */}
        <MapSelector 
          latitude={watch('latitude').toString()}
          longitude={watch('longitude').toString()}
          setLocation={({ lat, lng }) => {
            setValue('latitude', lat);
            setValue('longitude', lng);
          }
          }
        />
        

        {/* Image dropzone */}
        {!image_url && (
          <>
          <ImageDropzone 
            onUpload={(url) => {
              setValue('image_url', url);
              setImagePreview(url);
            }} 
            label="Clique ou arraste a imagem do bar" 
          />
          <span className="flex justify-end text-xs text-muted-foreground dark:text-dark-muted-foreground mb-2">Opcional</span>
          </>
        )}
        {image_url && (
          <>
          <div className="flex justify-center">
            <div className="relative aspect-[3/4] w-full max-w-[300px] rounded-lg overflow-hidden shadow-md">
              <Image
                src={imagePreview}
                alt="Prévia"
                fill
                className="object-cover"
              />
            </div>
          </div>
          <span 
            className="flex justify-end text-xs text-red-500 mb-2 cursor-pointer" 
            onClick={() => {
              setValue('image_url', '');
              setImagePreview(DEFAULT_IMAGE);
            }}
          >
            Remover
          </span>
          </>
        )}
        {!logo_url && (
          <>
          <ImageDropzone 
            onUpload={(url) => {
              setValue('logo_url', url);
              setLogoPreview(url);
            }} 
            label="Clique ou arraste a logo do bar" 
            />
          <span className="flex justify-end text-xs text-muted-foreground dark:text-dark-muted-foreground mb-2">Opcional</span>
          </>
        )}
        {logo_url && (
          <>
          <div className="flex justify-center">
            <div className="relative aspect-[4/3] w-full max-w-[300px]">
              <Image
                src={logoPreview}
                alt="Prévia logo"
                fill
                className="object-contain"
              />
            </div>
          </div>
          <span 
            className="flex justify-end text-xs text-red-500 mb-2 cursor-pointer" 
            onClick={() => {
              setValue('logo_url', '');
              setLogoPreview(DEFAULT_LOGO);
            }}
          >
            Remover
          </span>
          </>
        )}

        <Button 
          type="submit"
          disabled={isSubmitting}
          className="disabled:opacity-50"
          >
          {isSubmitting ? 'Enviando...' : 'Cadastrar'}
        </Button>
      </form>

      {/* Card Preview (Aparece apenas em md+) */}
      <div className="hidden md:flex justify-center items-center">
        <ButecoCard {...butecoPreviewData} />    
      </div>
    </div>
  )
}
