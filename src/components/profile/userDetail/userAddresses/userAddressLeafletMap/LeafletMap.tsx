"use client";

import React, { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import iconUrl from "/node_modules/leaflet/dist/images/marker-icon.png";
import shadowUrl from "/node_modules/leaflet/dist/images/marker-shadow.png";

const defaultIcon = new L.Icon({
  iconUrl: (iconUrl as unknown as { src: string }).src || (iconUrl as unknown as string),
  iconRetinaUrl:
    (iconUrl as unknown as { src: string }).src || (iconUrl as unknown as string),
  iconSize: [25, 41],
  iconAnchor: [12.5, 41],
  popupAnchor: [0, -41],
  shadowUrl:
    (shadowUrl as unknown as { src: string }).src || (shadowUrl as unknown as string),
  shadowSize: [41, 41],
});

type Coordinate = [number, number];

export interface SearchAddress {
  title: string;
  x: number;
  y: number;
}

interface Props {
  coord: Coordinate;
  setCoord: (data: Coordinate) => void;
  setAddress: (data: string) => void;
  onSearchResults?: (items: SearchAddress[]) => void;
  onPickSuggestion?: (item: SearchAddress) => void;
  onProvinceDetected?: (provinceLabel: string) => void;
}

const LeafletMap: React.FC<Props> = ({
  coord,
  setCoord,
  setAddress,
  onProvinceDetected,
}) => {
  const provinceLabels = [
    "تهران",
    "البرز",
    "آذربایجان شرقی",
    "آذربایجان غربی",
    "اصفهان",
    "ایلام",
    "بوشهر",
    "چهارمحال و بختیاری",
    "خراسان رضوی",
    "خراسان جنوبی",
    "خراسان شمالی",
    "خوزستان",
    "زنجان",
    "سمنان",
    "سیستان و بلوچستان",
    "فارس",
    "قزوین",
    "قم",
    "کرمان",
    "کرمانشاه",
    "کردستان",
    "کهگیلویه و بویراحمد",
    "گلستان",
    "گیلان",
    "لرستان",
    "مازندران",
  ];
  const getAddress = async (c: Coordinate) => {
    try {
      const response = await fetch(
        `https://api.neshan.org/v2/reverse?lat=${c[0]}&lng=${c[1]}`,
        {
          method: "GET",
          headers: {
            "Api-Key": "service.406fb49d15be4a65bf05a950e7ef5baa",
          },
        }
      );
      const result = await response.json();
      if (result?.formatted_address) {
        setAddress(`${result.formatted_address}`);
      }

      // Try to detect province and notify parent
      const rawProvince: string | undefined =
        result?.province || result?.state || result?.State || result?.Province;
      let detectedLabel: string | undefined = rawProvince;
      if (!detectedLabel && typeof result?.formatted_address === "string") {
        detectedLabel = provinceLabels.find((lbl) =>
          result.formatted_address.includes(lbl)
        );
      }
      if (detectedLabel && typeof onProvinceDetected === "function") {
        // Normalize possible prefixes like "استان X"
        const normalized = detectedLabel.replace(/^استان\s+/, "").trim();
        onProvinceDetected(normalized);
      }
    } catch {
      // ignore
    }
  };

  const LocationMarker: React.FC<{ setCoord: (c: Coordinate) => void }> = ({
    setCoord,
  }) => {
    useMapEvents({
      click(e) {
        const next: Coordinate = [e.latlng.lat, e.latlng.lng];
        setCoord(next);
        getAddress(next);
      },
    });
    return null;
  };

  const DynamicZoom = ({ c }: { c: Coordinate }) => {
    const map = useMap();
    useEffect(() => {
      const currentZoom = map.getZoom();
      map.setView(c, currentZoom);
      // Ensure Leaflet recalculates layout (especially when rendered in a modal)
      setTimeout(() => map.invalidateSize(), 0);
    }, [c, map]);
    return null;
  };

  // Invalidate map size after mount and on window resize to fix gray/right offset when inside modals
  const MapInvalidator = () => {
    const map = useMap();
    useEffect(() => {
      const invalidate = () => map.invalidateSize();
      // Initial invalidation after first paint
      setTimeout(invalidate, 0);
      // Invalidate on resize
      window.addEventListener("resize", invalidate);
      return () => window.removeEventListener("resize", invalidate);
    }, [map]);
    return null;
  };

  return (
    <MapContainer
      style={{ height: "300px", width: "100%", zIndex: 1 }}
      center={coord}
      zoom={10}
      scrollWheelZoom
      zoomControl={false}
      attributionControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker icon={defaultIcon} position={coord}>
        <Popup>موقعیت انتخابی</Popup>
      </Marker>
      <LocationMarker setCoord={setCoord} />
      <DynamicZoom c={coord} />
      <MapInvalidator />
    </MapContainer>
  );
};

export default LeafletMap;


