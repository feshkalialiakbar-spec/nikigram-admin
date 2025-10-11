import Button from "@/components/ui/actions/button/Button";
import React, { useState, useEffect } from "react";
import styles from "./ProfileTaskModal.module.scss";
import Checkbox from "@/components/ui/forms/checkbox/Checkbox";
import Text from "@/components/ui/text/Text";
import Modal from "@/components/ui/modal/Modal";
import TextField from "@/components/ui/forms/textField/TextField";
import Dropdown from "@/components/ui/forms/dropdown/Dropdown";
import FileUpload from "@/components/ui/fileUpload/FileUpload";
import FileDownload from "@/components/ui/fileDownload/FileDownload";

interface ProfileTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskData?: any;
}

export default function ProfileTaskModal({
  isOpen,
  onClose,
  taskData,
}: ProfileTaskModalProps) {
  // Report Modal State
  const [isReportModalOpen, setIsReportModalOpen] = useState(isOpen);
  const [reportFormData, setReportFormData] = useState({
    taskTitle: taskData?.title || "",
    progressDescription: "",
    status: "in-progress",
    attachment: null as File | null,
    requestExplanation: false,
  });

  // Update modal state when props change
  useEffect(() => {
    setIsReportModalOpen(isOpen);
  }, [isOpen]);

  // Update form data when taskData changes
  useEffect(() => {
    if (taskData) {
      setReportFormData((prev) => ({
        ...prev,
        taskTitle: taskData.title || "",
      }));
    }
  }, [taskData]);

  // Handle form field changes
  const handleFormChange = (field: string, value: string | boolean) => {
    setReportFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle file upload
  const handleFileUpload = (file: File | null) => {
    setReportFormData((prev) => ({
      ...prev,
      attachment: file,
    }));
  };

  // Handle form submission
  const handleReportSubmit = () => {
    console.log("Report submitted:", reportFormData);
    // اینجا می‌توانید API call اضافه کنید
    setIsReportModalOpen(false);
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsReportModalOpen(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isReportModalOpen}
      onClose={handleModalClose}
      title="گزارش‌نویسی"
      body={
        <div className={styles["profile-task-modal"]}>
          {/* عنوان وظیفه */}
          <div className={styles["profile-task-modal__title"]}>
            <Text
              textStyle="14S4"
              textColor="gray-700"
              textTag="span"
              textAlign="right"
            >
              عنوان وظیفه
            </Text>
            <Text
              textStyle="14S5"
              textColor="gray-950"
              textTag="span"
              textAlign="right"
            >
              {reportFormData.taskTitle}
            </Text>
          </div>

          {taskData?.deadline && (
            <div className={styles["profile-task-modal__deadline"]}>
              <Text
                textStyle="14S4"
                textColor="gray-700"
                textTag="span"
                textAlign="right"
              >
                مهلت انجام
              </Text>
              <Text
                textStyle="14S5"
                textColor="gray-950"
                textTag="span"
                textAlign="right"
              >
                {taskData.deadline.toLocaleDateString("fa-IR")}
              </Text>
            </div>
          )}

          <div className={styles["profile-task-modal__status"]}>
            <Dropdown
              placeholder="وضعیت"
              label="وضعیت"
              options={[
                { label: "در حال اجرا", value: "in-progress" },
                { label: "تکمیل شده", value: "completed" },
                { label: "در انتظار", value: "pending" },
                { label: "در حال انجام", value: "in-progress" },
              ]}
              value={reportFormData.status}
              baseColor={{
                borderAndLabel: "gray-300",
                inputBgColor: "main-white",
                textInput: "gray-950",
              }}
              size="sm"
              onChangeAction={(value: string) =>
                handleFormChange("status", value)
              }
            />
          </div>

          <div className={styles["profile-task-modal__description"]}>
            <TextField
              placeholder="برای این مرحله از پیشرفت وظیفه می‌توانید یادداشت بنویسید"
              baseColor={{
                borderAndLabel: "gray-300",
                inputBgColor: "main-white",
                textInput: "gray-950",
              }}
              label="شرح پیشرفت وظیفه"
              size="sm"
              value={reportFormData.progressDescription}
              onChangeAction={(value: string) =>
                handleFormChange("progressDescription", value)
              }
              isTextArea={true}
              rows={4}
            />
          </div>

          {/* بارگذاری فایل اتچمنت */}
          <div className={styles["profile-task-modal__report-field"]}>
            <Text textStyle="14S5" textColor="gray-900" textTag="label">
              بارگذاری فاکتور فروش
            </Text>
            <FileUpload
              accept="image/*,.pdf,.doc,.docx"
              value={reportFormData.attachment}
              onChange={handleFileUpload}
              onFocus={() => {}}
              onBlur={() => {}}
              isFocused={false}
              isEditing={false}
              showException={{
                row2: {
                  text1: "بارگذاری کنید",
                  text2: "SVG, PNG, JPG, GIF | 10MB max",
                },
              }}
            />
            {reportFormData.attachment && (
              <div className={styles["profile-task-modal__uploaded-file"]}>
                <FileDownload
                  fileName={reportFormData.attachment.name}
                  fileUrl={URL.createObjectURL(reportFormData.attachment)}
                  showDelete={true}
                  onDelete={() => handleFileUpload(null)}
                />
              </div>
            )}
          </div>
        </div>
      }
      footer={
        <Button
          bgColor="primary-700"
          shadow="primary-800"
          paddingStyle="avg-8-32"
          fullScreen={true}
          onClick={handleReportSubmit}
          mode="side-rounded"
        >
          <Text textStyle="14S5" textColor="main-white" textTag="span">
            ثبت گزارش
          </Text>
        </Button>
      }
    />
  );
}
