import React, { useRef, useState } from "react";
import Button from "@/components/ui/actions/button/Button";
import Text from "../text/Text";
import { TagUser, Import, Trash } from "iconsax-react";
import { IconProps } from "../forms/textField/TextField";
import styles from "./FileUpload.module.scss";
import FileStyle from "@/components/global/fileStyle/FileStyle";
import { uploadFile } from "@/services/file";

export interface FileUploadResult {
  file_uid: string;
  name: string;
  size: number;
  type: string;
}

interface FileUploadProps {
  label?: string;
  value: File | null;
  onChange: (file: File | null, meta?: FileUploadResult) => void;
  onFocus: () => void;
  onBlur: () => void;
  error?: string;
  isFocused: boolean;
  isEditing: boolean;
  accept?: string;
  allowedExtensions?: string[]; // پسوندهای مجاز - مثل: ['.jpg', '.png', '.pdf']
  errorIcon?: IconProps;
  minFileSize?: number; // بایت - پیش‌فرض 5KB
  maxFileSize?: number; // بایت - پیش‌فرض 5MB
  entityType?: string; // نوع انتیتی برای آپلود
  showException?: {
    row1?: {
      importIcon?: boolean;
      importImage?: boolean;
    };
    row2?: {
      text1?: string;
      text2?: string;
    };
    row3?: {
      beforeAddFile?: string | boolean;
      afterAddFile?: string | boolean;
      showLoadingAddFile?: boolean;
      percentLoadingAddFile?: number;
    };
  };
}

export default function FileUpload({
  label,
  value,
  onChange,
  onFocus,
  onBlur,
  accept,
  error,
  allowedExtensions,
  minFileSize = 5 * 1024, // پیش‌فرض: 5KB
  maxFileSize = 5 * 1024 * 1024, // پیش‌فرض: 5MB
  entityType = "project-request",
  showException = {
    row1: {
      importIcon: true,
      importImage: false,
    },
    row2: {
      text1: "",
      text2: "",
    },
    row3: {
      beforeAddFile: true,
      afterAddFile: true,
      showLoadingAddFile: false,
      percentLoadingAddFile: -1,
    },
  },
  errorIcon = {
    Icon: TagUser,
    iconColor: "var(--error-900)",
    iconSize: "16",
    variant: "Bulk",
  },
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [sizeError, setSizeError] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);

  // خواندن مقدار یک کوکی از مرورگر
  const getCookie = (name: string): string | null => {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([.$?*|{}()\[\]\\\/\+^])/g, "\\$1") + "=([^;]*)"));
    return match ? decodeURIComponent(match[1]) : null;
  };

  // ست کردن کوکی در مرورگر
  const setCookie = (name: string, value: string, options: { path?: string; maxAge?: number } = {}) => {
    if (typeof document === "undefined") return;
    const opts = { path: "/", ...options };
    let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);
    if (opts.maxAge && Number.isFinite(opts.maxAge)) {
      updatedCookie += "; max-age=" + String(opts.maxAge);
    }
    if (opts.path) {
      updatedCookie += "; path=" + opts.path;
    }
    document.cookie = updatedCookie;
  };

  // فراخوانی API آپلود و ذخیره‌سازی اطلاعات در کوکی
  const uploadFileToServer = async (file: File): Promise<FileUploadResult | undefined> => {
    try {
      // خواندن توکن از کوکی‌های کلاینت
      const accessToken = getCookie("34a435y6546pr656rj67gm789peua677689awe890rguy987e89r69gr890rtk6mg5ps447e");

      const uploadResult = await uploadFile({
        file,
        entityType: entityType || "project-request",
        accessToken,
      });

      const meta: FileUploadResult = {
        file_uid: uploadResult.file_uid,
        name: uploadResult.name,
        size: uploadResult.size,
        type: uploadResult.type,
      };

      const cookieKey = "uploaded_files";
      const existing = getCookie(cookieKey);
      let items: Array<{ file_uid?: string; name: string; size: number; type: string }> = [];
      if (existing) {
        try {
          const parsed = JSON.parse(existing);
          if (Array.isArray(parsed)) items = parsed;
        } catch { }
      }
      items = [...items, meta];
      setCookie(cookieKey, JSON.stringify(items), { path: "/", maxAge: 60 * 60 * 24 * 30 }); // 30 روز
      return meta;
    } catch {
      // در خطا هم رفتار اپ پابرجا می‌ماند و فقط آپلود شکست می‌خورد
      // عمداً لاگ نهایی در کلاینت زده نمی‌شود تا UI بهم نخورد
      return undefined;
    }
  };

  // تبدیل بایت به فرمت قابل خواندن
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) {
      return `${bytes} بایت`;
    } else if (bytes < 1024 * 1024) {
      return `${Math.round(bytes / 1024)} کیلوبایت`;
    } else {
      return `${Math.round(bytes / (1024 * 1024))} مگابایت`;
    }
  };

  // دریافت پسوند فایل
  const getFileExtension = (fileName: string): string => {
    const lastDot = fileName.lastIndexOf(".");
    if (lastDot === -1) return "";
    return fileName.substring(lastDot).toLowerCase();
  };

  // چک کردن پسوند فایل
  const isValidExtension = (fileName: string): boolean => {
    if (!allowedExtensions || allowedExtensions.length === 0) return true;

    const fileExt = getFileExtension(fileName);
    return allowedExtensions.some(ext => {
      const normalizedExt = ext.toLowerCase().startsWith('.') ? ext.toLowerCase() : `.${ext.toLowerCase()}`;
      return fileExt === normalizedExt;
    });
  };

  const resetInput = () => {
    if (inputRef.current) inputRef.current.value = "";
  };

  const validateAndSetFile = async (file: File) => {
    // چک کردن پسوند فایل
    if (allowedExtensions && !isValidExtension(file.name)) {
      const extensionsList = allowedExtensions.map(ext => ext.toUpperCase()).join(", ");
      setSizeError(`فقط فایل‌های ${extensionsList} مجاز هستند`);
      onChange(null);
      resetInput();
      return;
    }

    // چک کردن حداکثر حجم فایل
    if (file.size > maxFileSize) {
      setSizeError(`حجم فایل نباید بیشتر از ${formatFileSize(maxFileSize)} باشد`);
      onChange(null);
      resetInput();
      return;
    }

    // چک کردن حداقل حجم فایل
    if (file.size < minFileSize) {
      setSizeError(`حجم فایل نباید کمتر از ${formatFileSize(minFileSize)} باشد`);
      onChange(null);
      resetInput();
      return;
    }

    // فایل معتبر است
    setSizeError("");
    // آپلود خودکار به محض انتخاب فایل
    const meta = await uploadFileToServer(file);
    onChange(file, meta);
    resetInput();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    void validateAndSetFile(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    void validateAndSetFile(file);
  };

  return (
    <div className={styles["file-upload"]}>
      {label && (
        <Text
          textStyle="14S5"
          textColor="gray-600"
          fontFamily="moraba"
          textAlign="right"
        >
          {label}
        </Text>
      )}

      <div
        className={`${styles["file-upload__actions-wrapper"]} ${isDragging ? styles["file-upload__actions--drag"] : ""}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          id="file-upload"
          type="file"
          accept={accept}
          style={{ display: "none" }}
          onChange={handleFileChange}
          onFocus={onFocus}
          onBlur={onBlur}
        />

        {/* Row 1 */}
        <div className={styles["file-upload__actions-row1-wrapper"]}>
          {!showException?.row1?.importImage && (
            <Import color="var(--gray-700)" size={24} variant="Bulk" />
          )}
          {showException?.row1?.importImage &&
            !showException?.row1?.importIcon && (
              <div className={styles["file-upload__actions-row1-image-wrapper"]}>
                <FileStyle file={value} />
              </div>
            )}
        </div>

        {/* Row 2 */}
        {(showException?.row2?.text1 || showException?.row2?.text2) && (
          <div className={styles["file-upload__actions-row2-wrapper"]}>
            {showException?.row2?.text1 && (
              <Text textStyle="14S5" textColor="primary-700">
                {showException?.row2?.text1}
              </Text>
            )}
            {showException?.row2?.text2 && (
              <Text textStyle="14S4" textColor="gray-950">
                {showException?.row2?.text2}
              </Text>
            )}
          </div>
        )}

        {/* Row 3 */}
        {(showException?.row3?.beforeAddFile ||
          showException?.row3?.afterAddFile ||
          showException?.row3?.showLoadingAddFile) && (
            <div className={styles["file-upload__actions-row3-wrapper"]}>
              {showException?.row3?.beforeAddFile ||
                showException?.row3?.afterAddFile ? (
                <Text
                  textTag="span"
                  textStyle="12S4"
                  textColor={value ? "gray-950" : "gray-400"}
                >
                  {value
                    ? value.name
                    : showException?.row3?.beforeAddFile === true &&
                    "PDF, DOC, DOCX | 2MB max."}
                  {showException?.row3?.afterAddFile}
                </Text>
              ) : (
                showException?.row3?.showLoadingAddFile && (
                  <div className={styles["file-upload__actions-row3-loading-wrapper"]}>
                    <div className={styles["file-upload__actions-row3-loading-full-width"]}>
                      {showException?.row3?.percentLoadingAddFile &&
                        showException?.row3?.percentLoadingAddFile > -1 && (
                          <div
                            className={styles["file-upload__actions-row3-loading-loaded-width"]}
                            style={{
                              width:
                                showException?.row3?.percentLoadingAddFile >= 0 &&
                                  showException?.row3?.percentLoadingAddFile <= 100
                                  ? `${showException?.row3?.percentLoadingAddFile}%`
                                  : "0%",
                            }}
                          />
                        )}
                    </div>
                  </div>
                )
              )}
            </div>
          )}

        {/* Row 4 */}
        {(showException?.row3?.afterAddFile ||
          (showException?.row3?.percentLoadingAddFile &&
            showException?.row3?.percentLoadingAddFile >= 0)) && (
            <div className={styles["file-upload__actions-row4-wrapper"]}>
              {showException?.row3?.percentLoadingAddFile &&
                showException?.row3?.percentLoadingAddFile >= 0 && (
                  <div className={styles["file-upload__actions-row4-loading-add"]}>
                    <Text textStyle="12S4" textColor="gray-950">
                      {showException?.row3?.percentLoadingAddFile}% تکمیل شده است
                    </Text>
                  </div>
                )}
              {showException?.row3?.afterAddFile && (
                <Button>
                  <div className={styles["file-upload__actions-row4-after-add"]}>
                    <Trash color="var(--error-700)" size={20} variant="Bulk" />
                    <Text textStyle="10S5" textColor="error-700">
                      پاک کردن فایل
                    </Text>
                  </div>
                </Button>
              )}
            </div>
          )}
      </div>
      {/* Error */}
      {(error || sizeError) && (
        <div className={styles["file-upload__actions-helper"]}>
          {errorIcon?.Icon && (
            <errorIcon.Icon
              size={errorIcon.iconSize || "16"}
              color={errorIcon.iconColor || "#999"}
              variant={errorIcon.variant || "Linear"}
            />
          )}
          <Text
            textTag="span"
            textStyle="10S4"
            textColor="main-black"
            wrap="wrap"
            fontFamily="moraba"
            textAlign="right"
          >
            {sizeError || error}
          </Text>
        </div>
      )}
    </div>
  );
}