import React, { useEffect, useState } from "react";
import styles from "./NikiYarCreateServices.module.scss";
import Modal from "@/components/ui/modal/Modal";
import Text from "@/components/ui/text/Text";
import TextField from "@/components/ui/forms/textField/TextField";
import Checkbox from "@/components/ui/forms/checkbox/Checkbox";
import Dropdown from "@/components/ui/forms/dropdown/Dropdown";
import Button from "@/components/ui/actions/button/Button";
import QuadInfoCard from "@/components/ui/cards/quadInfoCard/QuadInfoCard";
import { getUserAddresses } from "@/services/api/addresses";
import type { AddressItemDto } from "@/dtos/address.dto";
import { useRouter } from "next/router";
import { useClubLevels } from "@/hooks/api/useClubLevels";
import {
  getNikiYarMainCategories,
  getNikiYarSubCategories,
} from "@/services/api/nikiYarCategories";
import { AddCircle, Map } from "iconsax-react";
import {
  createNikiYarProduct,
  updateNikiYarProduct,
  CreateNikiYarProductRequest,
  UpdateNikiYarProductRequest,
} from "@/services/api/nikiYarProduct";
import {
  nikiYarService,
  type NikiYarDetailResponse,
} from "@/services/api/nikiYarService";

interface NikiYarCreateServicesProps {
  isOpen: boolean;
  onClose: () => void;
  showAddressSelector?: boolean;
  serviceType: "vip" | "discount";
  editMode?: boolean;
  editProductId?: number;
  onProductUpdated?: () => void;
}

export default function NikiYarCreateServices({
  isOpen,
  onClose,
  showAddressSelector = false,
  serviceType,
  editMode = false,
  editProductId,
  onProductUpdated,
}: NikiYarCreateServicesProps) {
  const router = useRouter();
  const { items: clubLevels } = useClubLevels();
  const [description, setDescription] = useState<string>("");
  const [levels, setLevels] = useState<Record<string, boolean>>({});
  const [levelsPercent, setLevelsPercent] = useState<Record<string, string>>(
    {}
  );
  const [levelKeys, setLevelKeys] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>("");
  const [categories, setCategories] = useState<
    { label: string; value: string }[]
  >([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [subCategories, setSubCategories] = useState<
    { label: string; value: string }[]
  >([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("");
  const [addresses, setAddresses] = useState<AddressItemDto[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState<boolean>(false);
  const [addressesError, setAddressesError] = useState<string>("");
  const [selectedAddressUids, setSelectedAddressUids] = useState<Set<string>>(
    new Set()
  );

  // States for edit mode
  const [isLoadingProduct, setIsLoadingProduct] = useState<boolean>(false);
  const [productData, setProductData] = useState<NikiYarDetailResponse | null>(
    null
  );

  // Helper function to normalize keys
  const normalizeKey = (key: string): string => {
    return key.trim();
  };

  // Helper function to find percent by trying both original and normalized keys
  const findPercent = (levelName: string): string | undefined => {
    const normalized = normalizeKey(levelName);
    // ابتدا key اصلی را امتحان کن، سپس normalized، سپس تمام keys را بررسی کن
    if (levelsPercent[levelName]) {
      return levelsPercent[levelName];
    }
    if (levelsPercent[normalized]) {
      return levelsPercent[normalized];
    }

    // اگر پیدا نشد، تمام keys را بررسی کن و اگر normalized آنها مطابقت داشت، برگردان
    for (const key in levelsPercent) {
      if (normalizeKey(key) === normalized) {
        return levelsPercent[key];
      }
    }

    return undefined;
  };

  useEffect(() => {
    const levelData = Array.isArray(clubLevels) ? clubLevels : [];
    const names = levelData
      .map((item) => (item?.level_name || "").trim())
      .filter((name) => name.length > 0);
    setLevelKeys(names);
  }, [clubLevels]);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        // استفاده از serviceType برای تعیین is_vip
        const isVip = serviceType === "vip";
        const data = await getNikiYarMainCategories(isVip);
        if (!isMounted) return;
        const opts = (Array.isArray(data) ? data : []).map((c) => ({
          label: c.category_name,
          value: String(c.category_id),
        }));
        setCategories(opts);
      } catch {
        // ignore silently
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [serviceType]); // اضافه کردن serviceType به dependencies

  useEffect(() => {
    let isMounted = true;
    (async () => {
      if (!selectedCategory) {
        setSubCategories([]);
        setSelectedSubCategory("");
        return;
      }
      try {
        // استفاده از serviceType برای تعیین is_vip
        const isVip = serviceType === "vip";
        const data = await getNikiYarSubCategories(Number(selectedCategory), isVip);
        if (!isMounted) return;
        const opts = (Array.isArray(data) ? data : []).map((c) => ({
          label: c.category_name,
          value: String(c.category_id),
        }));
        setSubCategories(opts);
      } catch {
        // ignore silently
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [selectedCategory, serviceType]); // اضافه کردن serviceType به dependencies

  useEffect(() => {
    let isMounted = true;
    (async () => {
      if (!showAddressSelector) return;
      setIsLoadingAddresses(true);
      setAddressesError("");
      try {
        const res = await getUserAddresses({ limit: 10, offset: 0 });
        if (!isMounted) return;
        setAddresses(Array.isArray(res?.items) ? res.items : []);
      } catch (e) {
        if (!isMounted) return;
        setAddressesError("خطا در دریافت آدرس‌ها");
      } finally {
        if (isMounted) setIsLoadingAddresses(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [showAddressSelector]);

  // Load product data for edit mode
  useEffect(() => {
    let isMounted = true;

    if (!editMode || !editProductId || !isOpen) return;

    (async () => {
      setIsLoadingProduct(true);
      try {
        const data = await nikiYarService.getNikiYarDetail(editProductId);
        if (!isMounted) return;

        setProductData(data);

        // Populate form with existing data
        setDescription(data.service_description || "");
        // data.category_id is the subcategory, we need to find its parent
        setSelectedSubCategory(String(data.category_id || ""));
        // Try to find parent category from subcategories
        // This will be set when subcategories are loaded

        // Populate levels and offers
        const levelStates: Record<string, boolean> = {};
        const levelPercents: Record<string, string> = {};

        data.offers.forEach((offer) => {
          // Find level name by level_id
          const clubLevel = clubLevels.find(
            (cl) => cl.level_id === offer.cust_level
          );
          if (clubLevel) {
            levelStates[clubLevel.level_name] = true;
            if (offer.discount_percent > 0) {
              levelPercents[clubLevel.level_name] = String(
                offer.discount_percent
              );
            }
          }
        });

        setLevels(levelStates);
        setLevelsPercent(levelPercents);

        // Populate addresses if applicable
        if (showAddressSelector && data.delivery_methods) {
          const addressUids = new Set<string>();
          data.delivery_methods.forEach((method) => {
            if (method.address?.address_uid) {
              addressUids.add(method.address.address_uid);
            }
          });
          setSelectedAddressUids(addressUids);
        }
      } catch (error) {
        console.error("Error loading product data:", error);
      } finally {
        if (isMounted) setIsLoadingProduct(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [editMode, editProductId, isOpen, clubLevels, showAddressSelector]);

  // Auto-select parent category when subcategory is selected in edit mode
  useEffect(() => {
    if (!editMode || !selectedSubCategory || !categories.length) return;

    // Find the parent category for the selected subcategory
    for (const category of categories) {
      // Load subcategories for this category to check if our selectedSubCategory belongs to it
      (async () => {
        try {
          const isVip = serviceType === "vip";
          const subCats = await getNikiYarSubCategories(Number(category.value), isVip);
          const matchingSubCat = subCats.find(
            (sc) => String(sc.category_id) === selectedSubCategory
          );
          if (matchingSubCat) {
            setSelectedCategory(category.value);
          }
        } catch {
          // Ignore errors
        }
      })();
    }
  }, [editMode, selectedSubCategory, categories, serviceType]);

  const toggleLevel = (key: string) =>
    setLevels((prev) => {
      const nextChecked = !prev[key];
      const next = { ...prev, [key]: nextChecked };
      if (!nextChecked) {
        setLevelsPercent((p) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { [key]: _removed, ...rest } = p;
          return rest;
        });
      }
      return next;
    });
  const handlePercentChange = (key: string, v: string) => {
    // تمیز کردن key از فاصله‌های اضافی
    const cleanKey = normalizeKey(key);
    let cleaned = v.replace(/[^0-9.]/g, "");
    const firstDot = cleaned.indexOf(".");

    // اگر نقطه وجود دارد، فقط یک نقطه مجاز است
    if (firstDot !== -1) {
      cleaned =
        cleaned.slice(0, firstDot + 1) +
        cleaned.slice(firstDot + 1).replace(/\./g, "");
    }

    const [intPart, fracPart = ""] = cleaned.split(".");

    // محدود کردن به حداکثر 2 رقم برای قسمت صحیح (99) و 1 رقم اعشار
    const limitedInt = intPart.slice(0, 2);
    const limitedFrac = fracPart.slice(0, 1);

    // اگر نقطه وجود دارد، آن را حفظ می‌کنیم حتی اگر قسمت اعشار خالی باشد
    const hasDot = cleaned.includes(".");
    const composed = hasDot ? `${limitedInt}.${limitedFrac}` : limitedInt;

    const numValue = parseFloat(composed);

    // فقط اگر عدد کامل باشد (نه در حال تایپ) بررسی می‌کنیم
    if (composed.includes(".") && !composed.endsWith(".") && numValue > 99.9) {
      // اگر بیشتر از 99.9 باشد، آن را به 99.9 محدود می‌کنیم
      setLevelsPercent((p) => ({ ...p, [cleanKey]: "99.9" }));
    } else {
      setLevelsPercent((p) => ({ ...p, [cleanKey]: composed }));
    }
  };

  const clampPercentOnBlur = (key: string) => {
    // تمیز کردن key از فاصله‌های اضافی
    const cleanKey = normalizeKey(key);
    const raw = levelsPercent[cleanKey];
    const num = parseFloat(raw);
    if (isNaN(num)) {
      setLevelsPercent((p) => ({ ...p, [cleanKey]: "" }));
      return;
    }
    // حداکثر درصد را به 99.9 و حداقل را 0.1 تغییر دادیم
    const clamped = Math.max(0.1, Math.min(99.9, num));
    const normalized = clamped.toFixed(1).replace(/\.0$/, "");
    setLevelsPercent((p) => ({ ...p, [cleanKey]: normalized }));
  };

  const getMethodType = (): number => {
    if (showAddressSelector) {
      return 1; // حضوری
    }
    // بر اساس serviceType تشخیص دادن method_type
    // در حال حاضر فرض می‌کنیم که VIP = آنلاین و discount می‌تواند آنلاین یا نیکی مارکت باشد
    return 0; // آنلاین به عنوان پیش‌فرض
  };

  const validateForm = (): string | null => {

    if (!selectedSubCategory) {
      return "لطفاً زیرخدمت را انتخاب کنید";
    }
    if (!description.trim()) {
      return "لطفاً توضیحات را وارد کنید";
    }

    const selectedLevels = Object.keys(levels).filter((key) => levels[key]);

    if (selectedLevels.length === 0) {
      return "حداقل یک سطح باشگاه را انتخاب کنید";
    }

    // بررسی اینکه club levels لود شده‌اند
    if (clubLevels.length === 0) {
      return "در حال بارگذاری اطلاعات باشگاه، لطفاً کمی صبر کنید";
    }

    // بررسی درصد تخفیف برای سرویس discount
    if (serviceType === "discount") {
      for (const levelName of selectedLevels) {
        // استفاده از helper function برای پیدا کردن درصد
        const percent = findPercent(levelName);
        const percentNum = parseFloat(percent || "0");
        const cleanLevelName = normalizeKey(levelName);


        if (
          !percent ||
          !percent.trim() ||
          isNaN(percentNum) ||
          percentNum <= 0 ||
          percentNum > 99.9
        ) {
          return `لطفاً درصد تخفیف معتبر (بین 0.1 تا 99.9) برای سطح ${cleanLevelName} وارد کنید`;
        }
      }
    }

    // بررسی آدرس برای سرویس‌های حضوری
    if (showAddressSelector && selectedAddressUids.size === 0) {
      return "حداقل یک آدرس را انتخاب کنید";
    }

    return null;
  };

  const handleSubmit = async () => {
    setSubmitError("");

    const validationError = validateForm();
    if (validationError) {
      setSubmitError(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      // تبدیل level names به level IDs
      const selectedLevels = Object.keys(levels).filter((key) => levels[key]);
      const offers = selectedLevels.map((levelName) => {
        const cleanLevelName = normalizeKey(levelName);
        const clubLevel = clubLevels.find(
          (cl) => cl.level_name === cleanLevelName
        );
        const discountPercent =
          serviceType === "discount"
            ? parseFloat(findPercent(levelName) || "0")
            : 0; // برای VIP درصد تخفیف 0

        // اطمینان از اینکه cust_level حداقل 1 باشد
        const custLevel =
          clubLevel?.level_id && clubLevel.level_id > 0
            ? clubLevel.level_id
            : 1;

        return {
          discount_percent: discountPercent,
          cust_level: custLevel,
        };
      });

      // ساخت request body
      const requestData: CreateNikiYarProductRequest = {
        category_id: Number(selectedSubCategory),
        delivery_method: {
          method_type: getMethodType(),
          ...(showAddressSelector &&
            selectedAddressUids.size > 0 && {
              addresses: Array.from(selectedAddressUids).map((addressId) => ({
                addressref: addressId,
              })),
            }),
        },
        offers,
        description: description.trim(),
      };

      console.log("Sending request data:", {
        ...requestData,
        offers_detail: offers.map((offer) => ({
          ...offer,
          level_name: selectedLevels.find((levelName) => {
            const clubLevel = clubLevels.find(
              (cl) => cl.level_name === levelName
            );
            return clubLevel?.level_id === offer.cust_level;
          }),
        })),
      });

      let response;
      if (editMode && editProductId && productData) {
        // ساخت updateData با فقط مقادیر تغییر کرده
        const updateData: Partial<UpdateNikiYarProductRequest> = {
          // offers همیشه ارسال می‌شود
          offers: selectedLevels.map((levelName) => {
            const cleanLevelName = normalizeKey(levelName);
            const clubLevel = clubLevels.find(
              (cl) => cl.level_name === cleanLevelName
            );
            const discountPercent =
              serviceType === "discount"
                ? parseFloat(findPercent(levelName) || "0")
                : 0;

            const custLevel =
              clubLevel?.level_id && clubLevel.level_id > 0
                ? clubLevel.level_id
                : 1;

            return {
              cust_level: custLevel,
              discount_percent: discountPercent,
              is_active: true,
              start_datetime: new Date().toISOString(),
              end_datetime: new Date(
                Date.now() + 365 * 24 * 60 * 60 * 1000
              ).toISOString(), // یک سال بعد
              max_discount_amount: 0,
              min_order_amount: 0,
            };
          }),
        };

        // فقط در صورت تغییر، فیلدها را اضافه کن
        if (Number(selectedSubCategory) !== productData.category_id) {
          updateData.category_id = Number(selectedSubCategory);
        }
        
        if (description.trim() !== (productData.service_description || "").trim()) {
          updateData.description = description.trim();
        }

        // اضافه کردن فیلدهای پیش‌فرض اگر نیاز باشد
        updateData.base_price = 0;
        updateData.currency_id = 1;
        updateData.imagefile_uid = null;
        updateData.is_active = true;
        updateData.delivery_method = {
          updates_delivery_methods: [],
          creates_delivery_methods:
            showAddressSelector && selectedAddressUids.size > 0
              ? [
                  {
                    method_type: getMethodType(),
                    online_details: "",
                    contact_phone: "",
                    contact_email: "",
                    addresses: Array.from(selectedAddressUids).map(
                      (addressId) => ({
                        addressref: addressId,
                        address_description: "",
                        working_hours: "",
                      })
                    ),
                  },
                ]
              : [],
          deletes_delivery_methods: [],
        };

        console.log("Update data being sent:", updateData);
        response = await updateNikiYarProduct(editProductId, updateData as UpdateNikiYarProductRequest);
      } else {
        response = await createNikiYarProduct(requestData);
      }

      // موفقیت - بستن مودال
      console.log(
        `Product ${editMode ? "updated" : "created"} successfully:`,
        response
      );
      onClose();

      // Call callback if provided (for refreshing parent data)
      if (onProductUpdated) {
        onProductUpdated();
      }
    } catch (error) {
      console.error(
        `Error ${editMode ? "updating" : "creating"} product:`,
        error
      );
      setSubmitError(
        `خطا در ${
          editMode ? "به‌روزرسانی" : "ایجاد"
        } محصول. لطفاً مجدداً تلاش کنید.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${editMode ? "ویرایش" : "ایجاد"} سرویس / خدمت ${
        serviceType === "discount" ? "تخفیف‌دار" : "VIP"
      }`}
      body={
        isLoadingProduct ? (
          <div className={styles["niki-yar-create-services"]}>
            <Text textStyle="14S5" textColor="gray-700" textAlign="center">
              در حال بارگذاری اطلاعات محصول...
            </Text>
          </div>
        ) : (
          <div className={styles["niki-yar-create-services"]}>
            <div className={styles["niki-yar-create-services__row"]}>
              <Text textStyle="14S7" textColor="gray-950" textAlign="right">
                خدمت / سرویس خود را انتخاب کنید
              </Text>
              <div className={styles["niki-yar-create-services__dropdown-box"]}>
                <Dropdown
                  options={categories}
                  placeholder="انتخاب دسته‌بندی اصلی"
                  value={selectedCategory}
                  onChangeAction={(val) => setSelectedCategory(String(val))}
                  size="sm"
                />
                <Dropdown
                  options={subCategories}
                  placeholder="انتخاب زیرخدمت"
                  value={selectedSubCategory}
                  onChangeAction={(val) => setSelectedSubCategory(String(val))}
                  size="sm"
                  disabled={!selectedCategory}
                />
              </div>
            </div>

            <div className={styles["niki-yar-create-services__description"]}>
              <TextField
                isTextArea={true}
                rows={4}
                size="sm"
                value={description}
                onChangeAction={setDescription}
                label={
                  serviceType === "discount"
                    ? "یک توضیح کوتاه درباره خدمت خود بنویسید"
                    : "شرح کوتاهی از سرویس VIP خود دهید"
                }
                inputMode="text"
                baseColor={{
                  textInput: "gray-800",
                  borderAndLabel: "gray-200",
                  inputBgColor: "main-white",
                }}
              />
            </div>

            {showAddressSelector && (
              <div className={styles["niki-yar-create-services__addresses"]}>
                <div
                  className={
                    styles["niki-yar-create-services__addresses-header"]
                  }
                >
                  <Text textStyle="14S7" textColor="gray-950" textAlign="right">
                    آدرس‌های من
                  </Text>
                  <Button
                    bgColor="transparent"
                    onClick={() => {
                      router.push(
                        "/profile?tab=user-detail&usertab=user-addresses"
                      );
                    }}
                  >
                    <div
                      className={
                        styles[
                          "niki-yar-create-services__addresses-header-button"
                        ]
                      }
                    >
                      <AddCircle
                        size={24}
                        color="var(--primary-700)"
                        variant="Bulk"
                      />
                      <Text
                        textStyle="14S5"
                        textColor="primary-700"
                        fontFamily="moraba"
                      >
                        ثبت آدرس جدید
                      </Text>
                    </div>
                  </Button>
                </div>
                {isLoadingAddresses && (
                  <Text textStyle="14S5" textColor="gray-700">
                    در حال بارگذاری...
                  </Text>
                )}
                {!!addressesError && !isLoadingAddresses && (
                  <Text textStyle="14S5" textColor="error-700">
                    {addressesError}
                  </Text>
                )}
                <div
                  className={styles["niki-yar-create-services__addresses-list"]}
                >
                  {!isLoadingAddresses &&
                    !addressesError &&
                    addresses.map((a) => {
                      const title = a.address_title || "بدون عنوان";
                      const addressFull = [a.address_line1, a.address_line2]
                        .filter((x) => x && String(x).trim())
                        .join(" ");
                      const display =
                        addressFull && addressFull.length > 0
                          ? addressFull
                          : [
                              a.province,
                              a.county,
                              a.city,
                              a.neighborhood,
                              a.plaque,
                              a.unit,
                            ]
                              .filter((x) => x && String(x).trim())
                              .join("، ");
                      return (
                        <QuadInfoCard
                          key={a.address_uid || String(a.address_id)}
                          data={{
                            topRight: (
                              <Text
                                textStyle="14S7"
                                textColor="main-black"
                                fontFamily="moraba"
                                wrap="nowrap"
                              >
                                {title.length > 38
                                  ? title.slice(0, 35) + "..."
                                  : title}
                              </Text>
                            ),
                            bottomRight: (
                              <Text
                                textStyle="14S5"
                                wrap="nowrap"
                                textColor="main-black"
                                textAlign="right"
                              >
                                {display.length > 52
                                  ? display.slice(0, 50) + "..."
                                  : display}
                              </Text>
                            ),
                          }}
                          styleBox={{
                            bgColor: selectedAddressUids.has(
                              a.address_uid || String(a.address_id)
                            )
                              ? "primary-100"
                              : "gray-50",
                            width: "100%",
                            gap: "4px",
                          }}
                          onClick={() => {
                            const id = a.address_uid || String(a.address_id);
                            setSelectedAddressUids((prev) => {
                              const next = new Set(prev);
                              if (next.has(id)) {
                                next.delete(id);
                              } else {
                                next.add(id);
                              }
                              return next;
                            });
                          }}
                        />
                      );
                    })}
                </div>
              </div>
            )}

            <div className={styles["niki-yar-create-services__levels"]}>
              <Text textStyle="14S7" textColor="gray-950" textAlign="right">
                خدمت / سرویس {serviceType === "discount" ? "تخفیف‌دار" : "VIP"}{" "}
                خود را برای چه سطحی از باشگاه نیکی‌‌گرام ارائه خواهید داد؟
              </Text>
              <div
                className={
                  styles["niki-yar-create-services__levels-item-wrapper"]
                }
              >
                {levelKeys.map((label) => (
                  <div
                    key={label}
                    className={styles["niki-yar-create-services__levels-item"]}
                  >
                    <Checkbox
                      key={label}
                      id={label}
                      name={label}
                      checked={!!levels[label]}
                      onChangeAction={() => toggleLevel(label)}
                      title={label}
                      variant="square"
                    />
                    {serviceType === "discount" && (
                      <div
                        className={
                          styles[
                            "niki-yar-create-services__levels-item-percent"
                          ]
                        }
                      >
                        <TextField
                          size="sm"
                          value={levelsPercent[label] || ""}
                          onChangeAction={(v) => handlePercentChange(label, v)}
                          onBlur={() => clampPercentOnBlur(label)}
                          placeholder="درصد تخفیف"
                          disabled={!levels[label]}
                          inputMode="numeric"
                          leftContentText={levelsPercent[label] ? `%` : ""}
                          baseColor={{
                            borderAndLabel: "gray-300",
                            inputBgColor: "main-white",
                            textInput: "gray-950",
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {submitError && (
              <div className={styles["niki-yar-create-services__error"]}>
                <Text textStyle="14S5" textColor="error-700" textAlign="right">
                  {submitError}
                </Text>
              </div>
            )}
          </div>
        )
      }
      footer={
        <div className={styles["niki-yar-create-services__footer"]}>
          <Button
            bgColor="primary-700"
            paddingStyle="avg-8-32"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            <Text textStyle="16S5" textColor="main-white" fontFamily="moraba">
              {isSubmitting
                ? editMode
                  ? "در حال به‌روزرسانی..."
                  : "در حال ثبت..."
                : editMode
                ? "به‌روزرسانی"
                : "ثبت"}
            </Text>
          </Button>
        </div>
      }
    />
  );
}
