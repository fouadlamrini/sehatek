export const getErrorMessage = (error, fallback = "Une erreur est survenue.") =>
  error?.response?.data?.message || error?.message || fallback;
