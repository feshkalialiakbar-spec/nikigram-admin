import WithNavbarLayout from '@/components/layouts/withNavbarLayout/WithNavbarLayout';
import TaskDetailPage from '@/components/tasks/detail/TaskDetailPage';

const MyTaskDetailPage = () => {
    return (
        <WithNavbarLayout>
            <TaskDetailPage />
        </WithNavbarLayout>
    )
}
export default MyTaskDetailPage