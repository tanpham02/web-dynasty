const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getFullImageUrl = (subPath?: string) => `${BASE_URL}${subPath}`;
