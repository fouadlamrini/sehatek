const ACCESS_TOKEN_KEY = "sehatek_access_token";
const LEGACY_REFRESH_TOKEN_KEY = "sehatek_refresh_token";

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);

export const setTokens = ({ token }) => {
  if (token) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  }
};

export const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(LEGACY_REFRESH_TOKEN_KEY);
};