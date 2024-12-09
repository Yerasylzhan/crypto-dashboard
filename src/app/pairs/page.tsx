// src/app/pairs/page.tsx

"use client";

import { useQuery, useMutation, useQueryClient } from 'react-query';
import { fetchPairs, createPair, updatePair, deletePair } from '../../lib/api/pairs';
import { CryptoPair } from '../../types';
import PairList from '../components/PairList';
import PairForm from '../components/PairForm';
import { useState } from 'react';
import { toast } from 'react-toastify';

const PairsPage = () => {
  const queryClient = useQueryClient();
  const { data: pairs, isLoading, error } = useQuery<CryptoPair[]>('pairs', fetchPairs);

  const createMutation = useMutation(createPair, {
    onSuccess: () => {
      queryClient.invalidateQueries('pairs');
      toast.success('Пара успешно добавлена');
    },
    onError: () => {
      toast.error('Ошибка при добавлении пары');
    },
  });

  const updateMutation = useMutation(({ id, data }: { id: number, data: Partial<CryptoPair> }) => updatePair(id, data), {
    onSuccess: () => {
      queryClient.invalidateQueries('pairs');
      toast.success('Пара успешно обновлена');
    },
    onError: () => {
      toast.error('Ошибка при обновлении пары');
    },
  });

  const deleteMutation = useMutation(deletePair, {
    onSuccess: () => {
      queryClient.invalidateQueries('pairs');
      toast.success('Пара успешно удалена');
    },
    onError: () => {
      toast.error('Ошибка при удалении пары');
    },
  });

  const handleAddPair = (pair: Omit<CryptoPair, 'id'>) => {
    createMutation.mutate(pair);
  };

  const handleUpdatePair = (id: number, data: Partial<CryptoPair>) => {
    updateMutation.mutate({ id, data });
  };

  const handleDeletePair = (id: number) => {
    if (confirm('Вы уверены, что хотите удалить эту пару?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <div className="container mx-auto p-4">Загрузка...</div>;
  if (error) return <div className="container mx-auto p-4">Ошибка при загрузке данных.</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Управление Парами</h1>
      <PairForm onSubmit={handleAddPair} />
      <PairList pairs={pairs!} onUpdate={handleUpdatePair} onDelete={handleDeletePair} />
    </div>
  );
};

export default PairsPage;
