import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Text from "@/components/ui/text/Text";
import styles from "./PersonalDocuments.module.scss";
import FileUpload from "@/components/ui/fileUpload/FileUpload";
import FileDownload from "@/components/ui/fileDownload/FileDownload";
import Badge from "@/components/ui/badge/Badge";
import DrawerModal from "@/components/ui/modal/drawerModal/DrawerModal";
import Dropdown from "@/components/ui/forms/dropdown/Dropdown";
import TextField from "@/components/ui/forms/textField/TextField";
import Button from "@/components/ui/actions/button/Button";
import {
  Document,
  CreateDocumentSchema,
  UpdateDocumentSchema,
} from "@/dtos/auth.dto";
import { getImageUrl } from "@/utils/imageUtils";
import { updateDocuments } from "@/services/api/auth";
import { uploadFile } from "@/services/api/files/files";
import { getDocumentCategories } from "@/services/api/categories";
import { Category } from "@/dtos/categories.dto";
import {
  addDocument,
  updateDocument,
  removeDocument,
} from "@/stores/userStores/user/user.slice";
import { addToast } from "@/stores/ui/toast.slice";

type UploadedFile = {
  file: File;
  url: string;
  status: "pending" | "approved" | "rejected";
};

// Document categories will be fetched from API

export default function PersonalDocuments() {
  const documents = useSelector((state: { user: { documents: Document[] } }) => state.user.documents);
  const dispatch = useDispatch();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editFileName, setEditFileName] = useState("");

  // New modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newDocumentCategory, setNewDocumentCategory] = useState("");
  const [newDocumentTitle, setNewDocumentTitle] = useState("");
  const [newDocumentFile, setNewDocumentFile] = useState<File | null>(null);

  // Categories state
  const [documentCategories, setDocumentCategories] = useState<
    { label: string; value: string }[]
  >([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      uploadedFiles.forEach((item) => URL.revokeObjectURL(item.url));
    };
  }, [uploadedFiles]);

    // Fetch document categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log("🔄 شروع دریافت دسته‌بندی‌ها...");
        setIsLoadingCategories(true);
        
        const response = await getDocumentCategories();
        
        console.log("📡 پاسخ API دریافت شد:", response);
        console.log("📊 نوع پاسخ:", typeof response);
        console.log("🔍 آیا پاسخ آرایه است؟", Array.isArray(response));
        
        if (response && typeof response === 'object') {
          console.log("📋 کلیدهای پاسخ:", Object.keys(response));
          console.log("📄 response.status:", response.status);
          console.log("📄 response.data:", response.data);
          console.log("📄 response.message:", response.message);
          console.log("🔍 آیا response.data آرایه است؟", Array.isArray(response.data));
        }
        
        // Handle both response formats
        let categoriesData: Category[] = [];
        
        if (response.status === 1 && response.data) {
          console.log("✅ حالت 1: response.status === 1 و response.data موجود است");
          categoriesData = response.data;
        } else if (Array.isArray(response)) {
          console.log("✅ حالت 2: پاسخ مستقیماً آرایه است");
          categoriesData = response;
        } else if (response && response.data && Array.isArray(response.data)) {
          console.log("✅ حالت 3: response.data آرایه است");
          categoriesData = response.data;
        } else {
          console.log("❌ هیچ حالتی مطابقت ندارد");
          console.log("📊 response:", response);
          console.log("📊 response.status:", response?.status);
          console.log("📊 response.data:", response?.data);
        }
        
        console.log("🎯 داده‌های دسته‌بندی برای پردازش:", categoriesData);
        console.log("📏 تعداد دسته‌بندی‌ها:", categoriesData.length);
        
        if (categoriesData.length > 0) {
          console.log("🔄 شروع تبدیل داده‌ها...");
          
          // Transform API response to dropdown format
          const categories = categoriesData.map((category: Category, index: number) => {
            console.log(`📝 پردازش دسته‌بندی ${index + 1}:`, category);
            
            // Find Persian translation (fa)
            const persianTranslation = category.translations?.find(
              (translation) => translation.LAN_ID === "fa"
            );
            
            console.log(`🌐 ترجمه فارسی یافت شده:`, persianTranslation);
            
            const categoryItem = {
              label:
                persianTranslation?.title ||
                category.ctype_desc ||
                `Category ${category.id}`,
              value: category.id.toString(),
            };
            
            console.log(`✅ آیتم دسته‌بندی ${index + 1}:`, categoryItem);
            return categoryItem;
          });
          
          console.log("🎉 آرایه نهایی دسته‌بندی‌ها:", categories);
          console.log("📏 تعداد آیتم‌های نهایی:", categories.length);
          
          setDocumentCategories(categories);
          console.log("💾 دسته‌بندی‌ها در state ذخیره شدند");
        } else {
          console.log("⚠️ هیچ داده‌ای برای دسته‌بندی‌ها یافت نشد");
          console.log("📊 پاسخ کامل:", response);
          
          // Temporary fallback for testing
          const fallbackCategories = [
            { label: "مدرک شناسایی", value: "1" },
            { label: "مدرک تحصیلی", value: "2" },
            { label: "مدرک شغلی", value: "3" },
          ];
          console.log("🔄 استفاده از دسته‌بندی‌های پیش‌فرض:", fallbackCategories);
          setDocumentCategories(fallbackCategories);
        }
      } catch (error) {
        console.error("💥 خطا در دریافت دسته‌بندی‌ها:", error);
        if (error instanceof Error) {
          console.error("📊 جزئیات خطا:", {
            name: error.name,
            message: error.message,
            stack: error.stack
          });
        }
        
        dispatch(
          addToast({
            text: "خطا در بارگذاری دسته بندی‌ها",
            closable: true,
            duration: 3000,
          })
        );
      } finally {
        setIsLoadingCategories(false);
        console.log("🏁 دریافت دسته‌بندی‌ها تمام شد");
      }
    };

    console.log("🚀 useEffect برای دریافت دسته‌بندی‌ها اجرا شد");
    fetchCategories();
  }, [dispatch]);


  const handleDeleteAtIndex = (indexToRemove: number) => {
    setUploadedFiles((prev) => {
      const next = [...prev];
      const [removed] = next.splice(indexToRemove, 1);
      if (removed) URL.revokeObjectURL(removed.url);
      return next;
    });
  };

  const handleOpenEditDocument = (document: Document) => {
    setEditingDocument(document);
    setEditFileName(document.file_name);
    setIsEditOpen(true);
  };

  const handleUpdateDocument = async () => {
    if (!editingDocument || !editFileName.trim()) {
      return;
    }

    try {
      setIsLoading(true);

      const updateSchema: UpdateDocumentSchema = {
        document_id: editingDocument.document_id,
        document_type: editingDocument.document_type,
        file_name: editFileName.trim(),
      };

      const response = await updateDocuments({
        delete_document_ids: [],
        create_schemas: [],
        update_schemas: [updateSchema],
      });

      if (response.status === 1) {
        dispatch(
          addToast({
            text: "مدرک با موفقیت بروزرسانی شد",
            closable: true,
            duration: 3000,
          })
        );
        // Update the document in the store
        const updatedDocument: Document = {
          ...editingDocument,
          file_name: editFileName.trim(),
        };
        dispatch(updateDocument(updatedDocument));
        setIsEditOpen(false);
      }
    } catch (error) {
      console.error("Error updating document:", error);
      dispatch(
        addToast({
          text: "خطا در بروزرسانی مدرک",
          closable: true,
          duration: 3000,
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteDocument = async (document: Document) => {
    try {
      setIsLoading(true);

      const response = await updateDocuments({
        delete_document_ids: [document.document_id],
        create_schemas: [],
        update_schemas: [],
      });

      if (response.status === 1) {
        dispatch(
          addToast({
            text: "مدرک با موفقیت حذف شد",
            closable: true,
            duration: 3000,
          })
        );
        // Remove the document from the store
        dispatch(removeDocument(document.document_id));
      }
    } catch (error) {
      console.error("Error deleting document:", error);
      dispatch(
        addToast({ text: "خطا در حذف مدرک", closable: true, duration: 3000 })
      );
    } finally {
      setIsLoading(false);
    }
  };


  // New modal handlers
  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
    setNewDocumentCategory("");
    setNewDocumentTitle("");
    setNewDocumentFile(null);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setNewDocumentCategory("");
    setNewDocumentTitle("");
    setNewDocumentFile(null);
  };

  const handleSubmitNewDocument = async () => {
    if (!newDocumentCategory || !newDocumentTitle.trim() || !newDocumentFile) {
      dispatch(
        addToast({
          text: "لطفاً تمام فیلدها را پر کنید",
          closable: true,
          duration: 3000,
        })
      );
      return;
    }

    try {
      setIsLoading(true);

      // 1) Upload the file to get file_uid
      const uploadResponse = await uploadFile({ file: newDocumentFile });

      // 2) Build schema with actual file_uid
      const createSchema: CreateDocumentSchema = {
        document_type: parseInt(newDocumentCategory),
        file_name: newDocumentTitle.trim(),
        file_uid: uploadResponse.file_uid,
      };

      // 3) Call PATCH /profile/documents
      const response = await updateDocuments({
        delete_document_ids: [],
        create_schemas: [createSchema],
        update_schemas: [],
      });

      if (response.status === 1) {
        dispatch(
          addToast({
            text: "مدرک با موفقیت اضافه شد",
            closable: true,
            duration: 3000,
          })
        );

        // Add the new document to the store
        const newDocument: Document = {
          status: null,
          message: null,
          document_id: Date.now(), // Temporary ID, should come from API response
          document_type: parseInt(newDocumentCategory),
          is_verified: 0,
          status_id: 1,
          file_uid: createSchema.file_uid,
          file_name: newDocumentTitle.trim(),
          file_size: newDocumentFile.size,
          file_extension: `.${newDocumentFile.name.split(".").pop()}`,
        };
        dispatch(addDocument(newDocument));

        handleCloseAddModal();
      }
    } catch (error) {
      console.error("Error adding document:", error);
      dispatch(
        addToast({
          text: "خطا در اضافه کردن مدرک",
          closable: true,
          duration: 3000,
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderStatusBadge = (status: UploadedFile["status"] | number) => {
    // Handle API document status (0: inactive, 1: active)
    if (typeof status === "number") {
      switch (status) {
        case 1:
          return (
            <Badge size="sm" bgc="secondary1-100" color="secondary1-700">
              فعال
            </Badge>
          );
        case 0:
          return (
            <Badge size="sm" bgc="error-100" color="error-700">
              غیرفعال
            </Badge>
          );
        default:
          return (
            <Badge size="sm" bgc="secondary2-100" color="secondary2-700">
              نامشخص
            </Badge>
          );
      }
    }

    // Handle local uploaded files status
    switch (status) {
      case "approved":
        return (
          <Badge size="sm" bgc="secondary1-100" color="secondary1-700">
            تایید شده
          </Badge>
        );
      case "rejected":
        return (
          <Badge size="sm" bgc="error-100" color="error-700">
            رد شده
          </Badge>
        );
      case "pending":
      default:
        return (
          <Badge size="sm" bgc="secondary2-100" color="secondary2-700">
            در انتظار تایید
          </Badge>
        );
    }
  };

  const renderApiDocuments = () => {
    return documents.map((doc: Document) => (
      <div
        key={doc.document_id}
        className={styles["personal-documents__files-item"]}
      >
        <div className={styles["personal-documents__file-header"]}>
          {renderStatusBadge(doc.status_id)}
          <div className={styles["personal-documents__file-actions"]}>
            <button
              onClick={() => handleOpenEditDocument(doc)}
              className={styles["personal-documents__action-btn"]}
              disabled={isLoading}
            >
              ویرایش
            </button>
            <button
              onClick={() => handleDeleteDocument(doc)}
              className={styles["personal-documents__action-btn"]}
              disabled={isLoading}
            >
              حذف
            </button>
          </div>
        </div>
        <FileDownload
          fileName={`${doc.file_name}${doc.file_extension}`}
          fileUrl={getImageUrl(doc.file_uid)}
          bgcColor="transparent"
          showDelete={false}
          width="100%"
        />
      </div>
    ));
  };

  const renderLocalUploads = () => {
    return uploadedFiles.map((item, index) => (
      <div
        key={`${item.file.name}-${index}`}
        className={styles["personal-documents__files-item"]}
      >
        {renderStatusBadge(item.status)}
        <FileDownload
          fileName={item.file.name}
          fileUrl={item.url}
          bgcColor="transparent"
          showDelete={true}
          onDelete={() => handleDeleteAtIndex(index)}
          width="100%"
        />
      </div>
    ));
  };

  const totalFiles = documents.length + uploadedFiles.length;

  return (
    <div className={styles["personal-documents"]}>
      <Text textStyle="16S5" textColor="gray-800">
        مدرک شناسایی
      </Text>

      {/* API Documents */}
      {documents.length > 0 && (
        <div className={styles["personal-documents__files"]}>
          {renderApiDocuments()}
        </div>
      )}

      {/* Local Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className={styles["personal-documents__files"]}>
          {renderLocalUploads()}
        </div>
      )}

      {totalFiles < 5 && (
        <div className={styles["personal-documents__add-section"]}>
          <Button
            bgColor="primary-700"
            mode="side-rounded"
            paddingStyle="avg-8-24"
            shadow="primary-800"
            onClick={handleOpenAddModal}
            disabled={isLoading}
          >
            <Text textStyle="16S7" textColor="main-white" fontFamily="moraba">
              افزودن مدرک جدید
            </Text>
          </Button>
        </div>
      )}

      {/* Edit Document Modal */}
      {isEditOpen && (
        <div className={styles["personal-documents__modal-overlay"]}>
          <div className={styles["personal-documents__modal"]}>
            <div className={styles["personal-documents__modal-header"]}>
              <Text textStyle="16S7" textColor="gray-950" fontFamily="moraba">
                ویرایش نام مدرک
              </Text>
            </div>

            <div className={styles["personal-documents__modal-content"]}>
              <input
                type="text"
                value={editFileName}
                onChange={(e) => setEditFileName(e.target.value)}
                placeholder="نام مدرک"
                className={styles["personal-documents__edit-input"]}
                disabled={isLoading}
              />
            </div>

            <div className={styles["personal-documents__modal-actions"]}>
              <button
                onClick={() => setIsEditOpen(false)}
                className={styles["personal-documents__modal-btn"]}
                disabled={isLoading}
              >
                انصراف
              </button>
              <button
                onClick={handleUpdateDocument}
                className={styles["personal-documents__modal-btn"]}
                disabled={isLoading}
              >
                {isLoading ? "در حال بروزرسانی..." : "بروزرسانی"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Document Modal */}
      <DrawerModal isOpen={isAddModalOpen} setIsOpen={setIsAddModalOpen}>
        <div className={styles["personal-documents__drawer"]}>
          <div className={styles["personal-documents__drawer-top"]}>
            <Text
              textStyle="16S7"
              textColor="gray-950"
              textAlign="right"
              fontFamily="moraba"
            >
              افزودن مدرک جدید
            </Text>

            <div className={styles["personal-documents__drawer-field"]}>
              <Dropdown
                label="دسته بندی"
                placeholder={
                  isLoadingCategories
                    ? "در حال بارگذاری..."
                    : "انتخاب دسته بندی"
                }
                value={newDocumentCategory}
                onChangeAction={(val) => setNewDocumentCategory(val)}
                options={documentCategories}
                size="sm"
                disabled={
                  isLoadingCategories || documentCategories.length === 0
                }
                baseColor={{
                  borderAndLabel: "gray-200",
                  inputBgColor: "main-white",
                  textInput: "gray-950",
                }}
              />
              {documentCategories.length === 0 && !isLoadingCategories && (
                <Text textStyle="12S4" textColor="error-600" textAlign="right">
                  دسته بندی‌ای یافت نشد
                </Text>
              )}
            </div>

            <div className={styles["personal-documents__drawer-field"]}>
              <TextField
                label="عنوان"
                placeholder="عنوان مدرک"
                value={newDocumentTitle}
                baseColor={{
                  borderAndLabel: "gray-200",
                  inputBgColor: "main-white",
                  textInput: "gray-950",
                }}
                maxLength={50}
                onChangeAction={(val) => setNewDocumentTitle(val)}
                size="sm"
              />
            </div>

            <div className={styles["personal-documents__drawer-field"]}>
              {!newDocumentFile ? (
                <FileUpload
                  label="انتخاب فایل"
                  value={null}
                  onChange={(file) => setNewDocumentFile(file)}
                  onFocus={() => {}}
                  onBlur={() => {}}
                  isFocused={false}
                  isEditing={false}
                  accept={".pdf,.doc,.docx,.jpg,.jpeg,.png"}
                  fileFormat={[
                    "application/pdf",
                    "application/msword",
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    "image/jpeg",
                    "image/png",
                  ]}
                  showException={{
                    row1: { importIcon: true, importImage: false },
                    row2: { text1: "انتخاب فایل", text2: "حداکثر 2MB" },
                    row3: {
                      beforeAddFile: true,
                      afterAddFile: false,
                      showLoadingAddFile: false,
                      percentLoadingAddFile: -1,
                    },
                  }}
                />
              ) : (
                <div className={styles["personal-documents__file-preview"]}>
                  <div
                    className={styles["personal-documents__file-preview-label"]}
                  >
                    <Text textStyle="14S5" textColor="gray-700">
                      فایل انتخاب شده:
                    </Text>
                  </div>
                  <FileDownload
                    fileName={newDocumentFile.name}
                    fileUrl={URL.createObjectURL(newDocumentFile)}
                    bgcColor="transparent"
                    showDelete={true}
                    onDelete={() => setNewDocumentFile(null)}
                    width="100%"
                  />
                </div>
              )}
            </div>
          </div>

          <Button
            bgColor="primary-700"
            mode="side-rounded"
            paddingStyle="avg-8-24"
            shadow="primary-800"
            onClick={handleSubmitNewDocument}
            disabled={isLoading}
          >
            <Text textStyle="16S7" textColor="main-white" fontFamily="moraba">
              {isLoading ? "در حال ثبت..." : "ثبت"}
            </Text>
          </Button>
        </div>
      </DrawerModal>
    </div>
  );
}
