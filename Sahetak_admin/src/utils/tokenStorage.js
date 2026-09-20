const ACCESS_TOKEN_KEY = "sehatek_access_token";
const REFRESH_TOKEN_KEY = "sehatek_refresh_token";

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);

export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);

export const setTokens = ({ token, refreshToken }) => {
  if (token) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  }

  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
};

export const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};
