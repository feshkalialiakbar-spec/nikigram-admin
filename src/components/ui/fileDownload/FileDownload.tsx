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
  const handleDownload = async () => {
    await fetch(fileUrl).then(response => response.blob()).then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
    });

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
                <a href={fileUrl} download target="_blank" rel="noopener noreferrer" className={styles["file-download__modal-download"]}>
                  دانلود
                </a>
                <button type="button" onClick={() => setIsPreviewOpen(false)} className={styles["file-download__modal-close"]}>
                  بستن
                </button>
              </div>
            </div>
            <div className={styles["file-download__modal-body"]}>
              {fileUrl ? (
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

// import React from "react";
// import Image from "next/image";
// import styles from "./FileDownload.module.scss";
// import Text, { Colors } from "@/components/ui/text/Text";
// import { Eye, Trash } from "iconsax-react";
// import FileStyle from "@/components/global/fileStyle/FileStyle";

// interface FileDownloadProps {
//   title?: string;
//   fileName: string;
//   fileUrl: string;
//   onDownload?: () => void;
//   showDelete?: boolean;
//   onDelete?: () => void;
//   bgcColor?: Colors;
//   width?: string;
//   openInNewTab?: boolean;
// }

// export default function FileDownload({
//   title,
//   fileName,
//   fileUrl,
//   onDownload,
//   showDelete = false,
//   onDelete,
//   bgcColor,
//   width,
//   openInNewTab = true,
// }: FileDownloadProps) {
// const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);

//   const triggerClientDownload = async (url: string, suggestedName?: string) => {
//     try {
//       const response = await fetch(url, { credentials: 'include' });
//       const blob = await response.blob();
//       const objectUrl = window.URL.createObjectURL(blob);
//       const anchor = document.createElement('a');
//       anchor.href = objectUrl;
//       anchor.download = suggestedName || (url.split('?')[0].split('/').pop() || 'file');
//       document.body.appendChild(anchor);
//       anchor.click();
//       anchor.remove();
//       window.URL.revokeObjectURL(objectUrl);
//     } catch {
//       // Fallback: try opening in a new tab/window (may allow manual saving)
//       if (openInNewTab) {
//         window.open(url, '_blank', 'noopener,noreferrer');
//       }
//     }
//   };

//   const handleDownload = async (e?: React.MouseEvent) => {
//     if (e) {
//       e.preventDefault();
//       e.stopPropagation();
//     }
//     if (onDownload) onDownload();
//     // Prefer client-side download to support all types and cross-origin
//     await triggerClientDownload(fileUrl, fileName);
//   };

//   const handleDelete = (e: React.MouseEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (onDelete) onDelete();
//   };

// const handleView = (e: React.MouseEvent<HTMLDivElement>) => {
//   e.preventDefault();
//   e.stopPropagation();
//   setIsPreviewOpen(true);
// };

//   const closePreview = () => setIsPreviewOpen(false);

// const normalizedUrl = (fileUrl || "").toLowerCase();
// const isImage = /^data:image\//.test(normalizedUrl) || /\.(png|jpe?g|gif|webp|bmp|svg)(\?|#|$)/i.test(normalizedUrl);

//   return (
//     <div
//       className={styles["file-download"]}
//       style={{
//         width: width && width,
//       }}
//     >
//       <a
//         href={fileUrl}
//         download
//         className={styles["file-download__button"]}
//         style={{ backgroundColor: bgcColor ? `var(--${bgcColor})` : "#FFFFFF" }}
//         onClick={handleDownload}
//         target={undefined}
//         rel={undefined}
//       >
//         {/* Right: file type icon */}
//         <div className={styles["file-download__right"]} aria-hidden>
//           <FileStyle fileName={fileName} fileUrl={fileUrl} />
//         </div>
//         {/* Middle: title / filename */}
//         <div className={styles["file-download__middle"]}>
//           <Text textStyle="14S4" textColor="secondary2-700">
//             {title || fileName}
//           </Text>
//         </div>
//         {/* Left: action icon (import/download or delete) */}
//         <div className={styles["file-download__left"]}>
//           {showDelete ? (
//             <div
//               className={styles["file-download__icon-delete"]}
//               onClick={handleDelete}
//             >
//               <Trash size={20} color="var(--error-700)" variant="Bulk" />
//             </div>
//           ) : (
//             <div
//               className={styles["file-download__icon-view"]}
//               onClick={handleView}
//               role="button"
//               aria-label="مشاهده فایل"
//             >
//               <Eye size={20} color="#007BFF" variant="Bulk" />
//             </div>
//           )}
//         </div>
//       </a>

// {isPreviewOpen && (
//   <div className={styles["file-download__modal-overlay"]} onClick={closePreview}>
//     <div
//       className={styles["file-download__modal"]}
//       onClick={(e) => e.stopPropagation()}
//       role="dialog"
//       aria-modal="true"
//     >
//       <div className={styles["file-download__modal-header"]}>
//         <Text textStyle="14S4" textColor="secondary2-600">{title || fileName}</Text>
//         <div className={styles["file-download__modal-actions"]}>
//           <a href={fileUrl} download target="_blank" rel="noopener noreferrer" className={styles["file-download__modal-download"]}>
//             دانلود
//           </a>
//           <button type="button" onClick={closePreview} className={styles["file-download__modal-close"]}>
//             بستن
//           </button>
//         </div>
//       </div>
//       <div className={styles["file-download__modal-body"]}>
//         {isImage ? (
//           <Image
//             src={fileUrl}
//             alt={title || fileName}
//             className={styles["file-download__preview"]}
//             width={800}
//             height={600}
//             style={{ width: '100%', height: 'auto' }}
//           />
//         ) : (
//           <iframe
//             src={fileUrl}
//             className={styles["file-download__preview"]}
//             title={title || fileName}
//           />
//         )}
//       </div>
//     </div>
//   </div>
// )}
//     </div>
//   );
// }