import {useState, useEffect} from 'react';
import axios, { AxiosError } from 'axios';

interface DolarData {
  promedio: number;
  compra: number;
  venta: number;
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

        const response = await axios.get("https://ve.dolarapi.com/v1/dolares/oficial");
        setDolarData(response.data);
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