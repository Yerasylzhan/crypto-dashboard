"use client";

import { CryptoPair } from '@/types';
import { useState } from 'react';
import PairForm from './PairForm';

interface PairListProps {
  pairs: CryptoPair[];
  onUpdate: (id: number, data: Partial<CryptoPair>) => void;
  onDelete: (id: number) => void;
}

const PairList: React.FC<PairListProps> = ({ pairs, onUpdate, onDelete }) => {
  const [editingPairId, setEditingPairId] = useState<number | null>(null);

  return (
    <table className="min-w-full bg-white dark:bg-gray-800">
      <thead>
        <tr>
          <th className="py-2">ID</th>
          <th className="py-2">База</th>
          <th className="py-2">Котировка</th>
          <th className="py-2">Активна</th>
          <th className="py-2">Интервал обновления (мин)</th>
          <th className="py-2">Действия</th>
        </tr>
      </thead>
      <tbody>
        {pairs.map(pair => (
          <tr key={pair.id} className="text-center">
            <td className="py-2">{pair.id}</td>
            <td className="py-2">{pair.baseCurrency}</td>
            <td className="py-2">{pair.quoteCurrency}</td>
            <td className="py-2">{pair.isActive ? 'Да' : 'Нет'}</td>
            <td className="py-2">{pair.updateInterval}</td>
            <td className="py-2 space-x-2">
              <button
                onClick={() => setEditingPairId(pair.id)}
                className="text-blue-500"
              >
                Редактировать
              </button>
              <button
                onClick={() => onDelete(pair.id)}
                className="text-red-500"
              >
                Удалить
              </button>
            </td>
            {editingPairId === pair.id && (
              <tr>
                <td colSpan={6}>
                  <PairForm
                    initialData={pair}
                    onSubmit={(data) => {
                      onUpdate(pair.id, data);
                      setEditingPairId(null);
                    }}
                    onCancel={() => setEditingPairId(null)}
                  />
                </td>
              </tr>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PairList;
