export const formatCurrency = (value) => {
  const number = Number(value);

  if (Number.isNaN(number)) {
    return "0 DH";
  }

  return `${number.toFixed(2).replace(/\.00$/, "")} DH`;
};

export const formatDate = (value) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export const formatDays = (days) => {
  if (!Array.isArray(days) || days.length === 0) {
    return "-";
  }

  return days.join(", ");
};

export const getInitials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

export const truncate = (value = "", max = 40) =>
  value.length > max ? `${value.slice(0, max)}…` : value;
