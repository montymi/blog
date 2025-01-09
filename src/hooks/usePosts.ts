import { useState, useEffect } from 'react';

const usePosts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch('/posts.json');
        if (!response.ok) {
          throw new Error(`Error fetching posts: ${response.statusText}`);
        }
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error(error);
        // Optionally, display a notification to the user
      }
    }
    fetchPosts();
  }, [setPosts]);

  return posts;
};

export default usePosts;
