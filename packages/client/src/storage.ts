const STORAGE_KEY = "jc_data";

interface LoggedInUser {
  avatar_url: string;
  name: string;
}

export const setStorage = (avatar_url: string, name: string): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ avatar_url, name }));
};

export const getStorage = (): LoggedInUser | null => {
  const data = localStorage.getItem(STORAGE_KEY);

  if (!data) return null;

  return JSON.parse(data) as LoggedInUser;
};

export const removeStorage = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
