import styles from "./FileDownload.module.scss";
import Text, { Colors } from "@/components/ui/text/Text";
import { Import, Trash, Eye } from "iconsax-react";
import FileStyle from "@/components/global/fileStyle/FileStyle";
import Link from "next/link";
interface FileDownloadProps {
  title?: string;
  fileName: string;
  fileUrl: string;
  onDownload?: () => void;
  onView?: () => void;
  showDelete?: boolean;
  onDelete?: () => void;
  bgcColor?: Colors;
  width?: string;
}
export default function FileDownload({
  title,
  fileName,
  fileUrl,
  onDownload,
  onView,
  showDelete = false,
  onDelete,
  bgcColor,
  width,
}: FileDownloadProps) {
  const handleDownload = () => {
    if (onDownload) onDownload();
  };

  const handleView = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (onView) onView();
  };

  const handleDelete = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) onDelete();
  };
  const fakeFile = new File([""], fileName);
  return (
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
        kivigho
        <div className={styles["file-download__top-row"]}>
          <FileStyle file={fakeFile} />
          <div className={styles["file-download__actions"]}>
            {onView && (
              <div
                className={styles["file-download__icon-view"]}
                onClick={handleView}
                title="مشاهده فایل"
              >
                <Eye size={20} color="var(--primary-700)" variant="Bulk" />
              </div>
            )}
            {showDelete ? (
              <div
                className={styles["file-download__icon-delete"]}
                onClick={handleDelete}
                title="حذف فایل"
              >
                <Trash size={20} color="var(--error-700)" variant="Bulk" />
              </div>
            ) : (
              <p
                className={styles["file-download__icon-download"]}
                onClick={handleDownload}
                title="دانلود فایل"
              >
                <Import size={20} color="var(--primary-700)" variant="Bulk" />
              </p>
            )}
          </div>
        </div>
        <div className={styles["file-download__content"]}>
          <Text textStyle="14S4" textColor="main-black">
            {title || fileName}
          </Text>
        </div>
      </div>
    </div>
  );
}