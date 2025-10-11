import { useEffect, useMemo, useState, useCallback } from "react";
import styles from "./BusinessPersonalSocialNetworks.module.scss";
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
import { PlatformAccount, UpdatePlatformsRequest } from "@/types/business";
import { getPlatformList } from "@/services/api/auth";
import { PlatformListItem } from "@/dtos/auth.dto";

type Platform =
  | "instagram"
  | "facebook"
  | "whatsapp"
  | "website"
  | "telegram"
  | "twitter";


type PersonalSocialNetworksProps = {
  onHasLinksChange?: (hasLinks: boolean) => void; //  برای اپشنال کردن دکمه تغییر اطلاعات
  platformAccounts?: PlatformAccount[];
  loading: boolean;
  updatePlatforms: (data: UpdatePlatformsRequest) => Promise<unknown>;
  platformsUpdateLoading: boolean;
};

export default function BusinessPersonalSocialNetworks({
  onHasLinksChange,
  platformAccounts,
  updatePlatforms,
  platformsUpdateLoading,
}: PersonalSocialNetworksProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<PlatformAccount | null>(null);
  const [newPlatform, setNewPlatform] = useState<string>("");
  const [newTitle, setNewTitle] = useState<string>("");
  const [newUrl, setNewUrl] = useState<string>("");
  const [fetchedPlatforms, setFetchedPlatforms] = useState<PlatformListItem[]>([]);
  const [isLoadingPlatforms, setIsLoadingPlatforms] = useState(false);

  // دریافت لیست پلتفرم‌های موجود
  useEffect(() => {
    const fetchPlatforms = async () => {
      try {
        setIsLoadingPlatforms(true);
        const platformsData = await getPlatformList();
        setFetchedPlatforms(platformsData);
      } catch (error) {
        console.error("Error fetching platforms:", error);
      } finally {
        setIsLoadingPlatforms(false);
      }
    };

    fetchPlatforms();
  }, []);

  useEffect(() => {
    onHasLinksChange?.(Boolean(platformAccounts && platformAccounts.length > 0));
  }, [platformAccounts, onHasLinksChange]);

  // تابع برای تبدیل نام پلتفرم به نوع platform
  const getPlatformFromName = (platformName: string): Platform => {
    const name = platformName.toLowerCase();
    if (name.includes('instagram')) return 'instagram';
    if (name.includes('facebook')) return 'facebook';
    if (name.includes('whatsapp')) return 'whatsapp';
    if (name.includes('telegram')) return 'telegram';
    if (name.includes('twitter')) return 'twitter';
    if (name.includes('website') || name.includes('وب')) return 'website';
    return 'website'; // پیش‌فرض
  };

  const handleOpenAddDrawer = () => {
    setNewPlatform("");
    setNewTitle("");
    setNewUrl("");
    setIsOpen(true);
  };

  const handleOpenEditDrawer = (account: PlatformAccount) => {
    setEditingAccount(account);
    setNewPlatform(account.platform_id.toString());
    setNewTitle(account.account_name);
    setNewUrl(account.account_identifier);
    setIsEditOpen(true);
  };

  const handleSubmitNewLink = async () => {
    if (!newPlatform || !newUrl) {
      // Minimal validation; prevent adding empty platform/url
      return;
    }
    
    try {
      await updatePlatforms({
        delete_account_ids: [],
        create_schemas: [{
          platform_id: parseInt(newPlatform),
          account_name: newTitle || "شبکه اجتماعی",
          account_identifier: newUrl,
          credentials: {},
          is_default: false,
          is_public: true
        }],
        update_schemas: []
      });
      
      console.log('پلتفرم اجتماعی با موفقیت اضافه شد');
      setIsOpen(false);
    } catch (error) {
      console.error('خطا در اضافه کردن پلتفرم:', error);
    }
  };

  const handleUpdatePlatform = async () => {
    if (!editingAccount || !newPlatform || !newUrl) {
      return;
    }
    
    try {
      await updatePlatforms({
        delete_account_ids: [],
        create_schemas: [],
        update_schemas: [{
          account_name: newTitle || "شبکه اجتماعی",
          account_identifier: newUrl,
          credentials: {},
          is_default: editingAccount.is_default,
          is_public: true
          // platform_id: parseInt(newPlatform)
        }]
      });
      
      console.log('پلتفرم اجتماعی با موفقیت به‌روزرسانی شد');
      setIsEditOpen(false);
    } catch (error) {
      console.error('خطا در به‌روزرسانی پلتفرم:', error);
    }
  };

  const handleRemove = useCallback(async (id: string) => {
    try {
      const accountId = parseInt(id);
      
      await updatePlatforms({
        delete_account_ids: [accountId],
        create_schemas: [],
        update_schemas: []
      });
      
      console.log('پلتفرم اجتماعی با موفقیت حذف شد');
    } catch (error) {
      console.error('خطا در حذف پلتفرم:', error);
    }
  }, [updatePlatforms]);



  const getPlatformIcon = (platform: Platform) => {
    switch (platform) {
      case "instagram":
        return Instagram;
      case "facebook":
        return Facebook;
      case "whatsapp":
        return Whatsapp;
      case "telegram":
        return TextBlock;
      case "twitter":
        return Xrp;
      case "website":
      default:
        return Global;
    }
  };

  // Get icon for platform by name (for fetched platforms)
  const getPlatformIconByName = (platformName: string) => {
    const nameMap: Record<string, React.ComponentType> = {
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

    if (!platformAccounts || platformAccounts.length === 0) {
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
            <Text textStyle="16S5" textColor="main-white" fontFamily="moraba">
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
          {platformAccounts.map((account) => {
            // Get the platform info from fetched platforms
            const fetchedPlatformInfo = fetchedPlatforms.find(
              (p) => p.platform_id === account.platform_id
            );
            const platformName = fetchedPlatformInfo?.platform_name || account.platform_name;
            const IconCmp = fetchedPlatformInfo
              ? getPlatformIconByName(fetchedPlatformInfo.platform_name)
              : getPlatformIcon(getPlatformFromName(account.platform_name));

            return (
              <QuadInfoCard
                key={account.account_id}
                data={{
                  topRight: (
                    <div
                      className={styles["personal-social-networks__item-top-right"]}
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
                      className={styles["personal-social-networks__item-actions"]}
                    >
                      <Trash
                        size={18}
                        color="var(--error-700)"
                        variant="Bulk"
                        onClick={() => handleRemove(account.account_id.toString())}
                      />
                      <Edit
                        size={18}
                        color="var(--primary-700)"
                        variant="Bulk"
                        onClick={() => handleOpenEditDrawer(account)}
                      />
                    </div>
                  ),
                  bottomRight: (
                    <Text textStyle="14S5" textColor="primary-700">
                      {account.account_identifier.length > 52
                        ? account.account_identifier.slice(0, 50) + "..."
                        : account.account_identifier}
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
  }, [platformAccounts, fetchedPlatforms, isLoadingPlatforms, handleRemove]);

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
            disabled={platformsUpdateLoading}
          >
            <Text textStyle="16S7" textColor="main-white" fontFamily="moraba">
              {platformsUpdateLoading ? "در حال ثبت..." : "ثبت"}
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
            disabled={platformsUpdateLoading}
          >
            <Text textStyle="16S7" textColor="main-white" fontFamily="moraba">
              {platformsUpdateLoading ? "در حال به‌روزرسانی..." : "به‌روزرسانی"}
            </Text>
          </Button>
        </div>
      </DrawerModal>
    </div>
  );
}
