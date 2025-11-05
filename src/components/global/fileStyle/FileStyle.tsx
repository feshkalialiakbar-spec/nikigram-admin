import Text from "@/components/ui/text/Text";
import styles from "./FileStyle.module.scss";
import Image from "next/image";
interface FileStyleProps {
  file?: File | null;
  fileName?: string;
  fileUrl?: string;
}
export default function FileStyle({ file, fileName, fileUrl }: FileStyleProps) {
  const deriveExtension = (): string | undefined => {
    if (fileName) {
      return fileName.split(".").pop()?.toLowerCase().slice(0, 3);
    }
    if (fileUrl) {
      try {
        const path = new URL(fileUrl, typeof window !== 'undefined' ? window.location.origin : 'http://localhost').pathname;
        return path.split(".").pop()?.toLowerCase().slice(0, 3);
      } catch {
        const fallback = fileUrl.split("?")[0];
        return fallback.split(".").pop()?.toLowerCase().slice(0, 3);
      }
    }
    return file?.name.split(".").pop()?.toLowerCase().slice(0, 3);
  };
  const extension = deriveExtension();
  const bgColor = (() => {
    switch (extension) {
      // Text
      case "txt":
      case "log":
        return "red";
      case "md":
        return "red";
      case "csv":
        return "red";

      // Image
      case "jpg":
      case "jpe": // handles jpeg (sliced to 3 chars)
        return "red";
      case "png":
        return "red";
      case "gif":
        return "red";
      case "svg":
        return "red";
      case "bmp":
        return "red";
      case "web": // handles webp (sliced to 3 chars)
        return "red";

      // Compressed
      case "zip":
      case "rar":
      case "tar":
      case "gz":
      case "7z":
        return "red";

      // Video
      case "mp4":
      case "mov":
      case "avi":
      case "mkv":
      case "web":
        return "red";

      // Audio
      case "mp3":
      case "wav":
      case "ogg":
      case "m4a":
        return "red";
      // Data / Spreadsheet
      case "xls":
      case "xlsx":
        return "red";
      case "jso": // handles json
      case "xml":
        return "red";
      // Non-editable Docs
      case "pdf":
        return "red";
      case "epu": // handles epub
        return "red";
      // Editable Docs
      case "doc":
      case "docx":
        return "red";
      case "odt":
      case "rtf":
        return "red";
      // Slides
      case "ppt":
      case "pptx":
      case "odp":
        return "red";

      // Default
      default:
        return "red";
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
        <Image alt="upload-icon" src={'/images/imageFrame.svg'} width={'27'} height="32" />
      </div>
      <div className={styles['file-style__name']}>
        {/* <Text textStyle="14S4" textColor="main-black">
          {fileName}
        </Text> */}
      </div>
    </div>
  );
}
