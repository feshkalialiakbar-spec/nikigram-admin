import React from "react";
import styles from "./FileDownload.module.scss";
import Text, { Colors } from "@/components/ui/text/Text";
import { Import, Trash } from "iconsax-react";
import FileStyle from "@/components/global/fileStyle/FileStyle";

interface FileDownloadProps {
  title?: string;
  fileName: string;
  fileUrl: string;
  onDownload?: () => void;
  showDelete?: boolean;
  onDelete?: () => void;
  bgcColor?: Colors;
  width?: string;
  openInNewTab?: boolean;
}

export default function FileDownload({
  title,
  fileName,
  fileUrl,
  onDownload,
  showDelete = false,
  onDelete,
  bgcColor,
  width,
  openInNewTab = true,
}: FileDownloadProps) {
  const handleDownload = () => {
    if (onDownload) onDownload();
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
      <a
        href={fileUrl}
        download
        className={styles["file-download__button"]}
        style={{ backgroundColor: bgcColor ? `var(--${bgcColor})` : "" }}
        onClick={handleDownload}
        target={openInNewTab ? "_blank" : undefined}
        rel={openInNewTab ? "noopener noreferrer" : undefined}
      >
        <div className={styles["file-download__top-row"]}>
          <FileStyle file={fakeFile} />
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
                <Import size={24} color="var(--primary-700)" variant="Bulk" />
              </div>
            )}
          </div>
        </div>
        <div className={styles["file-download__content"]}>
          <Text textStyle="14S4" textColor="main-black">
            {title || fileName}
          </Text>
        </div>
      </a>
    </div>
  );
}