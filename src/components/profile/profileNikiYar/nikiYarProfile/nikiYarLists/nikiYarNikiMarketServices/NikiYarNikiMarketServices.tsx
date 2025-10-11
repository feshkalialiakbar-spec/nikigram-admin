import React, { useEffect, useMemo, useState } from "react";
import styles from "./NikiYarNikiMarketServices.module.scss";
import Text from "@/components/ui/text/Text";
import NikiYarIsVipTab from "../../../nikiYarComponents/nikiYarIsVipTab/NikiYarIsVipTab";
import NikiYarIsEmpty from "../../../nikiYarComponents/nikiYarIsEmpty/NikiYarIsEmpty";
import NikiYarProductsList from "../../../nikiYarComponents/nikiYarProductsList/NikiYarProductsList";
import { useRouter } from "next/router";
import Button from "@/components/ui/actions/button/Button";
import { AddCircle } from "iconsax-react";
import NikiYarCreateServices from "../../../nikiYarComponents/nikiYarCreateServices/NikiYarCreateServices";
import { useNikiYarProducts } from "@/hooks/useNikiYarProducts";
import { deactivateNikiYarProduct } from "@/services/api/nikiYarProduct";
import Modal from "@/components/ui/modal/Modal";
type TabType = "discount" | "vip";

export default function NikiYarNikiMarketServices() {
  const router = useRouter();
  const urlTab = router.query.servicetab as string as TabType | undefined;
  const [activeTab, setActiveTab] = useState<TabType>(urlTab ?? "discount");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editProductId, setEditProductId] = useState<number | undefined>();
  
  // States for delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [productToDelete, setProductToDelete] = useState<number | undefined>();
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [deleteError, setDeleteError] = useState<string>("");

  // استفاده از custom hook - API فقط یک بار فراخوانی می‌شود
  const {
    filteredItems: marketItems,
    vipItems,
    discountItems,
    loading,
    refresh: refreshProducts,
  } = useNikiYarProducts({
    deliveryMethod: "2", // فقط سرویس‌های نیکی مارکت
    autoRefresh: true,
  });
  const handleTabClick = (tab: string) => {
    const nextTab = tab as TabType;
    setActiveTab(nextTab);
    // تغییر URL فقط برای navigation - بدون API call اضافی
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, servicetab: nextTab },
      },
      undefined,
      { shallow: true }
    );
  };

  // محصولات فیلتر شده بر اساس تب فعال - بدون API call اضافی
  const filteredMarketItems = useMemo(() => 
    activeTab === "vip" ? vipItems : discountItems,
    [activeTab, vipItems, discountItems]
  );

  useEffect(() => {
    if (urlTab) return;
    if (marketItems.length > 0) {
      const hasVip = marketItems.some((i) => i.category_is_vip);
      const initial = hasVip ? "vip" : "discount";
      setActiveTab(initial);
      router.replace(
        {
          pathname: router.pathname,
          query: { ...router.query, servicetab: initial },
        },
        undefined,
        { shallow: true }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marketItems]);

  const handleEditProduct = (productId: number) => {
    setEditProductId(productId);
    setEditMode(true);
    setIsOpen(true);
  };

  const handleDeleteProduct = (productId: number) => {
    setProductToDelete(productId);
    setShowDeleteModal(true);
    setDeleteError("");
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    
    setIsDeleting(true);
    setDeleteError("");
    
    try {
      await deactivateNikiYarProduct(productToDelete);
      console.log("Product deactivated successfully:", productToDelete);
      
      // Refresh the products list
      refreshProducts();
      
      // Close modal
      setShowDeleteModal(false);
      setProductToDelete(undefined);
    } catch (error) {
      console.error("Error deactivating product:", error);
      setDeleteError("خطا در حذف محصول. لطفاً مجدداً تلاش کنید.");
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setProductToDelete(undefined);
    setDeleteError("");
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setEditMode(false);
    setEditProductId(undefined);
  };

  // refreshProducts حالا از custom hook می‌آید
  return (
    <div className={styles["niki-yar-niki-market-services"]}>
      <h1>خدمات نیکی مارکت</h1>

      <NikiYarIsVipTab onTabChange={handleTabClick} value={activeTab} />

      <div className={styles["niki-yar-niki-market-services__content"]}>
        {loading ? (
          <Text textStyle="14S5" textColor="primary-600">
            در حال بارگذاری...
          </Text>
        ) : marketItems.length === 0 ? (
          <NikiYarIsEmpty />
        ) : filteredMarketItems.length === 0 ? (
          <NikiYarIsEmpty />
        ) : (
          <div
            className={styles["niki-yar-niki-market-services__button-wrapper"]}
          >
            <Button
              paddingStyle="avg-8-32"
              bgColor="primary-700"
              borderColor="primary-700"
              mode="side-rounded"
            >
              <div
                className={styles["niki-yar-niki-market-services__button"]}
                onClick={() => {
                  setIsOpen(true);
                }}
              >
                <AddCircle size={24} color="var(--main-white)" variant="Bulk" />
                <Text
                  textStyle="16S5"
                  textColor="main-white"
                  fontFamily="moraba"
                >
                  ایجاد سرویس / خدمت
                </Text>
              </div>
            </Button>
            <NikiYarProductsList 
              items={filteredMarketItems} 
              mode={activeTab}
              onEditProduct={handleEditProduct}
              onDeleteProduct={handleDeleteProduct}
            />
          </div>
        )}
      </div>
      {/* Create/Edit Modal */}
      {isOpen && (
        <NikiYarCreateServices
          isOpen={isOpen}
          onClose={handleCloseModal}
          serviceType={activeTab}
          editMode={editMode}
          editProductId={editProductId}
          onProductUpdated={refreshProducts}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={cancelDelete}
        title="حذف محصول"
        body={
          <div style={{ padding: "16px 0" }}>
            <Text textStyle="16S5" textColor="gray-700" textAlign="center">
              آیا از حذف این محصول اطمینان دارید؟
            </Text>
            <br />
            <Text textStyle="14S4" textColor="gray-600" textAlign="center">
              این عمل قابل بازگشت نیست.
            </Text>
            {deleteError && (
              <div style={{ marginTop: "12px" }}>
                <Text textStyle="14S5" textColor="error-700" textAlign="center">
                  {deleteError}
                </Text>
              </div>
            )}
          </div>
        }
        footer={
          <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
            <Button
              bgColor="transparent"
              borderColor="gray-300"
              onClick={cancelDelete}
              disabled={isDeleting}
              paddingStyle="avg-8-24"
            >
              <Text textStyle="14S5" textColor="gray-700">
                لغو
              </Text>
            </Button>
            <Button
              bgColor="error-700"
              onClick={confirmDelete}
              disabled={isDeleting}
              paddingStyle="avg-8-24"
            >
              <Text textStyle="14S5" textColor="main-white">
                {isDeleting ? "در حال حذف..." : "حذف"}
              </Text>
            </Button>
          </div>
        }
      />
    </div>
  );
}
