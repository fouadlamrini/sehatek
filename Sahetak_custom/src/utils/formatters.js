export const formatCurrency = (value) => {
  const number = Number(value);

  if (Number.isNaN(number)) {
    return "0 DH";
  }

  return `${number.toFixed(2).replace(/\.00$/, "")} DH`;
};

export const formatDays = (days) => {
  if (!Array.isArray(days) || days.length === 0) {
    return "";
  }

  return days.join(" · ");
};
