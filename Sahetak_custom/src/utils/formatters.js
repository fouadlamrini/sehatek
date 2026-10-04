export const formatCurrency = (value) => {
  const number = Number(value);

  if (Number.isNaN(number)) {
    return "0 DH";
  }

  return `${number.toFixed(2).replace(/\.00$/, "")} DH`;
};

// The API stores meal days as French labels, so they have to be translated for
// the Arabic UI. Unknown values are passed through untouched.
const DAY_LABELS = {
  lundi: "الإثنين",
  mardi: "الثلاثاء",
  mercredi: "الأربعاء",
  jeudi: "الخميس",
  vendredi: "الجمعة",
  samedi: "السبت",
  dimanche: "الأحد",
};

export const formatDay = (day) => {
  const value = String(day ?? "").trim();

  return DAY_LABELS[value.toLowerCase()] ?? value;
};

export const formatDays = (days) => {
  if (!Array.isArray(days) || days.length === 0) {
    return "";
  }

  return days.map(formatDay).join(" · ");
};