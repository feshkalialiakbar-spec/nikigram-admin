import { useCallback, useEffect, useState } from 'react';
import { CloseCircle } from 'iconsax-react';
import {
  ProjectTemplateItem,
  fetchProjectTemplateList,
  fetchProjectTemplateDetail,
  ProjectTemplateDetailResponse,
} from '@/services/projectTemplate';
import { useToast } from '@/components/ui';
import TemplateCard from './TemplateCard/TemplateCard';
import styles from './TemplateSelector.module.scss';

interface TemplateSelectorProps {
  onClose: () => void;
  onTemplateReject: () => Promise<void>;
  onConfirmTemplate: (detail: ProjectTemplateDetailResponse) => Promise<void>;
  isRejecting: boolean;
  isProcessing: boolean;
  defaultTemplateId?: number | null;
  defaultTemplateDetail?: ProjectTemplateDetailResponse;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  onTemplateReject,
  onConfirmTemplate,
  isRejecting,
  isProcessing,
  defaultTemplateId,
  defaultTemplateDetail,
}) => {
  const { showError } = useToast();
  const [templates, setTemplates] = useState<ProjectTemplateItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null);
  const [detailsCache, setDetailsCache] = useState<Record<number, ProjectTemplateDetailResponse>>({});

  const loadTemplates = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetchProjectTemplateList({});
      setTemplates(response.items);
    } catch (error) {
      console.error('Failed to load templates:', error);
      showError('خطا در دریافت لیست تمپلیت‌ها');
    } finally {
      setIsLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    void loadTemplates();
  }, [loadTemplates]);

  const formatDate = useCallback((value?: string | null) => {
    if (!value) return '—';

    try {
      return new Intl.DateTimeFormat('fa-IR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }).format(new Date(value));
    } catch (error) {
      console.error('Failed to format date:', error);
      return value ?? '—';
    }
  }, []);

  useEffect(() => {
    if (typeof defaultTemplateId === 'number') {
      setSelectedTemplateId(defaultTemplateId);
    }
  }, [defaultTemplateId]);

  useEffect(() => {
    if (!defaultTemplateDetail) return;
    setDetailsCache((prev) => {
      if (prev[defaultTemplateDetail.project_temp_id]) return prev;
      return {
        ...prev,
        [defaultTemplateDetail.project_temp_id]: defaultTemplateDetail,
      };
    });
  }, [defaultTemplateDetail]);

  const handleConfirmTemplate = useCallback(
    async (template: ProjectTemplateItem) => {
      const templateId = template.template_detail.project_temp_id;
      setSelectedTemplateId(templateId);

      const cachedDetail = detailsCache[templateId];
      if (cachedDetail) {
        await onConfirmTemplate(cachedDetail);
        return;
      }

      try {
        const detail = await fetchProjectTemplateDetail(templateId);
        setDetailsCache(prev => ({ ...prev, [templateId]: detail }));
        await onConfirmTemplate(detail);
      } catch (error) {
        console.error('Failed to confirm template:', error);
        showError('خطا در دریافت جزئیات تمپلیت');
      }
    },
    [detailsCache, onConfirmTemplate, showError]
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>تمپلیت‌های پیشنهادی</h2>
        <button
          type="button"
          className={styles.rejectButton}
          onClick={() => void onTemplateReject()}
          disabled={isRejecting || isProcessing}
        >
          <CloseCircle size={20} color="#E70218" variant="Bulk" />
          <span>{isRejecting ? 'در حال ارسال...' : 'عدم تایید تمپلیت'}</span>
        </button>
      </div>

      <div className={styles.cardsGrid}>
        {isLoading ? (
          <div className={styles.loadingState}>در حال بارگذاری...</div>
        ) : templates.length === 0 ? (
          <div className={styles.emptyState}>هیچ تمپلیتی یافت نشد.</div>
        ) : (
          templates.map(template => {
            const templateId = template.template_detail.project_temp_id;
            const cachedDetail = detailsCache[templateId];
            const isTemplateLoading = isProcessing && selectedTemplateId === templateId;

            return (
              <TemplateCard
                key={templateId}
                template={template}
                isSelected={selectedTemplateId === templateId}
                isDisabled={isProcessing}
                isLoading={isTemplateLoading}
                onSelect={() => void handleConfirmTemplate(template)}
                formatDate={formatDate}
                phaseCount={cachedDetail?.phases?.length ?? null}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default TemplateSelector;
