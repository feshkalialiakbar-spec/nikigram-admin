import { memo, useMemo } from 'react';
import { Calendar } from 'iconsax-react';
import { ProjectTemplateItem } from '@/services/projectTemplate';
import styles from './TemplateCard.module.scss';

interface TemplateCardProps {
  template: ProjectTemplateItem;
  isSelected: boolean;
  isDisabled: boolean;
  isLoading: boolean;
  onSelect: () => void;
  formatDate: (value?: string | null) => string;
  phaseCount: number | null;
}

const MAX_DESCRIPTION_LENGTH = 140;

const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  isSelected,
  isDisabled,
  isLoading,
  onSelect,
  formatDate,
  phaseCount,
}) => {
  const { template_detail: detail, category_detail: category } = template;

  const description = useMemo(() => {
    const rawDescription = detail.description?.trim();
    if (!rawDescription) return 'توضیحی برای این تمپلیت ثبت نشده است.';
    if (rawDescription.length <= MAX_DESCRIPTION_LENGTH) return rawDescription;
    return `${rawDescription.slice(0, MAX_DESCRIPTION_LENGTH)}…`;
  }, [detail.description]);

  const phaseValue =
    typeof phaseCount === 'number' ? `${phaseCount} فاز` : '—';

  const buttonLabel = isLoading
    ? 'در حال بررسی...'
    : isDisabled
      ? 'در حال تایید...'
      : 'انتخاب تمپلیت';

  return (
    <article
      className={`${styles.card} ${isSelected ? styles.cardSelected : ''}`}
    >
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>
          {detail.title || 'تمپلیت بدون عنوان'}
        </h3>
        <div className={styles.cardDate}>
          <Calendar size={16} color="#5F7392" variant="Bulk" />
          <span>{formatDate(detail.created_at)}</span>
        </div>
      </div>

      <div className={styles.cardMeta}>
        <div className={styles.cardMetaRow}>
          <span className={styles.cardMetaLabel}>صندوق مربوطه</span>
          <span className={styles.cardMetaValue}>
            {category.fund_name || '—'}
          </span>
        </div>
        <div className={styles.cardMetaRow}>
          <span className={styles.cardMetaLabel}>تعداد فازها</span>
          <span className={styles.cardMetaValue}>{phaseValue}</span>
        </div>
      </div>

      <p className={styles.cardDescription}>{description}</p>

      <button
        type="button"
        className={`${styles.cardButton} ${isSelected ? styles.cardButtonSelected : ''
          }`}
        onClick={onSelect}
        disabled={isDisabled || isLoading}
      >
        {buttonLabel}
      </button>
    </article>
  );
};

export default memo(TemplateCard);

