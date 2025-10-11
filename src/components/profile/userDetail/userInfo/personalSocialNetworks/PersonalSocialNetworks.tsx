import { useEffect, useMemo, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./PersonalSocialNetworks.module.scss";
import Text from "@/components/ui/text/Text";
import Button from "@/components/ui/actions/button/Button";
import TextField from "@/components/ui/forms/textField/TextField";
import ParsehImage from "@/components/ui/image/ParsehImage";
import UserEmpty from "@/assets/images/global/userEmpty.png";
import {
  Edit,
  Trash,
  Instagram,
  Facebook,
  Whatsapp,
  TextBlock,
  Xrp,
  Global,
  AddCircle,
  Airdrop,
} from "iconsax-react";
import DrawerModal from "@/components/ui/modal/drawerModal/DrawerModal";
import Dropdown from "@/components/ui/forms/dropdown/Dropdown";
import QuadInfoCard from "@/components/ui/cards/quadInfoCard/QuadInfoCard";
import {
  Platform,
  CreatePlatformSchema,
  UpdatePlatformSchema,
  PlatformListItem,
} from "@/dtos/auth.dto";
import { updatePlatforms, getPlatformList } from "@/services/api/auth";
import { addToast } from "@/stores/ui/toast.slice";
import {
  addPlatform,
  updatePlatform,
  removePlatform,
} from "@/stores/userStores/user/user.slice";

type SocialLink = {
  id: string;
  platform: string;
  url: string;
  title?: string;
};

type PersonalSocialNetworksProps = {
  onHasLinksChange?: (hasLinks: boolean) => void; //  برای اپشنال کردن دکمه تغییر اطلاعات
};

export default function PersonalSocialNetworks({
  onHasLinksChange,
}: PersonalSocialNetworksProps) {
  const platforms = useSelector((state: { user: { platforms: Platform[] } }) => state.user.platforms);
  const dispatch = useDispatch();
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingPlatform, setEditingPlatform] = useState<Platform | null>(null);
  const [newPlatform, setNewPlatform] = useState<string>("");
  const [newTitle, setNewTitle] = useState<string>("");
  const [newUrl, setNewUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [fetchedPlatforms, setFetchedPlatforms] = useState<PlatformListItem[]>(
    []
  );
  const [isLoadingPlatforms, setIsLoadingPlatforms] = useState(false);

  // Fetch platforms on component mount
  useEffect(() => {
    const fetchPlatforms = async () => {
      try {
        setIsLoadingPlatforms(true);
        const platformsData = await getPlatformList();
        setFetchedPlatforms(platformsData);
      } catch (error) {
        console.error("Error fetching platforms:", error);
        dispatch(
          addToast({
            text: "خطا در دریافت لیست شبکه‌های اجتماعی",
            closable: true,
            duration: 3000,
          })
        );
      } finally {
        setIsLoadingPlatforms(false);
      }
    };

    fetchPlatforms();
  }, [dispatch]);

  // Convert API platforms to local format
  const apiPlatforms = useMemo(() => {
    return platforms.map((platform: Platform) => ({
      id: platform.account_id.toString(),
      platform: platform.platform_id.toString(),
      url: `${platform.base_url}/${platform.account_identifier}`,
      title: platform.account_name,
    }));
  }, [platforms]);

  // Combine API platforms with local links
  const allLinks = useMemo(() => {
    return [...apiPlatforms, ...links];
  }, [apiPlatforms, links]);

  useEffect(() => {
    onHasLinksChange?.(allLinks.length > 0);
  }, [allLinks, onHasLinksChange]);

  const handleOpenAddDrawer = () => {
    setNewPlatform("");
    setNewTitle("");
    setNewUrl("");
    setIsOpen(true);
  };

  const handleOpenEditDrawer = (platform: Platform) => {
    setEditingPlatform(platform);
    setNewPlatform(platform.platform_id.toString());
    setNewTitle(platform.account_name);
    setNewUrl(platform.account_identifier);
    setIsEditOpen(true);
  };

  const handleSubmitNewLink = async () => {
    if (!newPlatform || !newUrl) {
      return;
    }

    try {
      setIsLoading(true);

      const platformId = parseInt(newPlatform);

      const createSchema: CreatePlatformSchema = {
        account_name: newTitle || "شبکه اجتماعی",
        account_identifier: newUrl,
        is_default: 0,
        platform_id: platformId,
        is_active: 1,
      };

      const response = await updatePlatforms({
        delete_account_ids: [],
        create_schemas: [createSchema],
        update_schemas: [],
      });

      if (response.status === 1) {
        dispatch(
          addToast({
            text: "شبکه اجتماعی با موفقیت اضافه شد",
            closable: true,
            duration: 3000,
          })
        );
        // Add the new platform to the store
        const platformData = fetchedPlatforms.find(
          (p) => p.platform_id === platformId
        );
        const newPlatformData: Platform = {
          status: null,
          message: null,
          account_id: Date.now(), // Temporary ID, should come from API response
          account_name: newTitle || "شبکه اجتماعی",
          account_identifier: newUrl,
          is_active: true,
          is_default: 0,
          status_id: 1,
          platform_id: platformId,
          platform_name: platformData?.platform_name || "شبکه اجتماعی",
          base_url: "https://",
        };
        dispatch(addPlatform(newPlatformData));
      }
    } catch (error) {
      console.error("Error adding platform:", error);
      dispatch(
        addToast({
          text: "خطا در افزودن شبکه اجتماعی",
          closable: true,
          duration: 3000,
        })
      );
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  const handleUpdatePlatform = async () => {
    if (!editingPlatform || !newPlatform || !newUrl) {
      return;
    }

    try {
      setIsLoading(true);

      const platformId = parseInt(newPlatform);

      const updateSchema: UpdatePlatformSchema = {
        account_id: editingPlatform.account_id,
        account_name: newTitle || "شبکه اجتماعی",
        account_identifier: newUrl,
        is_default: editingPlatform.is_default,
        platform_id: platformId,
        is_active: editingPlatform.is_active ? 1 : 0,
      };

      const response = await updatePlatforms({
        delete_account_ids: [],
        create_schemas: [],
        update_schemas: [updateSchema],
      });

      if (response.status === 1) {
        dispatch(
          addToast({
            text: "شبکه اجتماعی با موفقیت بروزرسانی شد",
            closable: true,
            duration: 3000,
          })
        );
        // Update the platform in the store
        const platformData = fetchedPlatforms.find(
          (p) => p.platform_id === platformId
        );
        const updatedPlatformData: Platform = {
          ...editingPlatform,
          account_name: newTitle || "شبکه اجتماعی",
          account_identifier: newUrl,
          platform_id: platformId,
          platform_name: platformData?.platform_name || "شبکه اجتماعی",
          base_url: "https://",
        };
        dispatch(updatePlatform(updatedPlatformData));
      }
    } catch (error) {
      console.error("Error updating platform:", error);
      dispatch(
        addToast({
          text: "خطا در بروزرسانی شبکه اجتماعی",
          closable: true,
          duration: 3000,
        })
      );
    } finally {
      setIsLoading(false);
      setIsEditOpen(false);
    }
  };

  const handleDeletePlatform = useCallback(async (platform: Platform) => {
    try {
      setIsLoading(true);

      const response = await updatePlatforms({
        delete_account_ids: [platform.account_id],
        create_schemas: [],
        update_schemas: [],
      });

      if (response.status === 1) {
        dispatch(
          addToast({
            text: "شبکه اجتماعی با موفقیت حذف شد",
            closable: true,
            duration: 3000,
          })
        );
        // Remove the platform from the store
        dispatch(removePlatform(platform.account_id));
      }
    } catch (error) {
      console.error("Error deleting platform:", error);
      dispatch(
        addToast({
          text: "خطا در حذف شبکه اجتماعی",
          closable: true,
          duration: 3000,
        })
      );
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  const handleRemove = (id: string) => {
    setLinks((prev) => prev.filter((item) => item.id !== id));
  };


  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "1": // instagram
        return Instagram;
      case "2": // facebook
        return Facebook;
      case "3": // whatsapp
        return Whatsapp;
      case "4": // telegram
        return TextBlock;
      case "5": // twitter
        return Xrp;
      case "6": // website
      default:
        return Global;
    }
  };

  // Get icon for platform by name (for fetched platforms)
  const getPlatformIconByName = (platformName: string) => {
    const nameMap: Record<string, typeof Instagram> = {
      اینستاگرام: Instagram,
      فیسبوک: Facebook,
      واتساپ: Whatsapp,
      تلگرام: TextBlock,
      توییتر: Xrp,
      "سایت اصلی": Global,
    };
    return nameMap[platformName] || Airdrop; // Use Airdrop for unknown platforms
  };

  const content = useMemo(() => {
    if (isLoadingPlatforms) {
      return (
        <div className={styles["personal-social-networks__empty"]}>
          <div className={styles["personal-social-networks__empty-img"]}>
            <ParsehImage
              imgSrc={UserEmpty}
              imgAlt="loading"
              width={156}
              height={156}
              fitDirection="width"
              aspectRatio="1/1"
            />
          </div>
          <Text textStyle="16S7" textColor="main-black">
            در حال بارگذاری شبکه‌های اجتماعی...
          </Text>
        </div>
      );
    }

    if (allLinks.length === 0) {
      return (
        <div className={styles["personal-social-networks__empty"]}>
          <div className={styles["personal-social-networks__empty-img"]}>
            <ParsehImage
              imgSrc={UserEmpty}
              imgAlt="empty"
              width={156}
              height={156}
              fitDirection="width"
              aspectRatio="1/1"
            />
          </div>
          <Text textStyle="16S7" textColor="main-black">
            شما هنوز لینک شبکه اجتماعی ثبت نکرده‌اید
          </Text>
          <Text textStyle="14S4" textColor="gray-700">
            با ثبت شبکه‌های اجتماعی خود می‌توانید این کانال‌ها را شناخته‌تر شوید
          </Text>
          <Button
            bgColor="primary-700"
            mode="side-rounded"
            paddingStyle="avg-8-32"
            shadow="primary-800"
            onClick={handleOpenAddDrawer}
          >
            <Text textStyle="16S7" textColor="main-white" fontFamily="moraba">
              افزودن شبکه اجتماعی
            </Text>
          </Button>
        </div>
      );
    }

    return (
      <div className={styles["personal-social-networks__list-wrapper"]}>
        <div className={styles["personal-social-networks__add-inline-wrapper"]}>
          <Button
            onClick={handleOpenAddDrawer}
            bgColor="transparent"
            hoverColor="primary-50"
            mode="side-rounded"
            paddingStyle="fat"
          >
            <AddCircle size={18} color="var(--primary-700)" variant="Bulk" />
            <Text textStyle="16S5" textColor="primary-700" fontFamily="moraba">
              شبکه اجتماعی جدید
            </Text>
          </Button>
        </div>
        <div className={styles["personal-social-networks__list"]}>
          {allLinks.map((item) => {
            const isApiPlatform = apiPlatforms.some(
              (p: { id: string }) => p.id === item.id
            );
            const platformData = isApiPlatform
              ? platforms.find(
                  (p: Platform) => p.account_id.toString() === item.id
                )
              : null;

            // Get the platform info from fetched platforms
            const fetchedPlatformInfo = fetchedPlatforms.find(
              (p) => p.platform_id === (platformData?.platform_id || 0)
            );
            const platformName =
              fetchedPlatformInfo?.platform_name || item.platform;
            const IconCmp = fetchedPlatformInfo
              ? getPlatformIconByName(fetchedPlatformInfo.platform_name)
              : getPlatformIcon(item.platform);

            return (
              <QuadInfoCard
                key={item.id}
                data={{
                  topRight: (
                    <div
                      className={
                        styles["personal-social-networks__item-top-right"]
                      }
                    >
                      <IconCmp
                        size={18}
                        color="var(--gray-900)"
                        variant="Bulk"
                      />
                      <Text textStyle="14S5" textColor="gray-800">
                        {platformName}
                      </Text>
                    </div>
                  ),
                  topLeft: (
                    <div
                      className={
                        styles["personal-social-networks__item-actions"]
                      }
                    >
                      {/* Show delete and edit for API platforms */}
                      {isApiPlatform && platformData && (
                        <>
                          <Trash
                            size={18}
                            color="var(--error-700)"
                            variant="Bulk"
                            onClick={() => handleDeletePlatform(platformData)}
                          />
                          <Edit
                            size={18}
                            color="var(--primary-700)"
                            variant="Bulk"
                            onClick={() => handleOpenEditDrawer(platformData)}
                          />
                        </>
                      )}
                      {/* Only show delete for local links */}
                      {!isApiPlatform && (
                        <Trash
                          size={18}
                          color="var(--error-700)"
                          variant="Bulk"
                          onClick={() => handleRemove(item.id)}
                        />
                      )}
                    </div>
                  ),
                  bottomRight: (
                    <Text textStyle="14S5" textColor="primary-700">
                      {item.url.length > 52
                        ? item.url.slice(0, 50) + "..."
                        : item.url}
                    </Text>
                  ),
                }}
                styleBox={{
                  bgColor: "gray-50",
                  width: "100%",
                  gap: "4px",
                }}
              />
            );
          })}
        </div>
      </div>
    );
  }, [allLinks, apiPlatforms, platforms, isLoadingPlatforms, fetchedPlatforms, handleDeletePlatform]);

  const platformOptions = useMemo(() => {
    if (isLoadingPlatforms) {
      return [];
    }

    return fetchedPlatforms
      .filter((platform) => platform.is_active === 1)
      .map((platform) => ({
        label: platform.platform_name,
        value: platform.platform_id.toString(),
      }));
  }, [fetchedPlatforms, isLoadingPlatforms]);

  return (
    <div className={styles["personal-social-networks"]}>
      {content}

      {/* Add Platform Drawer */}
      <DrawerModal isOpen={isOpen} setIsOpen={setIsOpen}>
        <div className={styles["personal-social-networks__drawer"]}>
          <div className={styles["personal-social-networks__drawer-top"]}>
            <Text
              textStyle="16S7"
              textColor="gray-950"
              textAlign="right"
              fontFamily="moraba"
            >
              افزودن شبکه اجتماعی
            </Text>

            <div className={styles["personal-social-networks__drawer-field"]}>
              <Dropdown
                label="شبکه اجتماعی"
                placeholder={
                  isLoadingPlatforms
                    ? "در حال بارگذاری..."
                    : "انتخاب شبکه اجتماعی"
                }
                value={newPlatform}
                onChangeAction={(val) => setNewPlatform(val)}
                options={platformOptions}
                size="sm"
                disabled={isLoadingPlatforms}
                baseColor={{
                  borderAndLabel: "gray-200",
                  inputBgColor: "main-white",
                  textInput: "gray-950",
                }}
              />
            </div>

            <div className={styles["personal-social-networks__drawer-row"]}>
              <TextField
                label="عنوان"
                placeholder="عنوان"
                value={newTitle}
                baseColor={{
                  borderAndLabel: "gray-200",
                  inputBgColor: "main-white",
                  textInput: "gray-950",
                }}
                maxLength={30}
                onChangeAction={(val) => setNewTitle(val)}
                size="sm"
              />
              <TextField
                label="لینک"
                placeholder="لینک"
                value={newUrl}
                onChangeAction={(val) => setNewUrl(val)}
                size="sm"
                baseColor={{
                  borderAndLabel: "gray-200",
                  inputBgColor: "main-white",
                  textInput: "gray-950",
                }}
                maxLength={50}
                leftContentText="@"
              />
            </div>
          </div>

          <Button
            bgColor="primary-700"
            mode="side-rounded"
            paddingStyle="avg-8-24"
            shadow="primary-800"
            onClick={handleSubmitNewLink}
            disabled={isLoading}
          >
            <Text textStyle="16S7" textColor="main-white" fontFamily="moraba">
              {isLoading ? "در حال ثبت..." : "ثبت"}
            </Text>
          </Button>
        </div>
      </DrawerModal>

      {/* Edit Platform Drawer */}
      <DrawerModal isOpen={isEditOpen} setIsOpen={setIsEditOpen}>
        <div className={styles["personal-social-networks__drawer"]}>
          <div className={styles["personal-social-networks__drawer-top"]}>
            <Text
              textStyle="16S7"
              textColor="gray-950"
              textAlign="right"
              fontFamily="moraba"
            >
              ویرایش شبکه اجتماعی
            </Text>

            <div className={styles["personal-social-networks__drawer-field"]}>
              <Dropdown
                label="شبکه اجتماعی"
                placeholder={
                  isLoadingPlatforms
                    ? "در حال بارگذاری..."
                    : "انتخاب شبکه اجتماعی"
                }
                value={newPlatform}
                onChangeAction={(val) => setNewPlatform(val)}
                options={platformOptions}
                size="sm"
                disabled={isLoadingPlatforms}
                baseColor={{
                  borderAndLabel: "gray-200",
                  inputBgColor: "main-white",
                  textInput: "gray-950",
                }}
              />
            </div>

            <div className={styles["personal-social-networks__drawer-row"]}>
              <TextField
                label="عنوان"
                placeholder="عنوان"
                value={newTitle}
                baseColor={{
                  borderAndLabel: "gray-200",
                  inputBgColor: "main-white",
                  textInput: "gray-950",
                }}
                maxLength={30}
                onChangeAction={(val) => setNewTitle(val)}
                size="sm"
              />
              <TextField
                label="لینک"
                placeholder="لینک"
                value={newUrl}
                onChangeAction={(val) => setNewUrl(val)}
                size="sm"
                baseColor={{
                  borderAndLabel: "gray-200",
                  inputBgColor: "main-white",
                  textInput: "gray-950",
                }}
                maxLength={50}
                leftContentText="@"
              />
            </div>
          </div>

          <Button
            bgColor="primary-700"
            mode="side-rounded"
            paddingStyle="avg-8-24"
            shadow="primary-800"
            onClick={handleUpdatePlatform}
            disabled={isLoading}
          >
            <Text textStyle="16S7" textColor="main-white" fontFamily="moraba">
              {isLoading ? "در حال بروزرسانی..." : "بروزرسانی"}
            </Text>
          </Button>
        </div>
      </DrawerModal>
    </div>
  );
}
