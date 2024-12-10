"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CryptoPair } from '@/types';
import * as z from 'zod';

interface PairFormProps {
  initialData?: CryptoPair;
  onSubmit: (data: Omit<CryptoPair, 'id'>) => void;
  onCancel?: () => void;
}

const PairSchema = z.object({
  baseCurrency: z.string().min(1, 'Необходимо указать базовую валюту'),
  quoteCurrency: z.string().min(1, 'Необходимо указать валюту котировки'),
  isActive: z.boolean(),
  updateInterval: z.number().min(1, 'Интервал должен быть минимум 1 минута'),
});

type PairFormData = z.infer<typeof PairSchema>;

const PairForm: React.FC<PairFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<PairFormData>({
    resolver: zodResolver(PairSchema),
    defaultValues: initialData || {
      baseCurrency: '',
      quoteCurrency: '',
      isActive: true,
      updateInterval: 5,
    },
  });

  const submitHandler = (data: PairFormData) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="mb-4 p-4 border rounded">
      <div className="flex space-x-4 mb-2">
        <div>
          <label className="block">База</label>
          <input
            {...register('baseCurrency')}
            placeholder='Например, bitcoin'
            className="border p-2 rounded"
            type="text"
          />
          {errors.baseCurrency && <span className="text-red-500 text-sm">{errors.baseCurrency.message}</span>}
        </div>
        <div>
          <label className="block">Котировка</label>
          <input
            {...register('quoteCurrency')}
            placeholder='Например, usd'
            className="border p-2 rounded"
            type="text"
          />
          {errors.quoteCurrency && <span className="text-red-500 text-sm">{errors.quoteCurrency.message}</span>}
        </div>
      </div>

      <div className="flex space-x-4 mb-2">
        <div>
          <label className="flex items-center">
            <input
              {...register('isActive')}
              type="checkbox"
              className="mr-2"
            />
            Активна
          </label>
        </div>
        <div>
          <label className="block">Интервал обновления (мин)</label>
          <input
            {...register('updateInterval', { valueAsNumber: true })}
            className="border p-2 rounded"
            type="number"
            min={1}
          />
          {errors.updateInterval && <span className="text-red-500 text-sm">{errors.updateInterval.message}</span>}
        </div>
      </div>

      <div className="flex space-x-2">
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          {initialData ? 'Сохранить' : 'Добавить'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="bg-gray-500 text-white px-4 py-2 rounded">
            Отмена
          </button>
        )}
      </div>
    </form>
  );
};

export default PairForm;
