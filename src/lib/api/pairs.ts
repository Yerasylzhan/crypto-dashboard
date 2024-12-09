import api from './axios';
import { CryptoPair } from '../../types';

export const fetchPairs = async (): Promise<CryptoPair[]> => {
  const response = await api.get('/pairs');
  return response.data;
};

export const createPair = async (pair: Omit<CryptoPair, 'id'>): Promise<CryptoPair> => {
  const response = await api.post('/pairs', pair);
  return response.data;
};

export const updatePair = async (id: number, pair: Partial<Omit<CryptoPair, 'id'>>): Promise<CryptoPair> => {
  const response = await api.put(`/pairs/${id}`, pair);
  return response.data;
};

export const deletePair = async (id: number): Promise<void> => {
  await api.delete(`/pairs/${id}`);
};
