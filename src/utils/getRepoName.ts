export const getRepoNameFromUrl = (url: string): string => {
  const parts = url.split('/');
  return parts[parts.length - 3];
};
