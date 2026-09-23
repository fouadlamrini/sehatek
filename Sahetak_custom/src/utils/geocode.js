export const reverseGeocode = async (latitude, longitude) => {
  const url =
    "https://nominatim.openstreetmap.org/reverse" +
    `?format=jsonv2&accept-language=fr&zoom=18&lat=${latitude}&lon=${longitude}`;

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error("L'adresse n'a pas pu être retrouvée.");
  }

  const data = await response.json();
  const address = data.address ?? {};

  const city =
    address.city ||
    address.town ||
    address.village ||
    address.municipality ||
    address.state_district ||
    "";

  const quartier =
    address.suburb ||
    address.neighbourhood ||
    address.residential ||
    address.road ||
    "";

  return {
    city: city.trim(),
    quartier: quartier.trim(),
  };
};