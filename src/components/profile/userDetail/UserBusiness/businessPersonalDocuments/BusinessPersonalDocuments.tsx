import { useEffect, useMemo, useState, useCallback } from "react";
import Text from "@/components/ui/text/Text";
import styles from "./BusinessPersonalDocuments.module.scss";
import FileUpload from "@/components/ui/fileUpload/FileUpload";
import FileDownload from "@/components/ui/fileDownload/FileDownload";
import RadioButton from "@/components/ui/forms/radioButton/RadioButton";
import { BusinessDocument, UpdateDocumentsRequest } from "@/types/business";

type Role = "owner" | "representative";

type DocState = {
  file: File | null;
  url: string;
};

type BusinessPersonalDocumentsProps = {
  documents?: BusinessDocument[];
  loading: boolean;
  updateDocuments: (data: UpdateDocumentsRequest) => Promise<unknown>;
  documentsUpdateLoading: boolean;
  uploadFile: (file: File) => Promise<unknown>;
  fileUploadLoading: boolean;
};


export default function BusinessPersonalDocuments({
  documents,
  loading,
  updateDocuments,
  uploadFile,
}: BusinessPersonalDocumentsProps) {
  const [role, setRole] = useState<Role>("owner");

  const [officialGazette, setOfficialGazette] = useState<DocState>({
    file: null,
    url: "",
  });
  const [foundationNotice, setFoundationNotice] = useState<DocState>({
    file: null,
    url: "",
  });
  const [lastChangesNotice, setLastChangesNotice] = useState<DocState>({
    file: null,
    url: "",
  });

  const [introLetter, setIntroLetter] = useState<DocState>({
    file: null,
    url: "",
  });

  // تابع آپلود مدرک جدید (دو مرحله‌ای)
  const handleDocumentUpload = useCallback(async (
    file: File,
    docTypeId: number,
    docTitle: string
  ) => {
    try {
      // مرحله 1: آپلود فایل و دریافت file_uid
      console.log("شروع آپلود فایل...");
      const uploadResponse = await uploadFile(file) as { file_uid: string };
      console.log("فایل آپلود شد، file_uid:", uploadResponse.file_uid);

      // مرحله 2: ایجاد مدرک با file_uid دریافت شده
      await updateDocuments({
        delete_document_ids: [],
        create_schemas: [
          {
            doc_type_id: docTypeId,
            doc_uid: uploadResponse.file_uid, // استفاده از file_uid دریافت شده
            doc_title: docTitle,
            doc_note: "",
          },
        ],
        update_schemas: [],
      });

      console.log("مدرک با موفقیت ایجاد شد");
    } catch (error) {
      console.error("خطا در آپلود مدرک:", error);
    }
  }, [uploadFile, updateDocuments]);

  // Clean up all object URLs on unmount or file change
  useEffect(() => {
    return () => {
      [officialGazette, foundationNotice, lastChangesNotice, introLetter]
        .map((d) => d.url)
        .filter(Boolean)
        .forEach((u) => URL.revokeObjectURL(u));
    };
  }, [officialGazette, foundationNotice, lastChangesNotice, introLetter]);

  const commonUploadProps = useMemo(() => ({
    accept: ".pdf,.doc,.docx,.jpg,.jpeg,.png",
    fileFormat: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
    ],
    onFocus: () => {},
    onBlur: () => {},
    isFocused: false,
    isEditing: false,
  }), []);

  const renderUploadOrDownload = useCallback((
    doc: DocState,
    setDoc: (next: DocState) => void,
    label?: string
  ) => {
    if (doc.file && doc.url) {
      return (
        <FileDownload
          title={doc.file.name}
          fileName={doc.file.name}
          fileUrl={doc.url}
          showDelete
          onDelete={() => {
            URL.revokeObjectURL(doc.url);
            setDoc({ file: null, url: "" });
          }}
          width="100%"
          bgcColor="transparent"
        />
      );
    }

    return (
      <FileUpload
        label={label}
        value={null}
        onChange={(file) => {
          if (!file) return;
          const url = URL.createObjectURL(file);
          setDoc({ file, url });

          // آپلود مدرک به API
          handleDocumentUpload(file, 1, label || "مدرک جدید"); // docTypeId باید از API دریافت شود
        }}
        showException={{
          row1: { importIcon: true, importImage: false },
          row2: {
            text1: "کلیک کنید",
            text2: " یا مدرک خود را اینجا رها کنید",
          },
          row3: {
            beforeAddFile: true,
            afterAddFile: false,
            showLoadingAddFile: false,
            percentLoadingAddFile: -1,
          },
        }}
        {...commonUploadProps}
      />
    );
  }, [commonUploadProps, handleDocumentUpload]);

  const ownerContent = useMemo(() => {
    if (loading) {
      return (
        <div className={styles["personal-documents__loading"]}>
          <Text textStyle="14S5" textColor="gray-600">
            در حال بارگذاری مدارک...
          </Text>
        </div>
      );
    }

    if (documents && documents.length > 0) {
      const requiredDocuments = [
        { title: "مدرک روزنامه رسمی", docTypeId: 1 },
        { title: "مدرک آگهی تاسیس", docTypeId: 2 },
        { title: "مدرک آگهی آخرین تغییرات", docTypeId: 3 },
      ];

      return (
        <div className={styles["personal-documents__grid"]}>
          {/* نمایش مدارک موجود */}
          {documents.map((doc) => (
            <div key={doc.id} className={styles["personal-documents__item"]}>
              <Text
                textStyle="14S5"
                textColor="gray-800"
                fontFamily="moraba"
                textAlign="right"
              >
                {doc.doc_title || `مدرک ${doc.id}`}
              </Text>
              <FileDownload
                title={doc.doc_title || `مدرک ${doc.id}`}
                fileName={`${doc.doc_title}${doc.file_extension}`}
                fileUrl={`${process.env.NEXT_PUBLIC_API_URL}/sys/business/documents/${doc.doc_uid}`}
                showDelete={true}
                onDelete={async () => {
                  try {
                    await updateDocuments({
                      delete_document_ids: [doc.id],
                      create_schemas: [],
                      update_schemas: [],
                    });
                    console.log("مدرک با موفقیت حذف شد");
                  } catch (error) {
                    console.error("خطا در حذف مدرک:", error);
                  }
                }}
                width="100%"
                bgcColor="transparent"
              />
              <div
                className={styles["personal-documents__doc-info"]}
                style={{ display: "none" }}
              >
                <Text textStyle="12S4" textColor="gray-600">
                  نوع فایل: {doc.file_extension}
                </Text>
                <Text textStyle="12S4" textColor="gray-600">
                  حجم: {(doc.file_size / 1024).toFixed(1)} KB
                </Text>
                <Text textStyle="12S4" textColor="gray-600">
                  تاریخ ایجاد:{" "}
                  {new Date(doc.created_at).toLocaleDateString("fa-IR")}
                </Text>
                {doc.doc_note && (
                  <Text textStyle="12S4" textColor="gray-600">
                    یادداشت: {doc.doc_note}
                  </Text>
                )}
              </div>
            </div>
          ))}

          {/* نمایش FileUpload برای مدارک مفقود */}
          {documents.length < 3 &&
            requiredDocuments.slice(documents.length).map((reqDoc, index) => (
              <div
                key={`upload-${index}`}
                className={styles["personal-documents__item"]}
              >
                {/* <Text
                textStyle="14S5"
                textColor="gray-800"
                fontFamily="moraba"
                textAlign="right"
              >
                {reqDoc.title}
              </Text> */}
                <FileUpload
                  label={reqDoc.title}
                  value={null}
                  onChange={(file) => {
                    if (!file) return;
                    handleDocumentUpload(file, reqDoc.docTypeId, reqDoc.title);
                  }}
                  showException={{
                    row1: { importIcon: true, importImage: false },
                    row2: {
                      text1: "کلیک کنید",
                      text2: " یا مدرک خود را اینجا رها کنید",
                    },
                    row3: {
                      beforeAddFile: true,
                      afterAddFile: false,
                      showLoadingAddFile: false,
                      percentLoadingAddFile: -1,
                    },
                  }}
                  {...commonUploadProps}
                />
              </div>
            ))}
        </div>
      );
    }

    return (
      <div className={styles["personal-documents__grid"]}>
        <div className={styles["personal-documents__item"]}>
          <Text
            textStyle="14S5"
            textColor="gray-800"
            fontFamily="moraba"
            textAlign="right"
          >
            مدرک روزنامه رسمی
          </Text>
          {renderUploadOrDownload(officialGazette, setOfficialGazette)}
        </div>
        <div className={styles["personal-documents__item"]}>
          <Text
            textStyle="14S5"
            textColor="gray-800"
            fontFamily="moraba"
            textAlign="right"
          >
            مدرک آگهی تاسیس
          </Text>
          {renderUploadOrDownload(foundationNotice, setFoundationNotice)}
        </div>
        <div className={styles["personal-documents__item"]}>
          <Text
            textStyle="14S5"
            textColor="gray-800"
            fontFamily="moraba"
            textAlign="right"
          >
            مدرک آگهی آخرین تغییرات
          </Text>
          {renderUploadOrDownload(lastChangesNotice, setLastChangesNotice)}
        </div>
      </div>
    );
  }, [
    officialGazette,
    foundationNotice,
    lastChangesNotice,
    documents,
    loading,
    updateDocuments,
    commonUploadProps,
    handleDocumentUpload,
    renderUploadOrDownload,
  ]);

  const representativeContent = (
    <div className={styles["personal-documents__single"]}>
      <Text
        textStyle="14S5"
        textColor="gray-800"
        fontFamily="moraba"
        textAlign="right"
      >
        نامه معرفی یا سربرگ شرکت
      </Text>
      {renderUploadOrDownload(introLetter, setIntroLetter)}
    </div>
  );

  return (
    <div className={styles["personal-documents"]}>
      <RadioButton
        id="role-owner"
        name="business-role"
        mode="filled-circle"
        value="owner"
        checked={role === "owner"}
        onChangeAction={(e) => setRole(e.target.value as Role)}
        textDetails={{
          title: {
            text: "من صاحب امضا هستم",
            size: "14S5",
            color: "gray-900",
          },
        }}
      />
      {role === "owner" && (
        <div className={styles["personal-documents__owner-content"]}>
          {ownerContent}
        </div>
      )}
      <RadioButton
        id="role-representative"
        name="business-role"
        mode="filled-circle"
        value="representative"
        checked={role === "representative"}
        onChangeAction={(e) => setRole(e.target.value as Role)}
        textDetails={{
          title: {
            text: "نماینده نام‌اختیار شرکت هستم",
            size: "14S5",
            color: "gray-900",
          },
          subtitle: { text: "" },
        }}
      />
      {role !== "owner" && (
        <div className={styles["personal-documents__representative-content"]}>
          {representativeContent}
        </div>
      )}
    </div>
  );
}
