'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import DrawerModal from '@/components/ui/modal/drawerModal/DrawerModal';
import Dropdown from '@/components/ui/forms/dropdown/Dropdown';
import TextField from '@/components/ui/forms/textField/TextField';
import Text, { type Colors } from '@/components/hub/forms/text/Text';
import { safeText } from '@/hooks/texedit';
import {
  fetchStaffList,
  type StaffMember,
} from '@/services/staff';
import styles from './styles/TaskAssignmentDrawer.module.scss';

export interface TaskAssignmentSubmitPayload {
  phaseId?: number;
  phaseName?: string;
  phasePosition?: number;
  taskId?: number;
  taskTitle?: string;
  staffId: number;
  staffLabel: string;
  deadlineDays?: number | null;
  assignmentNotes?: string | null;
}

interface TaskAssignmentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  phaseId?: number;
  phaseName?: string;
  phasePosition?: number;
  taskId?: number;
  taskTitle?: string;
  taskDescription?: string | null;
  onSubmit?: (payload: TaskAssignmentSubmitPayload) => void | Promise<void>;
  requestId?: number;
  templateId?: number;
}

const buildStaffLabel = (member: StaffMember): string => {
  const canned = [member.FullName, member.Alias, member.Mobile, member.Email].filter(
    (value): value is string => Boolean(value && value.trim())
  );
  return canned[0] ?? `کاربر ${member.staff_id}`;
};

const TaskAssignmentDrawer: React.FC<TaskAssignmentDrawerProps> = ({
  isOpen,
  onClose,
  phaseId,
  phaseName,
  phasePosition,
  taskId,
  taskTitle,
  taskDescription,
  onSubmit,
}) => {
  const [isLoadingStaff, setIsLoadingStaff] = useState(false);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedStaff, setSelectedStaff] = useState('');
  const [deadline, setDeadline] = useState('');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = useCallback(() => {
    setSelectedStaff('');
    setDeadline('');
    setNotes('');
    setFormError(null);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    let cancelled = false;
    const run = async () => {
      setIsLoadingStaff(true);
      setLoadError(null);
      try {
        const response = await fetchStaffList({ limit: 50, offset: 0 });
        if (!cancelled) {
          setStaffMembers(response.staff_list ?? []);
        }
      } catch (error) {
        if (!cancelled) {
          setLoadError(
            error instanceof Error ? error.message : 'خطا در دریافت لیست کاربران'
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoadingStaff(false);
        }
      }
    };

    void run();

    return () => {
      cancelled = true;
      resetForm();
    };
  }, [isOpen, resetForm]);

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen, resetForm]);

  const staffOptions = useMemo(
    () =>
      staffMembers.map((member) => ({
        value: String(member.staff_id),
        label: safeText(buildStaffLabel(member)),
      })),
    [staffMembers]
  );

  const drawerTitle = useMemo(() => safeText(taskTitle ?? 'انتصاب به کاربران'), [taskTitle]);

  type DropdownColorConfig = {
    borderAndLabel: Colors;
    inputBgColor: Colors;
    textInput: Colors;
    textError: Colors;
    listBgColor: Colors;
    listTextColor: Colors;
  };

  type TextFieldColorConfig = {
    borderAndLabel: Colors;
    inputBgColor: Colors;
    textInput: Colors;
    textError: Colors;
  };

  const dropdownBaseColors = useMemo<DropdownColorConfig>(
    () => ({
      borderAndLabel: 'gray-300',
      inputBgColor: 'main-white',
      textInput: 'gray-900',
      textError: 'error-500',
      listBgColor: 'main-white',
      listTextColor: 'gray-900',
    }),
    []
  );

  const textFieldBaseColors = useMemo<TextFieldColorConfig>(
    () => ({
      borderAndLabel: 'gray-300',
      inputBgColor: 'main-white',
      textInput: 'gray-900',
      textError: 'error-500',
    }),
    []
  );

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    if (!selectedStaff) {
      setFormError('لطفا یک کاربر را انتخاب کنید');
      return;
    }

    setIsSubmitting(true);
    try {
      const staffId = Number(selectedStaff);
      const staffLabel = staffOptions.find((option) => option.value === selectedStaff)?.label ?? '';
      const deadlineValue = deadline.trim().length > 0 ? Number(deadline) : null;
      const normalizedDeadline =
        typeof deadlineValue === 'number' && Number.isFinite(deadlineValue)
          ? deadlineValue
          : null;
      const assignmentNotes = notes.trim().length > 0 ? notes.trim() : null;

      const payload: TaskAssignmentSubmitPayload = {
        phaseId,
        phaseName,
        phasePosition,
        taskId,
        taskTitle,
        staffId,
        staffLabel,
        deadlineDays: normalizedDeadline,
        assignmentNotes,
      };

      await onSubmit?.(payload);
      onClose();
      resetForm();
    } catch (error) {
      console.error('Error submitting assignment', error);
      setFormError(
        error instanceof Error ? error.message : 'خطا در ثبت اختصاص تسک'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDrawerVisibility = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <DrawerModal isOpen={isOpen} setIsOpen={handleDrawerVisibility}>
      <section className={styles.container} dir="rtl">
        <div className={styles.content}>
          <header className={styles.header}>
            <div className={styles.titleRow}>
              <Text textTag="h2" textStyle="20S5" textColor="gray-950" textAlign="right">
                {drawerTitle}
              </Text>
            </div>

            <div className={styles.phaseMeta}>
              {phaseName && (
                <Text textTag="span" textStyle="14S5" textColor="gray-700" textAlign="right">
                  {safeText(phaseName)}
                </Text>
              )}
              {phasePosition !== undefined && (
                <span className={styles.phaseBadge}>فاز {phasePosition}</span>
              )}
            </div>

            {taskDescription && (
              <Text
                textTag="p"
                textStyle="14S4"
                textColor="gray-600"
                textAlign="right"
                textClassName={styles.taskDescription}
              >
                {safeText(taskDescription)}
              </Text>
            )}
          </header>

          <form className={styles.form} onSubmit={handleSubmit} dir="rtl">
            <div className={styles.fieldGroup}>
              <Dropdown
                label="انتخاب کاربر"
                placeholder={isLoadingStaff ? 'در حال بارگذاری...' : 'کاربر مورد نظر را انتخاب کنید'}
                value={selectedStaff}
                onChangeAction={(value) => {
                  setSelectedStaff(value);
                  setFormError(null);
                }}
                options={staffOptions}
                disabled={isLoadingStaff || !!loadError}
                showSearch
                size="sm"
                baseColor={dropdownBaseColors}
              />
              {loadError && <span className={styles.errorText}>{loadError}</span>}
              {formError && <span className={styles.errorText}>{formError}</span>}
            </div>

            <div className={styles.fieldGroup}>
              <TextField
                label="مهلت انجام کار ( مثلا 10 روز )"
                placeholder="تعداد روز"
                value={deadline}
                onChangeAction={setDeadline}
                inputMode="numeric"
                size="sm"
                baseColor={textFieldBaseColors}
                normalizeDigits
              />
            </div>

            <div className={styles.fieldGroup}>
              <TextField
                label="شرح"
                placeholder="توضیحات تکمیلی"
                value={notes}
                onChangeAction={setNotes}
                isTextArea
                rows={4}
                size="sm"
                baseColor={textFieldBaseColors}
              />
            </div>

            <div className={styles.actions}>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={() => {
                  onClose();
                  resetForm();
                }}
              >
                انصراف
              </button>
              <button
                type="submit"
                className={styles.submitButton}
                disabled={isSubmitting || !selectedStaff}
              >
                {isSubmitting ? 'در حال ثبت...' : 'ثبت'}
              </button>
            </div>
          </form>
        </div>
      </section>
    </DrawerModal>
  );
};

export default TaskAssignmentDrawer;
