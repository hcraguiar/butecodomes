"use client";

import { Review } from "@prisma/client";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

type Props = {
  review?: Review;
  userId: string;
  butecoId: string;
};

export default function ReviewModal({ review, userId, butecoId }: Props) {
  const [values, setValues] = useState({
    food: 0,
    drink: 0,
    service: 0,
    ambiance: 0,
    price: 0,
  });

  useEffect(() => {
    if (review) {
      setValues({
        food: review.food,
        drink: review.drink,
        service: review.service,
        ambiance: review.ambiance,
        price: review.price,
      });
    }
  }, [review]);

  const handleChange = (key: keyof typeof values, value: number) => {
    setValues(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    const method = review ? "PUT" : "POST";
    const url = review
      ? `/api/reviews/${review.id}`
      : `/api/reviews`;

    try {
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          userId,
          butecoId,
        }),
      });
      toast.success("Avaliação salva com sucesso");
    } catch {
      toast.error("Erro ao salvar avaliação");
    }
  };

  return (
    <form className="space-y-4" onSubmit={e => e.preventDefault()}>
      {Object.entries(values).map(([key, value]) => (
        <label key={key} className="flex flex-col gap-1">
          <span className="capitalize">{key}</span>
          <input
            type="number"
            min={0}
            max={10}
            value={value}
            onChange={e => handleChange(key as keyof typeof values, Number(e.target.value))}
            className="w-full border px-2 py-1 rounded-md bg-background"
          />
        </label>
      ))}
      <button
        type="button"
        onClick={handleSubmit}
        className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
      >
        Salvar avaliação
      </button>
    </form>
  );
}
