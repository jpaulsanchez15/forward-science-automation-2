import { useEffect, useState } from "react";

const debounceValue = (value: string, time = 250) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, time);

    return () => {
      clearTimeout(handler);
    };
  }, [value, time]);

  return debouncedValue;
};

export { debounceValue };
