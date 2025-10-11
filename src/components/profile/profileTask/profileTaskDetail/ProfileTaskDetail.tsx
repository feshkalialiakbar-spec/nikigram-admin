import React from "react";
import { useRouter } from "next/router";
import styles from "./ProfileTaskDetail.module.scss";
import Text from "@/components/ui/text/Text";
import { nikiDetailsInHandwork, NikiDetailsInHandworkType } from "@/mocks/nikiDetailsInHandwork";
import { myTasksList } from "@/mocks/myTasks";
import { pendingTasksList } from "@/mocks/pendingTasks";
import { inProgressTasksList } from "@/mocks/inProgressTasks";
import { doneTasksList } from "@/mocks/doneTasks";
import { TaskDto } from "@/types/task.dto";
import ProfileTaskDetailCard from "@/components/ui/cards/profileTaskDetailCard/ProfileTaskDetailCard";
import Button from "@/components/ui/actions/button/Button";
import { ArrowRight2, Map } from "iconsax-react";

interface ProfileTaskDetailProps {
  taskId: string;
}

export default function ProfileTaskDetail({ taskId }: ProfileTaskDetailProps) {
  const router = useRouter();
  
  // Combine all task lists to find the task
  const allTasks = [...myTasksList, ...pendingTasksList, ...inProgressTasksList, ...doneTasksList];
  const taskData = allTasks.find(task => task.id.toString() === taskId);
  
  // Convert TaskDto to NikiDetailsInHandworkType format for display
  const convertedTaskData: NikiDetailsInHandworkType | null = taskData ? {
    task: taskData.title,
    deadline: taskData.deadline,
    amount: taskData.reward,
    status: taskData.status,
    tracking: `TK-${taskData.id}`,
    description: taskData.description || "",
    files: []
  } : null;

  const handleBackClick = () => {
    // Remove taskDetail and taskId from query to go back to the list
    const { taskDetail, taskId: _, ...restQuery } = router.query;
    router.push(
      {
        pathname: router.pathname,
        query: restQuery,
      },
      undefined,
      { shallow: true }
    );
  };

  // If task not found, show error message
  if (!convertedTaskData) {
    return (
      <div className={styles["profile-task-detail"]}>
        <Button bgColor="transparent" paddingStyle="none" onClick={handleBackClick}>
          <div className={styles["profile-task-detail__button-content"]}>
            <ArrowRight2 color="var(--primary-700)" size={20} variant="Outline" />
            <Text textStyle="16S5" textColor="primary-700" fontFamily="moraba">
              بازگشت
            </Text>
          </div>
        </Button>
        <Text textStyle="16S4" textColor="error-600" textAlign="center">
          وظیفه مورد نظر یافت نشد
        </Text>
      </div>
    );
  }

  return (
    <div className={styles["profile-task-detail"]}>
      <Button bgColor="transparent" paddingStyle="none" onClick={handleBackClick}>
        <div className={styles["profile-task-detail__button-content"]}>
          <ArrowRight2 color="var(--primary-700)" size={20} variant="Outline" />
          <Text textStyle="16S5" textColor="primary-700" fontFamily="moraba">
            جزئیات وظیفه دست نیکی
          </Text>
        </div>
      </Button>
      
      <ProfileTaskDetailCard itemData={convertedTaskData} />
    </div>
  );
}
