import { useState, useEffect } from 'react';

function useStateLS(
  key,
  initialValue = '',
) {
  const [state, setState] = useState(() => {
    const valueInLS = window.localStorage.getItem(key);
    if (valueInLS) {
      return JSON.parse(valueInLS);
    }
    return initialValue;
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
}

export default useStateLS;
