// components/ui/file/FileStyle.tsx
import React from "react";
import Text from "@/components/ui/text/Text";
import ParsehImage from "@/components/ui/image/ParsehImage";
import ImageFrame from "@/assets/images/global/imageFrame.svg";
import styles from "./FileStyle.module.scss";

interface FileStyleProps {
  file: File | null;
}

export default function FileStyle({ file }: FileStyleProps) {
  const extension = file?.name.split(".").pop()?.toLowerCase().slice(0, 3);

  const bgColor = (() => {
    switch (extension) {
      // Text
      case "txt":
      case "log":
        return "var(--secondary1-500)";
      case "md":
        return "var(--secondary1-400)";
      case "csv":
        return "var(--secondary1-600)";

      // Image
      case "jpg":
      case "jpeg":
        return "var(--primary-600)";
      case "png":
        return "var(--primary-700)";
      case "gif":
        return "var(--primary-400)";
      case "svg":
        return "var(--primary-300)";
      case "bmp":
        return "var(--primary-900)";
      case "webp":
        return "var(--primary-500)";

      // Compressed
      case "zip":
      case "rar":
      case "tar":
      case "gz":
      case "7z":
        return "var(--gray-700)";

      // Video
      case "mp4":
      case "mov":
      case "avi":
      case "mkv":
      case "webm":
        return "var(--secondary2-500)";

      // Audio
      case "mp3":
      case "wav":
      case "ogg":
      case "m4a":
        return "var(--secondary2-700)";

      // Data / Spreadsheet
      case "xls":
      case "xlsx":
        return "var(--secondary1-700)";
      case "json":
      case "xml":
        return "var(--secondary1-800)";

      // Non-editable Docs
      case "pdf":
        return "var(--error-500)";
      case "epub":
        return "var(--error-400)";

      // Editable Docs
      case "doc":
      case "docx":
        return "var(--secondary2-600)";
      case "odt":
      case "rtf":
        return "var(--secondary2-400)";

      // Slides
      case "ppt":
      case "pptx":
      case "odp":
        return "var(--primary-950)";

      // Default
      default:
        return "var(--gray-100)";
    }
  })();
  return (
    <div className={styles["file-style__wrapper"]}>
      <div
        className={styles["file-style__label"]}
        style={{ backgroundColor: bgColor }}
      >
        <Text textStyle="10S5" textColor="main-white">
          {extension}
        </Text>
      </div>
      <div className={styles["file-style__image"]}>
        <ParsehImage imgAlt="upload-icon" imgSrc={ImageFrame} width={'40'} />
      </div>
    </div>
  );
}
