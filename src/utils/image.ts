import { BASE_URL } from '~/config';

export const getFullImageUrl = (subPath?: string) => `${BASE_URL}${subPath}`;
