import { useState, useEffect } from 'react';
import axios from 'axios';

function useFetch(url) {
  // const [fen, setFen] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    setLoading(true);
    axios.get(url).then((response) => {
      setData(response.data)
    }).catch((err) => {
      setError(err)
    }).finally(() => {
      setLoading(false);
    })

  }, [url])
  return { data, loading, error };
}

export default useFetch;
