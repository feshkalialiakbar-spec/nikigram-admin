"use client";
import React, { useCallback, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import DrawerModal from "@/components/ui/modal/drawerModal/DrawerModal";
import styles from "./UserAddressModal.module.scss";
import TextField from "@/components/ui/forms/textField/TextField";
import Dropdown from "@/components/ui/forms/dropdown/Dropdown";
import {
  ProvinceToCities,
  provinceCoords as ProvinceCoordsMap,
  provinceOptions as ProvinceOptions,
} from "@/mocks/provinceName";
import Button from "@/components/ui/actions/button/Button";
import Text from "@/components/ui/text/Text";
import {
  getUserAddressByUid,
  updateUserAddressByUid,
} from "@/services/api/addresses";
import { locationApi } from "@/services/api/locations";
import { StateItemDto, CountyItemDto, CityItemDto } from "@/dtos/location.dto"; // Dynamically import Leaflet map only on client to avoid SSR issues
const LeafletMap = dynamic(
  () => import("../userAddressLeafletMap/LeafletMap"),
  {
    ssr: false,
  }
);
export type UserAddress = {
  title: string;
  province: string;
  city: string;
  neighborhood?: string;
  block?: string;
  unit?: string;
  address: string;
  coord: Coordinate;
};
type UserAddressModalProps = {
  isOpen: boolean;
  setIsOpenAction: (isOpen: boolean) => void;
  onSubmit?: (address: UserAddress) => void;
  addressUid?: string | null;
  onUpdated?: () => void;
};
type Coordinate = [number, number];
interface SearchAddress {
  title: string;
  x: number; // lng
  y: number; // lat
}
export default function UserAddressModal({
  isOpen,
  setIsOpenAction,
  addressUid,
  onUpdated,
}: UserAddressModalProps) {
  const IRAN_FALLBACK_COORD = React.useMemo(
    () => [32.4279, 53.688] as Coordinate,
    []
  );
  const [coord, setCoord] = useState<Coordinate>(IRAN_FALLBACK_COORD);
  const [displayAddress, setDisplayAddress] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [province, setProvince] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [neighborhood, setNeighborhood] = useState<string>("");
  const [block, setBlock] = useState<string>("");
  const [unit, setUnit] = useState<string>("");
  const [, setSuggestions] = useState<SearchAddress[]>([]);
  const [, setIsPrefillLoading] = useState<boolean>(false);
  const fullAddress = useMemo(() => {
    const extras: string[] = [];
    if (neighborhood && neighborhood.trim())
      extras.push(`محله ${neighborhood.trim()}`);
    if (block && block.trim()) extras.push(`پلاک ${block.trim()}`);
    if (unit && unit.trim()) extras.push(`واحد ${unit.trim()}`);
    return [displayAddress, ...extras].filter(Boolean).join("، ");
  }, [displayAddress, neighborhood, block, unit]);
  const provinceCoords = useMemo<Record<string, Coordinate>>(
    () => ProvinceCoordsMap,
    []
  );
  const provinceToCities = useMemo<ProvinceToCities>(
    () => ProvinceToCities,
    []
  );
  const provinceOptions = useMemo(() => ProvinceOptions, []);
  const cityOptions = useMemo(
    () => provinceToCities[province] ?? [],
    [province, provinceToCities]
  ); // Load provinces from API and merge with mock labels if needed
  const [apiProvinceOptions, setApiProvinceOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [apiCityOptions, setApiCityOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [apiNeighborhoodOptions, setApiNeighborhoodOptions] = useState<
    { label: string; value: string; id?: number }[]
  >([]);
  const [, setIsCitiesLoading] = useState<boolean>(false);
  React.useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const list = await locationApi.getStates();
        if (ignore) return;
        const opts = list
          .map((p: StateItemDto) => ({
            label: p.state_name,
            value: p.state_name,
          }))
          .filter((x: { label: string; value: string }) => x.label && x.value);
        setApiProvinceOptions(opts);
      } catch {
        setApiProvinceOptions([]);
      }
    })();
    return () => {
      ignore = true;
    };
  }, []); // Load counties (cities) when a province is selected
  React.useEffect(() => {
    let ignore = false;
    if (!province) {
      setApiCityOptions([]);
      setNeighborhood("");
      setApiNeighborhoodOptions([]);
      return;
    }
    (async () => {
      try {
        setIsCitiesLoading(true);
        const list = await locationApi.getCounties(province);
        if (ignore) return;
        const opts = list
          .map((c: CountyItemDto) => ({
            label: c.county_name,
            value: c.county_name,
          }))
          .filter((x: { label: string; value: string }) => x.label && x.value);
        setApiCityOptions(opts);
      } catch {
        setApiCityOptions([]);
      } finally {
        setIsCitiesLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, [province]); // Load neighborhoods (cities within county) when province and city (county) are selected
  React.useEffect(() => {
    let ignore = false;
    if (!province || !city) {
      setApiNeighborhoodOptions([]);
      setNeighborhood("");
      return;
    }
    (async () => {
      try {
        const list = await locationApi.getCities(province, city);
        if (ignore) return;
        const opts = list
          .map((n: CityItemDto) => ({
            label: n.city_name,
            value: n.city_name,
            id: n.city_id,
          }))
          .filter((x: { label: string; value: string }) => x.label && x.value);
        setApiNeighborhoodOptions(opts);
      } catch {
        setApiNeighborhoodOptions([]);
      }
    })();
    return () => {
      ignore = true;
    };
  }, [province, city]);
  const onPickSuggestion = useCallback((s: SearchAddress) => {
    setCoord([s.y, s.x]);
    setTitle(s.title);
  }, []);
  const handleProvinceChange = useCallback(
    (value: string) => {
      setProvince(value);
      const slug =
        provinceOptions.find((opt) => opt.label === value)?.value || value;
      const next = provinceCoords[slug];
      setCoord(next || IRAN_FALLBACK_COORD);
      setCity("");
    },
    [provinceCoords, provinceOptions, IRAN_FALLBACK_COORD]
  );
  const handleCityChange = useCallback((value: string) => {
    setCity(value);
    setNeighborhood("");
    // City change should not affect the map per requirement
  }, []);
  const handleProvinceDetected = useCallback(
    (provinceLabelFa: string) => {
      const normalize = (s: string) => s.replace(/^استان\s+/, "").trim();
      const normalized = normalize(provinceLabelFa);
      const match = provinceOptions.find(
        (opt) => normalize(opt.label) === normalized
      );
      if (!match) return;
      if (province !== match.value) {
        setProvince(match.value);
        setCity("");
      }
    },
    [province, provinceOptions]
  ); // Prefill fields when editing
  React.useEffect(() => {
    if (!isOpen) return;
    if (!addressUid) {
      // Reset form for create mode
      setTitle("");
      setProvince("");
      setCity("");
      setNeighborhood("");
      setBlock("");
      setUnit("");
      setDisplayAddress("");
      setCoord(IRAN_FALLBACK_COORD);
      return;
    }
    let ignore = false;
    (async () => {
      try {
        setIsPrefillLoading(true);
        const addr = await getUserAddressByUid(addressUid);
        if (ignore) return;
        setTitle(addr.address_title || "");
        setProvince(addr.province || "");
        setCity(addr.city || "");
        setNeighborhood(addr.neighborhood || "");
        setBlock((addr.plaque as string) || "");
        setUnit((addr.unit as string) || "");
        const full = [addr.address_line1, addr.address_line2]
          .filter((x) => x && String(x).trim())
          .join(" ");
        setDisplayAddress(full);
        const slug =
          provinceOptions.find((opt) => opt.label === (addr.province || ""))
            ?.value ||
          addr.province ||
          "";
        const provCoord = provinceCoords[slug as keyof typeof provinceCoords];
        setCoord(provCoord || IRAN_FALLBACK_COORD);
      } catch {
        // ignore
      } finally {
        setIsPrefillLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, [
    isOpen,
    addressUid,
    IRAN_FALLBACK_COORD,
    provinceCoords,
    provinceOptions,
  ]);
  return (
    <DrawerModal isOpen={isOpen} setIsOpen={setIsOpenAction}>
      <div className={styles["user-address-modal"]}>
        <div className={styles["user-address-modal_content"]}>
          <div className={styles["user-address-modal_map"]}>
            <LeafletMap
              coord={coord}
              setCoord={setCoord}
              setAddress={setDisplayAddress}
              onSearchResults={setSuggestions}
              onPickSuggestion={onPickSuggestion}
              onProvinceDetected={handleProvinceDetected}
            />
          </div>
          <div className={styles["user-address-modal_form"]}>
            <TextField
              placeholder="عنوان آدرس"
              label="عنوان آدرس"
              value={title}
              baseColor={{
                borderAndLabel: "gray-300",
                inputBgColor: "main-white",
                textInput: "gray-950",
                textError: "error-900",
              }}
              size="sm"
              maxLength={35}
              onChangeAction={setTitle}
            />
            <div className={styles["user-address-modal_form-double-input"]}>
              <Dropdown
                placeholder="استان"
                value={province}
                onChangeAction={handleProvinceChange}
                options={
                  apiProvinceOptions.length > 0
                    ? apiProvinceOptions
                    : provinceOptions
                }
              />
              <Dropdown
                placeholder="شهر"
                value={city}
                onChangeAction={handleCityChange}
                options={
                  apiCityOptions.length > 0 ? apiCityOptions : cityOptions
                }
                disabled={!province}
              />
            </div>
            <Dropdown
              placeholder="محله"
              value={neighborhood}
              onChangeAction={setNeighborhood}
              options={apiNeighborhoodOptions}
              disabled={!city}
            />
            <div className={styles["user-address-modal_form-double-input"]}>
              <TextField
                placeholder="پلاک"
                label="پلاک"
                baseColor={{
                  borderAndLabel: "gray-300",
                  inputBgColor: "main-white",
                  textInput: "gray-950",
                  textError: "error-900",
                }}
                size="sm"
                value={block}
                maxLength={5}
                inputMode="numeric"
                onChangeAction={(v) => setBlock(v.replace(/\D/g, ""))}
              />
              <TextField
                placeholder="واحد"
                label="واحد"
                baseColor={{
                  borderAndLabel: "gray-300",
                  inputBgColor: "main-white",
                  textInput: "gray-950",
                  textError: "error-900",
                }}
                maxLength={5}
                size="sm"
                inputMode="numeric"
                value={unit}
                onChangeAction={(v) => setUnit(v.replace(/\D/g, ""))}
              />
            </div>
            <TextField
              placeholder="آدرس را وارد کنید"
              label="آدرس انتخاب‌شده"
              baseColor={{
                borderAndLabel: "gray-300",
                inputBgColor: "main-white",
                textInput: "gray-950",
                textError: "error-900",
              }}
              size="sm"
              value={fullAddress}
              onChangeAction={() => {}}
              disabled
            />
          </div>
        </div>
        <div className={styles["user-address-modal_actions"]}>
          <Button
            bgColor="transparent"
            borderColor="secondary2-500"
            mode="side-rounded"
            paddingStyle="avg-8-24"
            onClick={() => setIsOpenAction(false)}
            fullScreen={true}
          >
            <Text
              fontFamily="moraba"
              textStyle="16S5"
              textColor="secondary2-500"
            >
              انصراف
            </Text>
          </Button>
          <Button
            bgColor="primary-600"
            hoverColor="primary-700"
            mode="side-rounded"
            paddingStyle="avg-8-24"
            onClick={async () => {
              try {
                const payload = {
                  address_title: title?.trim() || "",
                  postal_code: null,
                  latitude: coord?.[0] ?? null,
                  longitude: coord?.[1] ?? null,
                  CityId:
                    apiNeighborhoodOptions.find((o) => o.value === neighborhood)
                      ?.id ?? null,
                  RegionalDivisionRef: null,
                  is_workaddress: false,
                  is_main_address: false,
                  is_public: true,
                  address_line1: displayAddress || "",
                  address_line2: null,
                  LAN_ID: "fa",
                  plaque: block || null,
                  unit: unit || null,
                  province: province || null,
                  county: null,
                  city: city || null,
                };
                if (addressUid) {
                  await updateUserAddressByUid(addressUid, payload);
                }
                if (typeof onUpdated === "function") {
                  onUpdated();
                }
                setIsOpenAction(false);
              } catch {
                // handle error silently for now or add toast
              }
            }}
            fullScreen={true}
          >
            <Text fontFamily="moraba" textStyle="16S5" textColor="main-white">
              ثبت آدرس
            </Text>
          </Button>
        </div>
      </div>
    </DrawerModal>
  );
}
