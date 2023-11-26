export const asyncLocalStorage = {
  setLocalStorage(key: string, value: any) {
    return localStorage.setItem(key, value);
  },
  getLocalStorage(key: any) {
    return localStorage.getItem(key);
  },
};
