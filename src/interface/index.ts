export interface TaskInterface {
  task_id: number
  task_title: string
  task_description: string
  status_id: number
  status_name: string
  created_at: string
  ref_type: number
  ref_uid: number
  ref_id: number
  staff_position_info: {
    staff_id: number
    position_id: number
    position_title: string
  }
  assignment_info: {
    assignment_id: number
    assignment_date: string
    assignment_notes: string
  }
}
