import TemplateOverviewTestPage from './TemplateOverviewTestPage';
import {
  fetchProjectTemplateDetail,
  fetchProjectTemplateList,
  type ProjectTemplateDetailResponse,
} from '@/services/projectTemplate';

interface TestPageProps {
  searchParams?: {
    templateId?: string;
  };
}

const buildTemplateOptions = (items: Awaited<ReturnType<typeof fetchProjectTemplateList>>['items']) =>
  items.map((item) => ({
    id: String(item.template_detail.project_temp_id),
    title: item.template_detail.title,
    fundName: item.category_detail.fund_name,
  }));

export default async function TestPage({ searchParams }: TestPageProps) {
  let templateDetail: ProjectTemplateDetailResponse | null = null;
  let templateOptions: Array<{ id: string; title: string; fundName: string }> = [];
  let resolvedTemplateId = searchParams?.templateId ?? null;
  let listError: string | null = null;
  let detailError: string | null = null;

  try {
    const listResponse = await fetchProjectTemplateList({ limit: 20 });
    templateOptions = buildTemplateOptions(listResponse.items);
    if (!resolvedTemplateId && templateOptions.length > 0) {
      resolvedTemplateId = templateOptions[0]?.id ?? null;
    }
  } catch (error) {
    listError =
      error instanceof Error ? error.message : 'خطا در دریافت لیست تمپلیت‌ها از سرور.';
  }

  if (resolvedTemplateId) {
    try {
      templateDetail = await fetchProjectTemplateDetail(resolvedTemplateId);
    } catch (error) {
      detailError =
        error instanceof Error ? error.message : 'خطا در دریافت جزئیات تمپلیت انتخاب‌شده.';
    }
  } else if (!listError) {
    detailError = 'تمپلیت فعالی برای نمایش وجود ندارد.';
  }

  return (
    <TemplateOverviewTestPage
      template={templateDetail}
      templateOptions={templateOptions}
      selectedTemplateId={resolvedTemplateId}
      listError={listError}
      detailError={detailError}
    />
  );
}
