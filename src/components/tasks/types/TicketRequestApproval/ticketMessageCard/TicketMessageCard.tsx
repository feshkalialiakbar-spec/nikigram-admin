import React, { useState } from "react";
import Image from "next/image";
import styles from "./TicketMessageCard.module.scss";
import Text from "@/components/ui/text/Text";

import FileDownload from "@/components/ui/fileDownload/FileDownload";
import { buildDocDownloadUrl } from "@/utils/docUrl";
import { TicketMessageDto, TicketParticipantDto, MessageAttachmentDto } from "../Ticket/lib/types";



type TicketMessageCardProps = {
  message: TicketMessageDto;
  participant: TicketParticipantDto | null;
};

export default function TicketMessageCard({
  message,
  participant,
}: TicketMessageCardProps) {
  const fallbackAvatar = "/images/not-found.png";
  const initialAvatar =
    participant?.ProfileImage && participant?.ProfileImage?.length > 1
      ? buildDocDownloadUrl(participant.ProfileImage)
      : fallbackAvatar;
  const [avatarSrc, setAvatarSrc] = useState<string>(initialAvatar);
  // تابع برای فرمت کردن تاریخ
  const formatMessageDate = (dateString: string): string => {
    try {
      const messageDate = new Date(dateString);

      // بررسی امروز بودن (با توجه به تاریخ میلادی سیستم؛ نمایش با فرمت fa-IR)
      const now = new Date();
      const isToday =
        messageDate.getFullYear() === now.getFullYear() &&
        messageDate.getMonth() === now.getMonth() &&
        messageDate.getDate() === now.getDate();

      const time = new Intl.DateTimeFormat("fa-IR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(messageDate);

      if (isToday) {
        return `امروز، ${time}`;
      }

      const datePart = new Intl.DateTimeFormat("fa-IR", {
        year: "numeric",
        month: "long",
        day: "2-digit",
      }).format(messageDate);

      return `${datePart}، ${time}`;
    } catch (_error) {
      return dateString;
    }
  };

  // تابع برای گرفتن نام نمایشی
  const getDisplayName = (
    participant: TicketParticipantDto | null,
    isMine: boolean
  ): string => {
    if (isMine) {
      return "شما";
    }
    if (participant) {
      return (
        participant.FullName ||
        `${participant.FirstName} ${participant.LastName}`
      );
    }
    return "پشتیبانی";
  };



  const displayName = getDisplayName(participant, message.is_mine);
  const hasAttachment = message.attachments && message.attachments.length > 0;

  // تابع برای ساخت URL فایل
  const getFileUrl = (fileUid: string): string => {
    return buildDocDownloadUrl(fileUid) || `/api/sys/files/download/${fileUid}`;
  };

  return (
    <div
      className={`${styles["ticket-message-card"]} ${message.is_mine
        ? styles["ticket-message-card--mine"]
        : styles["ticket-message-card--other"]
        }`}
    >
      <div className={styles["ticket-message-card__header"]}>
        <div className={styles["ticket-message-card__header-avatar"]}>
          <Image
            src={avatarSrc}
            alt={displayName}
            width={24}
            height={24}
            unoptimized
            referrerPolicy="no-referrer"
            onError={() => {
              if (avatarSrc !== fallbackAvatar) {
                setAvatarSrc(fallbackAvatar);
              }
            }}
            style={{
              width: 24,
              height: 24,
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        </div>
        <Text textStyle="12S4" textColor="gray-900" wrap="nowrap">
          {displayName}
        </Text>
      </div>
      <div
        className={`${styles["ticket-message-card__bubble"]} ${message.is_mine
          ? styles["ticket-message-card__bubble--mine"]
          : styles["ticket-message-card__bubble--other"]
          }`}
      >
        {message.content && (
          <Text textStyle="14S4" textColor="gray-800" textAlign="right">
            {message.content}
          </Text>
        )}
        {hasAttachment && message.attachments && (
          <div className={styles["ticket-message-card__attachments"]}>
            {message.attachments.map((attachment: MessageAttachmentDto) => {
              // ترکیب file_name با file_extension برای نمایش صحیح در FileStyle
              // اگر file_name از قبل extension نداره، extension رو اضافه می‌کنیم
              let fileNameWithExtension = attachment.file_name;
              if (attachment.file_extension) {
                const hasExtension = attachment.file_name
                  .toLowerCase()
                  .endsWith(attachment.file_extension.toLowerCase());
                if (!hasExtension) {
                  fileNameWithExtension = `${attachment.file_name}${attachment.file_extension}`;
                }
              }

              return (
                <FileDownload
                  key={attachment.file_uid}
                  fileName={fileNameWithExtension}
                  fileUrl={getFileUrl(attachment.file_uid)}
                  onDownload={() => {
                    // TODO: در آینده می‌توان لاگ یا analytics اضافه کرد
                  }}
                  width="100%"
                />
              );
            })}
          </div>
        )}
      </div>
      <div
        className={`${styles["ticket-message-card__time"]} ${message.is_mine
          ? styles["ticket-message-card__time--mine"]
          : styles["ticket-message-card__time--other"]
          }`}
      >
        <Text textStyle="12S4" textColor="gray-500">
          {formatMessageDate(message.sent_at)}
        </Text>
      </div>
    </div>
  );
}
