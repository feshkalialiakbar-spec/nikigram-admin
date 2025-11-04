import React from "react";
import styles from "./FileDownload.module.scss";
import Text, { Colors } from "@/components/ui/text/Text";
import { Eye, Import, Trash } from "iconsax-react";
import FileStyle from "@/components/global/fileStyle/FileStyle";
import Image from "next/image";

interface FileDownloadProps {
  title?: string;
  fileName: string;
  fileUrl: string;
  size?: string;
  date?: string
  onDownload?: () => void;
  showDelete?: boolean;
  onDelete?: () => void;
  bgcColor?: Colors;
  width?: string;
}

export default function FileDownload({
  title,
  fileName,
  fileUrl,
  size,
  date,
  onDownload,
  showDelete = false,
  onDelete,
  bgcColor,
  width,
}: FileDownloadProps) {
  // Persian Jalali + humanized formatter based on `date` prop
  const formatPersianHumanDate = React.useCallback((isoDate?: string): string => {
    if (!isoDate) return "";
    const input = new Date(isoDate);
    if (isNaN(input.getTime())) return "";

    const now = new Date();
    const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const d1 = startOfDay(now).getTime();
    const d2 = startOfDay(input).getTime();
    const dayDiff = Math.round((d1 - d2) / (24 * 60 * 60 * 1000));

    if (dayDiff === 0) return "امروز";
    if (dayDiff === 1) return "دیروز";
    if (dayDiff === 2) return "دو روز پیش";
    if (dayDiff <= 7) return "هفتهٔ پیش";
    if (dayDiff <= 30) return "ماهِ پیش";

    const faFormatter = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
      day: "numeric",
      month: "long",
      year: input.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
    return faFormatter.format(input);
  }, []);

  const getExtension = React.useCallback(() => {
    const pick = (name?: string) => name?.split("?")[0].split(".").pop()?.toLowerCase();
    return pick(fileName) || pick(fileUrl);
  }, [fileName, fileUrl]);

  const isImage = React.useMemo(() => {
    const ext = getExtension();
    if (!ext) return false;
    return ["png", "jpg", "jpeg", "gif", "webp", "bmp", "svg"].includes(ext);
  }, [getExtension]);
  const handleDownload = async () => {
    try {
      // Call proxy via POST so URL is hidden from address bar and prevent navigation
      const response = await fetch('/api/proxy-download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: fileUrl, filename: fileName }),
      });
      if (!response.ok) {
        throw new Error(`Proxy error: ${response.status}`);
      }
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = fileName || 'download';
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(blobUrl);
      onDownload?.();
    } catch (e) {
      console.error(e);
    }
  };

  const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);


  const handleDelete = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) onDelete();
  };
  const handleView = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsPreviewOpen(true);
  };


  return (
    <>
      <div
        className={styles["file-download"]}
        style={{
          width: width && width,
        }}
      >
        <div
          className={styles["file-download__button"]}
          style={{ backgroundColor: bgcColor ? `var(--${bgcColor})` : "" }}
        >
          <div className={styles["file-download__top-row"]}>
            <FileStyle fileName={fileName} fileUrl={fileUrl} />
            <div className={styles["file-download__info"]}>
              <div className={styles["file-download__name"]}>
                <Text textStyle="12S5" textColor="secondary2-700">{title || fileName}</Text>
              </div>
              <div className={styles["file-download__meta"]}>
                {size && (
                  <Text textStyle="10S5" textColor="secondary2-500">{size}</Text>
                )}
                {(size && date) && <span>•</span>}
                {date && (
                  <Text textStyle="10S5" textColor="secondary2-500">{formatPersianHumanDate(date)}</Text>
                )}
              </div>
            </div>
            <div className={styles["file-download__icon"]}>
              {showDelete ? (
                <div
                  className={styles["file-download__icon-delete"]}
                  onClick={handleDelete}
                >
                  <Trash size={24} color="var(--error-700)" variant="Bulk" />
                </div>
              ) : (
                <div className={styles["file-download__icon-import"]}>
                  <Import onClick={handleDownload} size={24} color="var(--primary-700)" variant="Bulk" />
                </div>
              )}
              <div
                className={styles["file-download__icon-view"]}
                onClick={handleView}
                role="button"
                aria-label="مشاهده فایل"
              >
                <Eye size={20} color="#007BFF" variant="Bulk" />
              </div>
            </div>
          </div>
        </div>
      </div>
      {isPreviewOpen && (
        <div className={styles["file-download__modal-overlay"]} onClick={() => setIsPreviewOpen(false)}>
          <div
            className={styles["file-download__modal"]}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className={styles["file-download__modal-header"]}>
              <Text textStyle="14S4" textColor="secondary2-600">{title || fileName}</Text>
              <div className={styles["file-download__modal-actions"]}>
                <button type="button" onClick={handleDownload} className={styles["file-download__modal-download"]}>
                  دانلود
                </button>
                <button type="button" onClick={() => setIsPreviewOpen(false)} className={styles["file-download__modal-close"]}>
                  بستن
                </button>
              </div>
            </div>
            <div className={styles["file-download__modal-body"]}>
              {isImage ? (
                <Image
                  src={fileUrl}
                  alt={title || fileName}
                  className={styles["file-download__preview"]}
                  width={800}
                  height={600}
                  style={{ width: '100%', height: 'auto' }}
                />
              ) : (
                <iframe
                  src={fileUrl}
                  className={styles["file-download__preview"]}
                  title={title || fileName}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

