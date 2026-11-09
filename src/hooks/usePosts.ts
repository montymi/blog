import { useState, useEffect } from 'react';

import { parseMarkdown } from '@/lib/markdown';

interface Post {
  id: string;
  title: string;
  date: string;
  content: string;
}

const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch('/posts/posts.json');
        if (!response.ok) {
          throw new Error(`Error fetching posts: ${response.statusText}`);
        }
        const files = await response.json();
        console.log('Fetched files:', files.posts);
        const posts = files.posts;

        const postsData: Post[] = await Promise.all(
          posts.map(async (file: string) => {
            const res = await fetch(`/posts/${file}`);
            if (!res.ok) {
              throw new Error(`Error fetching post file: ${res.statusText}`);
            }
            const text = await res.text();
            const { data, content } = parseMarkdown(text);
            return {
              id: data.id as string,
              title: data.title as string,
              date: data.date as string,
              content,
            };
          }),
        );
        setPosts(postsData);
      } catch (error) {
        console.error(error);
      }
    }
    fetchPosts();
  }, []);

  return posts;
};

export default usePosts;
