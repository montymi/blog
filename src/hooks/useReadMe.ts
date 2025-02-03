import { useState, useEffect } from 'react';
import matter from 'gray-matter';
import { Buffer } from 'buffer';

if (typeof window !== 'undefined' && !window.Buffer) {
  window.Buffer = Buffer;
}

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
        const { data, content } = matter(text);
        setReadMe({ data, content });
      } catch (error) {
        console.error(error);
      }
    }
    fetchReadMe();
  }, [link]);

  return readMe;
};

export default useReadMe;
