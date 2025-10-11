import React from "react";
import styles from "./UserActivitiesDonationsToProjects.module.scss";
import Text, { Colors } from "@/components/ui/text/Text";
import ParsehImage from "@/components/ui/image/ParsehImage";
import InboxEmpty from "@/assets/images/global/inboxEmpty.svg";
import Button from "@/components/ui/actions/button/Button";
import ProjectCard from "@/components/ui/cards/projectCard/ProjectCard";
import { useUserProjectDonations } from "@/hooks/useUserProjectDonations";
import { useRouter } from "next/router";

export default function UserActivitiesDonationsToProjects() {
  const { data: userProjectDonations, loading, error } = useUserProjectDonations();
  const router = useRouter();

  const handleViewProjectDetails = (projectId: number) => {
    router.push(`/projects/${projectId}`);
  };


  // Handle loading state
  if (loading) {
    return (
      <div className={styles["user-activities-donations-to-projects"]}>
        <div className={styles["user-activities-donations-to-projects__loading"]}>
          <Text textStyle="16S4" textColor="gray-700">
            در حال بارگذاری...
          </Text>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className={styles["user-activities-donations-to-projects"]}>
        <div className={styles["user-activities-donations-to-projects__error"]}>
          <Text textStyle="16S4" textColor="error-500">
            خطا در دریافت اطلاعات: {error}
          </Text>
        </div>
      </div>
    );
  }

  return (
    <div className={styles["user-activities-donations-to-projects"]}>
      {userProjectDonations.length <= 0 ? (
        <div className={styles["user-activities-donations-to-projects__empty"]}>
          <div
            className={
              styles["user-activities-donations-to-projects__empty-img-wrapper"]
            }
          >
            <ParsehImage
              imgSrc={InboxEmpty}
              imgAlt="ok"
              fitDirection="width"
              fill
              aspectRatio="1/1"
            />
          </div>
          <Text textStyle="16S7" textColor="gray-950">
            شما هنوز در مناقصه‌ای شرکت نکرده‌اید.
          </Text>
          <Text textStyle="16S4" textColor="gray-700">
            مناقصه‌های فعال و مهم منتظر پیشنهاد شما هستند. به آنها سر بزنید و
            پیشنهاد خود را ثبت کنید!
          </Text>
          <Button
            bgColor="primary-700"
            mode="side-rounded"
            paddingStyle="avg-8-32"
            shadow="primary-800"
            onClick={() => {}}
          >
            <Text textStyle="16S5" textColor="main-white" fontFamily="moraba">
              مشاهده مناقصه‌ها
            </Text>
          </Button>
        </div>
      ) : (
        <div className={styles["user-activities-donations-to-projects__list"]}>
          {userProjectDonations.map((donation, index) => (
            <ProjectCard
              key={donation.project_id}
              proj_request_id={donation.project_id}
              proj_template_id={donation.project_id}
              project_name={donation.project_name}
              project_description="توضیحات پروژه در دسترس نیست"
              project_object_type={1}
              project_id={donation.project_id}
              hideExceptions={{
                showThreeImages: false,
                showDonut3D: false,
                showTimeRemaining: false,
              }}
              created_by={0}
              cust_id={0}
              baseline_version={1}
              current_version={1}
              created_at={donation.last_donation_date}
              updated_at={donation.last_donation_date}
              priority_id={1}
              strategic_weight={0}
              alarm_date={donation.last_donation_date}
              exp_date={donation.last_donation_date}
              max_amount_monthly={0}
              ibn=""
              total_awarded_price={donation.total_amount}
              total_donations={donation.total_amount}
              goal_amount={donation.total_amount}
              category_name=""
              fund_name=""
              donors_count={0}
              top_donors={[]}
              labelValue={[
                { id: 1, label: "مبلغ اهدایی", value: donation.total_amount.toLocaleString('fa-IR') + " تومان" },
                { id: 2, label: "تاریخ آخرین اهدا", value: new Date(donation.last_donation_date).toLocaleDateString('fa-IR') },
              ]}
              owner={{
                name: "اطلاعات مالک در دسترس نیست",
                avatar: "",
              }}
              charity={{
                name: "اطلاعات خیریه در دسترس نیست",
                logo: "",
              }}
              firstBtn={{
                text: "مشاهده جزئیات",
                onClick: () => handleViewProjectDetails(donation.project_id),
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
