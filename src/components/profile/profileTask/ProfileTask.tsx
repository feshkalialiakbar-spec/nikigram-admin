import React, { useState } from "react";
import { useRouter } from "next/router";
import styles from "./ProfileTask.module.scss";
import ProfileTasksMyTasks from "./profileTasksMyTasks/ProfileTasksMyTasks";
import ProfileTasksPending from "./profileTasksPending/ProfileTasksPending";
import ProfileTasksInProgress from "./profileTasksInProgress/ProfileTasksInProgress";
import ProfileTasksDone from "./profileTasksDone/ProfileTasksDone";
import useWindowWidth from "@/hooks/useWindowWidth";
import Button from "@/components/ui/actions/button/Button";
import { ArrowLeft2, ArrowRight3 } from "iconsax-react";
import Text from "@/components/ui/text/Text";
import ProfileTaskDetail from "./profileTaskDetail/ProfileTaskDetail";
import ProfileTaskModal from "./profileTaskModal/ProfileTaskModal";
export default function ProfileTask() {
  const router = useRouter();
  const currentTaskTab =
    typeof router.query.tasktab === "string"
      ? router.query.tasktab
      : "my-tasks";
  const [isToggleActive, setIsToggleActive] = useState(true);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);

  // Check if we're on a specific task tab (not the main task page)
  const isOnSpecificTaskTab = router.query.tasktab;

  const handleTabChange = (tab: string) => {
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, tasktab: tab },
      },
      undefined,
      { shallow: true }
    );
  };

  const handleBackClick = () => {
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, tasktab: undefined },
      },
      undefined,
      { shallow: true }
    );
  };

  // Handle opening modal with task data
  const handleOpenModal = (task: any) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  // Handle closing modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const renderTaskContent = () => {
    // Check if we have a selected task
    if (router.query.taskDetail && router.query.taskId) {
      return <ProfileTaskDetail taskId={router.query.taskId as string} />;
    }

    switch (currentTaskTab) {
      case "my-tasks":
        return <ProfileTasksMyTasks onViewTask={handleOpenModal} />;
      case "pending":
        return <ProfileTasksPending onViewTask={handleOpenModal} />;
      case "in-progress":
        return <ProfileTasksInProgress onViewTask={handleOpenModal} />;
      case "done":
        return <ProfileTasksDone onViewTask={handleOpenModal} />;

      default:
        return;
    }
  };

  const menuItems = [
    {
      id: "my-tasks",
      title: "کارهای من",
      count: 10,
      active: currentTaskTab === "my-tasks",
    },
    {
      id: "pending",
      title: "در انتظار انجام",
      count: 5,
      active: currentTaskTab === "pending",
    },
    {
      id: "in-progress",
      title: "در حال انجام",
      count: 10,
      active: currentTaskTab === "in-progress",
    },
    {
      id: "done",
      title: "انجام شده",
      count: 5,
      active: currentTaskTab === "done",
    },
  ];
  const { width, hydrated } = useWindowWidth();
  const isDesktop = hydrated && width >= 1280;
  return (
    <div className={styles["profile-task"]}>
      {/* Back Button - Only show on specific task tabs */}
      {isOnSpecificTaskTab && !isDesktop && (
        <div className={styles["profile-task__back"]}>
          <Button onClick={handleBackClick}>
            <div className={styles["profile-task__back-button"]}>
              <ArrowRight3
                size={20}
                color="var(--primary-700)"
                variant="Bulk"
              />
              <Text
                textStyle="14S5"
                textColor="primary-700"
                fontFamily="moraba"
              >
                بازگشت
              </Text>
            </div>
          </Button>
        </div>
      )}
      {/* Menu Items - Only show on main task page */}
      {!isOnSpecificTaskTab && !isDesktop && (
        <div className={styles["profile-task__menu"]}>
          {menuItems.map((item) => (
            <div
              key={item.id}
              className={`${styles["profile-task__menu-item"]} ${
                item.active ? styles["profile-task__menu-item--active"] : ""
              }`}
              onClick={() => handleTabChange(item.id)}
            >
              <Text
                textStyle="14S5"
                textColor="primary-700"
                fontFamily="moraba"
              >
                {item.title}
              </Text>
              <div className={styles["profile-task__menu-arrow"]}>
                <ArrowLeft2
                  size={20}
                  color="var(--primary-700)"
                  variant="Outline"
                />
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Content */}
      <div className={styles["profile-task__content"]}>
        {renderTaskContent()}
      </div>
      
      {/* Modal */}
      <ProfileTaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        taskData={selectedTask}
      />
    </div>
  );
}
