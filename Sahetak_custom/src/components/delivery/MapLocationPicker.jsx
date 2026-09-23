import { useEffect, useState } from "react";
import { Loader2, MapPin, Navigation } from "lucide-react";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";

import "leaflet/dist/leaflet.css";

import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

import Button from "../ui/Button";
import { getCurrentPosition } from "../../utils/geolocation";
import { reverseGeocode } from "../../utils/geocode";

const DEFAULT_CENTER = [33.5731, -7.5898];
const DEFAULT_ZOOM = 13;

const markerIcon = new L.Icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const MapClickHandler = ({ onPick }) => {
  useMapEvents({
    click: (event) => {
      const { lat, lng } = event.latlng;
      onPick(lat, lng);
    },
  });

  return null;
};

const FlyTo = ({ position }) => {
  const map = useMap();

  useEffect(() => {
    map.flyTo(position, Math.max(map.getZoom(), 15), { duration: 0.8 });
  }, [map, position]);

  return null;
};

const MapLocationPicker = ({ latitude, longitude, onSelect, disabled = false }) => {
  const hasCoords = latitude != null && longitude != null;
  const position = hasCoords ? [latitude, longitude] : null;

  const [detecting, setDetecting] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const [error, setError] = useState("");

  const pickAndGeocode = async (lat, lng) => {
    setError("");
    setGeocoding(true);

    const roundedLat = Number(lat.toFixed(6));
    const roundedLng = Number(lng.toFixed(6));

    try {
      const address = await reverseGeocode(roundedLat, roundedLng);

      onSelect({
        ...address,
        latitude: roundedLat,
        longitude: roundedLng,
      });
    } catch {
      setError(
        "Position enregistrée, mais l'adresse n'a pas pu être retrouvée. Renseignez la ville et le quartier manuellement."
      );

      onSelect({
        city: "",
        quartier: "",
        latitude: roundedLat,
        longitude: roundedLng,
      });
    } finally {
      setGeocoding(false);
    }
  };

  const handleDetect = async () => {
    if (disabled) {
      return;
    }

    setDetecting(true);
    setError("");

    try {
      const position = await getCurrentPosition();
      const { latitude, longitude } = position.coords;

      await pickAndGeocode(latitude, longitude);
    } catch {
      setError(
        "Position introuvable. Autorisez l'accès à la localisation ou placez le marqueur manuellement."
      );
    } finally {
      setDetecting(false);
    }
  };

  const handleDragEnd = (event) => {
    const { lat, lng } = event.target.getLatLng();
    pickAndGeocode(lat, lng);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs text-gray-500">
          Cliquez sur la carte ou déplacez le marqueur pour choisir le point de
          livraison.
        </p>

        <Button
          type="button"
          size="sm"
          variant="leaf"
          icon={Navigation}
          loading={detecting}
          onClick={handleDetect}
          className="shrink-0"
        >
          Detecter ma position
        </Button>
      </div>

      <div className="relative h-72 overflow-hidden rounded-xl border border-gray-200">
        <MapContainer
          center={position ?? DEFAULT_CENTER}
          zoom={DEFAULT_ZOOM}
          scrollWheelZoom
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapClickHandler onPick={pickAndGeocode} />

          {hasCoords ? (
            <>
              <FlyTo position={position} />

              <Marker
                position={position}
                draggable
                icon={markerIcon}
                eventHandlers={{
                  dragend: handleDragEnd,
                }}
              />
            </>
          ) : null}
        </MapContainer>
      </div>

      {geocoding ? (
        <p className="flex items-center gap-1.5 text-xs text-gray-500">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Récupération de l'adresse…
        </p>
      ) : null}

      {error ? (
        <p className="text-xs font-medium text-red-600">{error}</p>
      ) : null}

      {hasCoords ? (
        <p className="flex items-center gap-1.5 text-xs text-gray-500">
          <MapPin className="h-3.5 w-3.5 text-primary" />
          {Number(latitude).toFixed(5)}, {Number(longitude).toFixed(5)}
        </p>
      ) : null}
    </div>
  );
};

export default MapLocationPicker;