import {useState, useEffect} from 'react';
import axios, { AxiosError } from 'axios';
import { API_URL } from '../Constants/Constants';

interface DolarData {
  dolarData: number|null;
  cargando: boolean;
  error: string|null;
}


export const useDolar = () => {
  const [dolarData, setDolarData] = useState<DolarData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fecthDolar = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(API_URL);
        setDolarData(response.data.promedio);
      } catch (err) {
        const axiosError = err as AxiosError;
        setError(axiosError.message);
      } finally {
        setLoading(false);
      }
    };
    fecthDolar();
  }, []);
  return { dolarData, loading, error };
};