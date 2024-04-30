import { BASE_URL } from '~/config';

export const getFullImageUrl = (subPath?: string) =>
  subPath?.startsWith('https') || subPath?.startsWith('http')
    ? subPath
    : `${BASE_URL}/${subPath}`;
