export const getErrorMessage = (error, fallback = "حدث خطأ ما.") =>
  error?.response?.data?.message || error?.message || fallback;