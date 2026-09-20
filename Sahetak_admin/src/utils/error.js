// Centralized helpers to read the backend error contract:
// { success: false, message: "...", errors: { field: "msg" } }

export const getErrorMessage = (error, fallback = "Something went wrong") => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (error?.message) {
    return error.message;
  }

  return fallback;
};

export const getFieldErrors = (error) => {
  const errors = error?.response?.data?.errors;

  if (!errors || typeof errors !== "object") {
    return {};
  }

  return errors;
};

export const getErrorStatus = (error) => error?.response?.status ?? null;
