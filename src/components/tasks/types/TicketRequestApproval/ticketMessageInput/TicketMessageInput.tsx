import { useEffect, useRef } from "react";
import Button from "@/components/ui/actions/button/Button";
import { AttachCircle, Send2 } from "iconsax-react";
import styles from "./TicketMessageInput.module.scss";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isDesktop?: boolean;
  onFileSelected?: (file: File) => void;
  className?: string;
  iconsClassName?: string;
  disabled?: boolean;
};

export default function TicketMessageInput({
  value,
  onChange,
  onSend,
  isDesktop = false,
  onFileSelected,
  className,
  iconsClassName,
  disabled,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      onFileSelected?.(files[0]);
    }
  };

  useEffect(() => {
    if (textareaContainerRef.current) {
      const textarea = textareaContainerRef.current.querySelector(
        "textarea"
      ) as HTMLTextAreaElement;
      if (textarea) {
        textarea.style.height = "auto";
        const maxHeight = 200;
        const newHeight = Math.min(textarea.scrollHeight, maxHeight);
        textarea.style.height = `${newHeight}px`;
      }
    }
  }, [value]);

  return (
    <div
      className={className ?? styles["ticket-message-input"]}
      onClick={() => {
        inputRef.current?.focus();
      }}
      style={{ cursor: "text" }}
    >
      <div className={iconsClassName ?? styles["ticket-message-input__icons"]}>
        <Button
          bgColor="gray-100"
          paddingStyle={isDesktop ? "equal-8" : "equal-4"}
          onClick={handleAttachClick}
        >
          <AttachCircle
            size={isDesktop ? 24 : 20}
            color="var(--gray-400)"
            variant="Linear"
          />
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          style={{ display: "none" }}
          onChange={handleFileSelect}
          accept="*/*"
        />
      </div>
      <div ref={textareaContainerRef} style={{ flex: 1, minWidth: 0 }}>
        <input
          ref={inputRef}
          type="text"
          placeholder="پیام"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSend();
            }
          }}
          style={{ width: "100%" }}
        />
      </div>
      <Button
        bgColor="primary-100"
        mode="full-rounded"
        paddingStyle={isDesktop ? "equal-8" : "equal-4"}
        onClick={onSend}
        disabled={disabled || !value.trim()}
      >
        <Send2
          size={isDesktop ? 32 : 20}
          color="var(--primary-700)"
          variant="Bulk"
        />
      </Button>
    </div>
  );
}
