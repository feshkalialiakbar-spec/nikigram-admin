import { describe, expect, it } from '@jest/globals';
import { mapHelpRequestToComponent } from '../taskMappers';
import type { ApiHelpRequestResponse } from '../../components/tasks/types';

const buildTaskDetails = () => ({
  task_id: 123,
  task_title: 'Sample task',
  task_description: 'Description',
  ref_type: 2,
  ref_id: 456,
  status_id: 1,
  status_name: 'در انتظار بررسی',
  created_at: '2024-01-01',
  source_template_id: null,
  parent_task_id: null,
});

const buildProjectRequestDetails = () => ({
  request_id: 42,
  request_type: 1,
  category_id: 10,
  title: 'عنوان',
  description: 'توضیحات',
  max_amount_monthly: 100000,
  ibn: 'IR123',
  time_period: 3,
  amount_in_period: 300000,
  mobile: '09120000000',
  status: 1,
  created_at: '2024-01-01',
  updated_at: null,
  category_name: 'دسته',
  parent_category_name: 'دسته والد',
  user_id: 7,
  cust_id: 8,
  first_name: 'کاربر',
  last_name: 'نمونه',
  profile_image: null,
  party_mobile: '09120000000',
  is_verified: 1,
});

describe('mapHelpRequestToComponent', () => {
  it('falls back to provided task id when identifiers are missing', () => {
    const response = {
      task_details: buildTaskDetails(),
    } as unknown as ApiHelpRequestResponse;

    const result = mapHelpRequestToComponent(response, { fallbackTaskId: '318' });

    expect(result.id).toBe('318');
    expect(typeof result.id).toBe('string');
  });

  it('returns request identifier as string when available', () => {
    const response = {
      task_details: buildTaskDetails(),
      project_request_details: buildProjectRequestDetails(),
    } as ApiHelpRequestResponse;

    const result = mapHelpRequestToComponent(response, { fallbackTaskId: '318' });

    expect(result.id).toBe('42');
    expect(typeof result.id).toBe('string');
  });
});

