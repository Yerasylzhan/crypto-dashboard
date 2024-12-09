"use client";

import { useState } from 'react';
import { useQuery } from 'react-query';
import { fetchPairs } from '../../lib/api/pairs';
import { CryptoPair, CryptoRate } from '../../types';
import api from '../../lib/api/axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-toastify';

const fetchRates = async (
  pairId: number,
  startDate: string,
  endDate: string,
  limit: number
): Promise<CryptoRate[]> => {
  const response = await api.get('/rates', {
    params: {
      pairId,
      startDate,
      endDate,
      limit,
      sort: 'asc',
    },
  });
  return response.data;
};

const AnalyticsPage = () => {
  // Получение списка пар
  const { data: pairs, isLoading: pairsLoading, error: pairsError } = useQuery<CryptoPair[]>('pairs', fetchPairs);
  
  // Состояния для выбранной пары, дат и лимита
  const [selectedPair, setSelectedPair] = useState<number | null>(null);
  const [startDate, setStartDate] = useState<Date | undefined>(new Date(new Date().setDate(new Date().getDate() - 7)));
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [limit, setLimit] = useState<number>(100);

  // Получение курсов на основе выбранных параметров
  const { data: rates, isLoading: ratesLoading, error: ratesError } = useQuery<CryptoRate[]>(
    ['rates', selectedPair, startDate, endDate, limit],
    () => {
      if (selectedPair && startDate && endDate) {
        return fetchRates(
          selectedPair,
          startDate.toISOString(),
          endDate.toISOString(),
          limit
        );
      }
      return Promise.resolve([]);
    },
    {
      enabled: selectedPair !== null && startDate !== undefined && endDate !== undefined,
      onError: () => {
        toast.error('Ошибка при загрузке курсов');
      },
    }
  );

  // Обработчик изменения выбранной пары
  const handlePairChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedPair(value ? Number(value) : null);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Аналитика Курсов</h1>

      <div className="flex flex-wrap space-x-4 mb-4">
        {/* Выбор пары */}
        <div className="mb-2">
          <label className="block mb-1">Выберите пару</label>
          <select onChange={handlePairChange} className="border p-2 rounded">
            <option value="">Выберите пару</option>
            {pairs?.map(pair => (
              <option key={pair.id} value={pair.id}>
                {pair.baseCurrency}/{pair.quoteCurrency}
              </option>
            ))}
          </select>
        </div>

        {/* Начальная дата */}
        <div className="mb-2">
          <label className="block mb-1">Начальная дата</label>
          <DatePicker
            selected={startDate}
            onChange={(date: Date | null) => setStartDate(date ?? undefined)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            className="border p-2 rounded"
            placeholderText="Начальная дата"
          />
        </div>

        {/* Конечная дата */}
        <div className="mb-2">
          <label className="block mb-1">Конечная дата</label>
          <DatePicker
            selected={endDate}
            onChange={(date: Date | null) => setEndDate(date ?? undefined)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            className="border p-2 rounded"
            placeholderText="Конечная дата"
          />
        </div>

        {/* Лимит */}
        <div className="mb-2">
          <label className="block mb-1">Лимит</label>
          <input
            type="number"
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="border p-2 rounded w-20"
            placeholder="Лимит"
            min={1}
          />
        </div>
      </div>

      {/* Отображение данных */}
      {ratesLoading ? (
        <div>Загрузка курсов...</div>
      ) : ratesError ? (
        <div>Ошибка при загрузке курсов.</div>
      ) : rates && rates.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={rates}>
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="timestamp" />
            <YAxis domain={['auto', 'auto']} />
            <Tooltip />
            <Line type="monotone" dataKey="rate" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div>Нет данных для отображения.</div>
      )}
    </div>
  );
};

export default AnalyticsPage;
