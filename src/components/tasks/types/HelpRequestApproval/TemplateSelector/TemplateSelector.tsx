import { useEffect, useMemo, useState } from 'react';
import {
  Calendar,
  CloseCircle,
  TickCircle,
  ArrowLeft2,
  DocumentText,
  Category2,
  Clock,
  Bubble,
  ArrowUp,
} from 'iconsax-react';
import Button from '@/components/ui/actions/button/Button';
import Text from '@/components/ui/text/Text';
import {
  ProjectTemplateItem,
  fetchProjectTemplateList,
  fetchProjectTemplateDetail,
  ProjectTemplateDetailResponse,
} from '@/services/projectTemplate';
import { useToast } from '@/components/ui';
import styles from './TemplateSelector.module.scss';

interface TemplateSelectorProps {
  onClose: () => void;
  onTemplateReject: () => Promise<void>;
  onConfirmTemplate: (detail: ProjectTemplateDetailResponse) => Promise<void>;
  isRejecting: boolean;
  isProcessing: boolean;
}
const MAX_TEMPLATE_DESCRIPTION_LENGTH = 180;
const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  onClose,
  onTemplateReject,
  onConfirmTemplate,
  isRejecting,
  isProcessing,
}) => {
  const { showError } = useToast();
  const [templates, setTemplates] = useState<ProjectTemplateItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
  const [activeTemplate, setActiveTemplate] = useState<ProjectTemplateItem | null>(null);
  const [templateDetail, setTemplateDetail] = useState<ProjectTemplateDetailResponse | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  const hasMore = useMemo(() => templates.length < totalCount, [templates.length, totalCount]);
  const loadTemplates = async (nextOffset = 0, append = false) => {
    setIsLoading(true);
    try {
      const response = await fetchProjectTemplateList({ offset: nextOffset });
      setTotalCount(response.count);
      setTemplates(prev =>
        append ? [...prev, ...response.items] : response.items
      );
      setOffset(nextOffset + response.items.length);
    } catch (error) {
      console.error('Failed to load templates:', error);
      showError('خطا در دریافت لیست تمپلیت‌ها');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadTemplates();
  }, []);

  const handleLoadMore = () => {
    if (hasMore && !isLoading) {
      void loadTemplates(offset, true);
    }
  };

  const handleTemplateClick = async (template: ProjectTemplateItem) => {
    const templateId = template.template_detail.project_temp_id;
    setActiveTemplate(template);
    setViewMode('detail');
    setIsDetailLoading(true);
    try {
      const detail = await fetchProjectTemplateDetail(templateId);
      setTemplateDetail(detail);
    } catch (error) {
      console.error('Failed to load template detail:', error);
      showError('خطا در دریافت جزئیات تمپلیت');
      setViewMode('list');
      setActiveTemplate(null);
    } finally {
      setIsDetailLoading(false);
    }
  };

  const handleConfirmTemplate = async () => {
    if (!templateDetail) return;
    try {
      await onConfirmTemplate(templateDetail);
    } catch (error) {
      // Parent handles toast; keep console for visibility
      console.error('Template confirmation failed:', error);
    }
  };

  const handleSelectAnotherTemplate = () => {
    setTemplateDetail(null);
    setActiveTemplate(null);
    setViewMode('list');
  };

  const renderTemplateDescription = (description: string) => {
    if (!description) return '—';
    if (description.length <= MAX_TEMPLATE_DESCRIPTION_LENGTH) {
      return description;
    }
    return `${description.slice(0, MAX_TEMPLATE_DESCRIPTION_LENGTH)}…`;
  };

  const formatDate = (value?: string | null) => {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString('fa-IR');
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.wrapper}>
        <header className={styles.topSection}>
          <button
            type="button"
            className={styles.backPill}
            onClick={onClose}
            disabled={isProcessing || isRejecting}
          >
            <ArrowLeft2 size={20} color="#0E315D" variant="Bold" />
            <span>بازگشت</span>
          </button>

          <div className={styles.primaryHeading}>
            <div className={styles.primaryHeadingIcon}>
              <Bubble size={16} color="#0E315D" variant="Bulk" />
            </div>
            <div className={styles.primaryHeadingText}>
              <h2>
                {viewMode === 'detail'
                  ? activeTemplate?.template_detail.title ?? 'جزئیات تمپلیت'
                  : 'تمپلیت‌های پیشنهادی'}
              </h2>
              <p>تولید شده توسط هوش مصنوعی و مناسب برای ایجاد پروژه جدید</p>
            </div>
          </div>

          <div className={styles.topActions}>
            {viewMode === 'detail' && (
              <button
                type="button"
                className={styles.secondaryPill}
                onClick={handleSelectAnotherTemplate}
                disabled={isDetailLoading || isProcessing}
              >
                <TickCircle size={18} color="#0E315D" variant="Bold" />
                <span>انتخاب تمپلیت دیگر</span>
              </button>
            )}
            <button
              type="button"
              className={styles.rejectPill}
              onClick={() => void onTemplateReject()}
              disabled={isRejecting || isProcessing}
            >
              <CloseCircle size={20} color="#E70218" variant="Bulk" />
              <span>{isRejecting ? 'در حال ارسال...' : 'عدم تایید تمپلیت'}</span>
            </button>
          </div>
        </header>

        <div className={styles.contentArea}>
          {viewMode === 'list' && (
            <section className={styles.listSection}>
              <div className={styles.listHeader}>
                <span>یکی از تمپلیت‌های زیر را برای ادامه فرآیند انتخاب کنید.</span>
              </div>

              <div className={styles.cardsGrid}>
                {templates.map(template => {
                  const { template_detail: templateDetail, category_detail: categoryDetail } = template;
                  const isSelected =
                    activeTemplate?.template_detail.project_temp_id === templateDetail.project_temp_id;

                  return (
                    <article
                      key={templateDetail.project_temp_id}
                      className={`${styles.card} ${isSelected ? styles.cardSelected : ''}`}
                    >
                      <div className={styles.cardHeader}>
                        <div className={styles.cardHeaderMeta}>
                          <div className={styles.cardBadge}>
                            <Calendar size={16} color="#829BB7" variant="Bulk" />
                            <span>{formatDate(templateDetail.created_at)}</span>
                          </div>
                          {isSelected && (
                            <span className={styles.cardSelectedTag}>
                              <TickCircle size={16} color="#fff" variant="Bold" />
                              انتخاب شده
                            </span>
                          )}
                        </div>
                        <h3>{templateDetail.title || 'عنوان نامشخص'}</h3>
                        <p>{renderTemplateDescription(templateDetail.description)}</p>
                      </div>

                      <div className={styles.cardBody}>
                        <div className={styles.cardRow}>
                          <span className={styles.label}>صندوق مربوطه</span>
                          <span className={styles.value}>{categoryDetail.fund_name || '—'}</span>
                        </div>
                        <div className={styles.cardRow}>
                          <span className={styles.label}>دسته‌بندی</span>
                          <span className={styles.value}>{categoryDetail.title || '—'}</span>
                        </div>
                        <div className={styles.cardRow}>
                          <span className={styles.label}>والد</span>
                          <span className={styles.value}>{categoryDetail.parent_title || '—'}</span>
                        </div>
                      </div>

                      <Button
                        bgColor="transparent"
                        buttonClassName={styles.cardAction}
                        onClick={() => void handleTemplateClick(template)}
                        disabled={isLoading}
                      >
                        <Text textColor="primary-900" textStyle="14S7">
                          مشاهده جزئیات تمپلیت
                        </Text>
                      </Button>
                    </article>
                  );
                })}

                {!isLoading && templates.length === 0 && (
                  <div className={styles.emptyState}>
                    <p>هیچ تمپلیتی برای نمایش وجود ندارد.</p>
                  </div>
                )}
              </div>

              {hasMore && (
                <Button
                  buttonClassName={styles.loadMore}
                  onClick={handleLoadMore}
                  disabled={isLoading}
                  bgColor="transparent"
                >
                  <ArrowUp size={18} color="#007BFF" variant="Bulk" />
                  <Text textColor="primary-900" textStyle="14S7">
                    {isLoading ? 'در حال بارگذاری...' : 'مشاهده تمپلیت‌های بیشتر'}
                  </Text>
                </Button>
              )}
            </section>
          )}

          {viewMode === 'detail' && (
            <section className={styles.detailView}>
              {isDetailLoading && (
                <div className={styles.detailLoading}>
                  <p>در حال بارگذاری جزئیات تمپلیت...</p>
                </div>
              )}

              {!isDetailLoading && templateDetail && (
                <>
                  <div className={styles.detailSummary}>
                    <div className={styles.detailSummaryHeader}>
                      <div className={styles.detailMeta}>
                        <span className={styles.detailCategory}>{templateDetail.category_detail.parent_title}</span>
                        <h3>{templateDetail.title}</h3>
                        <p>{templateDetail.description}</p>
                      </div>
                      <div className={styles.detailInfoCard}>
                        <div className={styles.infoRow}>
                          <DocumentText size={20} color="#0E315D" variant="Bold" />
                          <div>
                            <span>تعداد فازها</span>
                            <strong>{templateDetail.phases?.length ?? 0}</strong>
                          </div>
                        </div>
                        <div className={styles.infoRow}>
                          <Category2 size={20} color="#0E315D" variant="Bold" />
                          <div>
                            <span>صندوق</span>
                            <strong>{templateDetail.category_detail.fund_name}</strong>
                          </div>
                        </div>
                        <div className={styles.infoRow}>
                          <Clock size={20} color="#0E315D" variant="Bold" />
                          <div>
                            <span>تاریخ ایجاد</span>
                            <strong>{formatDate(templateDetail.created_at)}</strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={styles.phasesContainer}>
                    {(templateDetail.phases ?? []).map((phase, phaseIndex) => (
                      <div key={phase.phase_id} className={styles.phaseCard}>
                        <div className={styles.phaseHeader}>
                          <span className={styles.phaseIndex}>فاز {phaseIndex + 1}</span>
                          <div className={styles.phaseTitleGroup}>
                            <h4>{phase.phase_name}</h4>
                            <p>{phase.phase_description || 'بدون توضیح'}</p>
                          </div>
                        </div>

                        <div className={styles.phaseTasks}>
                          {(phase.tasks?.length ?? 0) === 0 ? (
                            <div className={styles.emptyTasks}>
                              <span>تسکی برای این فاز ثبت نشده است.</span>
                            </div>
                          ) : (
                            (phase.tasks ?? []).map(task => {
                              const prerequisiteCount = task.prerequisites?.length ?? 0;
                              const corequisiteCount = task.corequisites?.length ?? 0;

                              return (
                                <div key={task.task_id} className={styles.taskRow}>
                                  <div className={styles.taskTitleGroup}>
                                    <span className={styles.taskName}>{task.task_title}</span>
                                    {task.task_description && (
                                      <span className={styles.taskDescription}>{task.task_description}</span>
                                    )}
                                  </div>
                                  <div className={styles.taskMeta}>
                                    {prerequisiteCount > 0 && (
                                      <span className={styles.taskBadge}>
                                        پیش‌نیاز {prerequisiteCount}
                                      </span>
                                    )}
                                    {corequisiteCount > 0 && (
                                      <span className={styles.taskBadgeAlt}>
                                        همزمانی {corequisiteCount}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className={styles.detailActions}>
                    <Button
                      bgColor="primary-900"
                      buttonClassName={styles.confirmButton}
                      onClick={() => void handleConfirmTemplate()}
                      disabled={isProcessing}
                    >
                      <Text textColor="main-white" textStyle="14S7">
                        {isProcessing ? 'در حال تایید...' : 'ایجاد پروژه با این تمپلیت'}
                      </Text>
                    </Button>
                  </div>
                </>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateSelector;

