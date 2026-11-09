import { useState, useEffect } from 'react';

import { parseMarkdown } from '@/lib/markdown';

interface ReadMe {
  content: string;
  data: {
    [key: string]: string | number | boolean;
  };
}

const useReadMe = (link: string) => {
  const [readMe, setReadMe] = useState<ReadMe | null>(null);

  useEffect(() => {
    async function fetchReadMe() {
      try {
        const response = await fetch(link);
        if (!response.ok) {
          throw new Error(`Error fetching README: ${response.statusText}`);
        }
        const text = await response.text();
        setReadMe(parseMarkdown(text));
      } catch (error) {
        console.error(error);
      }
    }
    fetchReadMe();
  }, [link]);

  return readMe;
};

export default useReadMe;
