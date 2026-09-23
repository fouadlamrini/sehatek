// The access token is kept in memory only (never localStorage/sessionStorage)
// so any XSS on the page cannot read it. On a full page reload the token is
// gone and AuthContext silently refreshes a new one from the httpOnly cookie.
let accessToken = null;

export const getAccessToken = () => accessToken;

export const setTokens = ({ token }) => {
  accessToken = token || null;
};

export const clearTokens = () => {
  accessToken = null;
};