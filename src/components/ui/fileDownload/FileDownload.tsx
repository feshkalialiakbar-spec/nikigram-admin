import React from "react";
import styles from "./FileDownload.module.scss";
import Text, { Colors } from "@/components/ui/text/Text";
import { Eye, Import, Trash } from "iconsax-react";
import FileStyle from "@/components/global/fileStyle/FileStyle";
import Image from "next/image";
import Button from "@/components/ui/actions/button/Button";
import { buildDocDownloadUrl } from "@/utils/docUrl";
import { proxyDownloadFile } from "@/services/file";

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

  const isVideo = React.useMemo(() => {
    const ext = getExtension();
    if (!ext) return false;
    return ["mp4", "webm", "ogg", "avi", "mov", "wmv", "flv", "mkv"].includes(ext);
  }, [getExtension]);

  const isPdf = React.useMemo(() => {
    const ext = getExtension();
    return ext === "pdf";
  }, [getExtension]);

  const isAudio = React.useMemo(() => {
    const ext = getExtension();
    if (!ext) return false;
    return ["mp3", "wav", "ogg", "aac", "m4a", "flac", "wma"].includes(ext);
  }, [getExtension]);
  const resolvedFileUrl = React.useMemo(() => buildDocDownloadUrl(fileUrl), [fileUrl]);
  const handleDownload = async () => {
    try {
      const blob = await proxyDownloadFile({
        url: resolvedFileUrl || fileUrl,
        filename: fileName,
      });
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
            <FileStyle fileName={fileName} fileUrl={resolvedFileUrl || fileUrl} />
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
                <Button type="button" onClick={handleDownload} buttonClassName={styles["file-download__modal-download"]}>
                  دانلود
                </Button>
                <Button type="button" onClick={() => setIsPreviewOpen(false)} buttonClassName={styles["file-download__modal-close"]}>
                  بستن
                </Button>
              </div>
            </div>
            <div className={styles["file-download__modal-body"]}>
              {isImage ? (
                <Image
                  src={resolvedFileUrl || fileUrl}
                  alt={title || fileName}
                  className={styles["file-download__preview"]}
                  width={800}
                  height={600}
                  style={{ width: '100%', height: 'auto' }}
                />
              ) : isVideo ? (
                <video
                  src={resolvedFileUrl || fileUrl}
                  controls
                  className={styles["file-download__preview"]}
                  style={{ width: '100%', maxHeight: '80vh' }}
                >
                  مرورگر شما از پخش ویدیو پشتیبانی نمی‌کند.
                </video>
              ) : isPdf ? (
                <embed
                  src={resolvedFileUrl || fileUrl}
                  type="application/pdf"
                  className={styles["file-download__preview"]}
                  style={{ width: '100%', height: '80vh', minHeight: '500px' }}
                />
              ) : isAudio ? (
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  padding: '2rem',
                  minHeight: '300px'
                }}>
                  <FileStyle fileName={fileName} fileUrl={resolvedFileUrl || fileUrl} />
                  <audio
                    src={resolvedFileUrl || fileUrl}
                    controls
                    style={{ width: '100%', maxWidth: '500px', marginTop: '1rem' }}
                  >
                    مرورگر شما از پخش صدا پشتیبانی نمی‌کند.
                  </audio>
                </div>
              ) : (
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  padding: '2rem',
                  minHeight: '300px',
                  textAlign: 'center'
                }}>
                  <FileStyle fileName={fileName} fileUrl={resolvedFileUrl || fileUrl} />
                  <div style={{ marginTop: '1rem' }}>
                    <Text 
                      textStyle="14S5" 
                      textColor="gray-600"
                    >
                      این نوع فایل قابل پیش‌نمایش نیست
                    </Text>
                  </div>
                  <div style={{ marginTop: '0.5rem' }}>
                    <Text 
                      textStyle="12S4" 
                      textColor="gray-500"
                    >
                      برای مشاهده فایل، آن را دانلود کنید
                    </Text>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

