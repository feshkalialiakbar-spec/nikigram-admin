import React, { useState, useMemo } from "react";
import { useRouter } from "next/router";
import styles from "./ProfileTasksDone.module.scss";
import { TaskDto } from "@/types/task.dto";
import { doneTasksList } from "@/mocks/doneTasks";
import Pagination from "@/components/ui/pagination/Pagination";
import useWindowWidth from "@/hooks/useWindowWidth";
import {
  Eye,
} from "iconsax-react";
import TextField from "@/components/ui/forms/textField/TextField";
import { useNumberFormatter } from "@/composables/useNumberFormatter";
import Text from "@/components/ui/text/Text";
import Button from "@/components/ui/actions/button/Button";

interface ProfileTasksDoneProps {
  onViewTask?: (task: any) => void;
}

export default function ProfileTasksDone({ onViewTask }: ProfileTasksDoneProps) {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [isLoading] = useState(false);
  const [error] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { width, hydrated } = useWindowWidth();
  const isDesktop = hydrated && width >= 1280;
  const pageSize = 10;
  const { formatNumber } = useNumberFormatter();

  // فیلتر کردن وظایف بر اساس جستجو
  const doneTasks = useMemo(() => {
    let filteredTasks = doneTasksList;

    // فیلتر بر اساس جستجو
    if (searchTerm.trim()) {
      filteredTasks = filteredTasks.filter(
        (task) =>
          task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.organization.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    return filteredTasks;
  }, [searchTerm]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("fa-IR-u-ca-persian", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const calculateRemainingDays = (deadline: Date) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);

    // تنظیم زمان به ابتدای روز برای محاسبه دقیق‌تر
    now.setHours(0, 0, 0, 0);
    deadlineDate.setHours(0, 0, 0, 0);

    const timeDiff = deadlineDate.getTime() - now.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    // اگر مهلت گذشته باشد
    if (daysDiff < 0) {
      return "-";
    }

    // اگر امروز آخرین روز باشد
    if (daysDiff === 0) {
      return "امروز";
    }

    // نمایش تعداد روز باقی‌مانده
    return `${daysDiff} روز`;
  };

  return (
    <div className={styles["profile-tasks-done"]}>
      <div className={styles["profile-tasks-done__content"]}>
        {/* فیلترها */}
        <div className={styles["profile-tasks-done__filters"]}>
          <div className={styles["profile-tasks-done__filter-group"]}>
            {/* فیلتر جستجو */}
            <TextField
              value={searchTerm}
              baseColor={{
                borderAndLabel: "gray-200",
                inputBgColor: "main-bg",
                textInput: "main-black",
                textError: "error-700",
              }}
              onChangeAction={(value: string) => setSearchTerm(value)}
              placeholder="جستجو"
              size="sm"
              label="جستجو"
            />
          </div>
        </div>

        {isLoading && (
          <div className={styles["profile-tasks-done__loading"]}>
            در حال بارگذاری...
          </div>
        )}

        {error && (
          <div className={styles["profile-tasks-done__error"]}>
            خطا در بارگذاری اطلاعات: {error}
          </div>
        )}

        {!isLoading && !error && doneTasks.length === 0 && (
          <div className={styles["profile-tasks-done__empty"]}>
            هیچ وظیفه‌ای انجام شده وجود ندارد.
          </div>
        )}

        {!isLoading && !error && doneTasks.length > 0 && (
          <div className={styles["profile-tasks-done__table-container"]}>
            <Pagination
              items={doneTasks}
              page={page}
              pageSize={pageSize}
              onPageChange={setPage}
              renderHeader={(classes) => (
                <tr>
                  <th>
                    <Text
                      textStyle="14S5"
                      textColor="gray-700"
                      fontFamily="moraba"
                    >
                      وظیفه
                    </Text>
                  </th>
                  <th>
                    <Text
                      textStyle="14S5"
                      textColor="gray-700"
                      fontFamily="moraba"
                    >
                      {isDesktop ? "مهلت انجام" : "مهلت"}
                    </Text>
                  </th>
                  <th>
                    <Text
                      textStyle="14S5"
                      textColor="gray-700"
                      fontFamily="moraba"
                    >
                      {isDesktop ? "مبلغ (تومان)" : "مبلغ"}
                    </Text>
                  </th>
                  <th className={classes.detailsCell}>
                    <Text
                      textStyle="14S5"
                      textColor="gray-700"
                      fontFamily="moraba"
                    >
                      رهگیری
                    </Text>
                  </th>
                  <th className={classes.detailsCell}>
                    <Text
                      textStyle="14S5"
                      textColor="gray-700"
                      fontFamily="moraba"
                    >
                      عملیات
                    </Text>
                  </th>
                </tr>
              )}
              renderRow={(task, classes) => (
                <tr>
                  <td>
                    <Text textStyle="14S5" textColor="gray-700">
                      {task.title.length > 20
                        ? task.title.slice(0, 20) + "..."
                        : task.title}
                    </Text>
                  </td>
                  <td>
                    <Text textStyle="14S5" textColor="gray-700">
                      {calculateRemainingDays(task.deadline)}
                    </Text>
                  </td>
                  <td>
                    <Text textStyle="14S5" textColor="gray-700">
                      {formatNumber(task.reward)}
                    </Text>
                  </td>
                  <td className={classes.detailsCell}>
                    <Button
                      paddingStyle="none"
                      bgColor="transparent"
                      onClick={() => {
                        onViewTask?.(task);
                      }}
                    >
                      {isDesktop ? (
                        <Text
                          textStyle="14S5"
                          textColor="primary-700"
                          fontFamily="moraba"
                        >
                          مشاهده
                        </Text>
                      ) : (
                        <Eye
                          size={20}
                          color="var(--primary-700)"
                          variant="Bulk"
                        />
                      )}
                    </Button>
                  </td>
                  <td className={classes.detailsCell}>
                    <Button
                      paddingStyle="none"
                      bgColor="transparent"
                      onClick={() => {
                        // Navigate to task detail page
                        router.push(
                          {
                            pathname: router.pathname,
                            query: { ...router.query, taskDetail: "true", taskId: task.id.toString() },
                          },
                          undefined,
                          { shallow: true }
                        );
                      }}
                    >
                      <Text
                        textStyle="12S5"
                        textColor="primary-700"
                        fontFamily="moraba"
                      >
                        مشاهده
                      </Text>
                    </Button>
                  </td>
                </tr>
              )}
              className={styles["profile-tasks-done__pagination"]}
            />
          </div>
        )}
      </div>
    </div>
  );
}
