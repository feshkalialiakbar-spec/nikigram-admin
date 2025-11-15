'use client';

import { useState } from 'react';
import TemplatePhases, { TemplatePhase } from './modules/phases';
import styles from './styles/App.module.css';
import headerStyles from './styles/Header.module.css';
import statsStyles from './styles/Stats.module.css';

type TemplateOverviewTestPageProps = {
  template?: unknown;
  templateOptions?: Array<{ id: string; title: string; fundName: string }>;
  selectedTemplateId?: string | null;
  listError?: string | null;
  detailError?: string | null;
};

const samplePhases: TemplatePhase[] = [
  {
    id: 1,
    title: 'اجرای ساخت',
    categoryId: 7,
    statusId: 2,
    tasks: [
      {
        id: '1-1',
        order: 1,
        title: 'خاک‌برداری و فونداسیون',
        status: 'done',
        leftVariant: 'user',
        userInfo: {
          name: 'نسترن علی‌پور',
          label: 'انتصاب به کاربر:',
        },
        relationBadges: [
          {
            variant: 'blue',
            text: 'هم‌نیاز : تسک 2',
          },
        ],
        categoryId: 7,
        statusId: 1,
      },
      {
        id: '1-2',
        order: 2,
        title: 'نازک‌کاری (گچ، رنگ، پنجره، کف‌پوش)',
        status: 'done',
        leftVariant: 'tender',
        tenderInfo: {
          publishDateTime: 'تاریخ و زمان انتشار: 11:00 - 1404/02/29',
          title: 'ناظر ساخت ساختمان',
          label: 'مناقصه:',
          separator: '_',
        },
        relationBadges: [
          {
            variant: 'blue',
            text: 'هم‌نیاز : تسک 1',
          },
        ],
        categoryId: 7,
        statusId: 1,
      },
    ],
  },
  {
    id: 2,
    title: 'گودبرداری',
    categoryId: 9,
    statusId: 1,
    tasks: [
      {
        id: '2-1',
        order: 1,
        title: 'خاک‌برداری و فونداسیون',
        status: 'done',
        leftVariant: 'user',
        userInfo: {
          name: 'نسترن علی‌پور',
          label: 'انتصاب به کاربر:',
        },
        relationBadges: [
          {
            variant: 'blue',
            text: 'هم‌نیاز : تسک 3',
          },
        ],
        categoryId: 9,
        statusId: 1,
      },
      {
        id: '2-2',
        order: 2,
        title: 'اسکلت‌بندی (بتنی یا فلزی)',
        status: 'blocked',
        leftVariant: 'assignmentButtons',
        assignmentButtons: ['انتصاب به مناقصه', 'انتصاب به کاربر'],
        relationBadges: [
          {
            variant: 'blue',
            text: 'هم‌نیاز : تسک 3',
          },
          {
            variant: 'yellow',
            text: 'پیش‌نیاز : تسک 1',
          },
        ],
        categoryId: 9,
        statusId: 2,
      },
      {
        id: '2-3',
        order: 3,
        title: 'سفت‌کاری و دیوارچینی',
        status: 'done',
        leftVariant: 'tender',
        tenderInfo: {
          publishDateTime: 'تاریخ و زمان انتشار: 11:00 - 1404/02/29',
          title: 'ناظر ساخت ساختمان',
          label: 'مناقصه:',
          separator: '_',
        },
        relationBadges: [
          {
            variant: 'blue',
            text: 'هم‌نیاز : تسک 2',
          },
          {
            variant: 'yellow',
            text: 'پیش‌نیاز : تسک 1',
          },
        ],
        categoryId: 9,
        statusId: 1,
      },
    ],
  },
  {
    id: 3,
    title: 'ساخت اسکلت',
    categoryId: 7,
    statusId: 1,
    tasks: [
      {
        id: '3-1',
        order: 1,
        title: 'خاک‌برداری و فونداسیون',
        status: 'done',
        leftVariant: 'tender',
        tenderInfo: {
          publishDateTime: 'تاریخ و زمان انتشار: 11:00 - 1404/02/29',
          title: 'ناظر ساخت ساختمان',
          label: 'مناقصه:',
          separator: '_',
        },
        relationBadges: [
          {
            variant: 'blue',
            text: 'هم‌نیاز : تسک 3',
          },
        ],
        categoryId: 7,
        statusId: 1,
      },
      {
        id: '3-2',
        order: 2,
        title: 'اسکلت‌بندی (بتنی یا فلزی)',
        status: 'blocked',
        leftVariant: 'assignmentButtons',
        assignmentButtons: ['انتصاب به مناقصه', 'انتصاب به کاربر'],
        relationBadges: [
          {
            variant: 'blue',
            text: 'هم‌نیاز : تسک 3',
          },
          {
            variant: 'yellow',
            text: 'پیش‌نیاز : تسک 1',
          },
        ],
        categoryId: 7,
        statusId: 2,
      },
      {
        id: '3-3',
        order: 3,
        title: 'سفت‌کاری و دیوارچینی',
        status: 'done',
        leftVariant: 'user',
        userInfo: {
          name: 'نسترن علی‌پور',
          label: 'انتصاب به کاربر:',
        },
        relationBadges: [
          {
            variant: 'blue',
            text: 'هم‌نیاز : تسک 3',
          },
        ],
        categoryId: 7,
        statusId: 1,
      },
      {
        id: '3-4',
        order: 4,
        title: 'تاسیسات (برق، آب، گاز)',
        status: 'done',
        leftVariant: 'user',
        userInfo: {
          name: 'نسترن علی‌پور',
          label: 'انتصاب به کاربر:',
        },
        relationBadges: [
          {
            variant: 'blue',
            text: 'هم‌نیاز : تسک 3',
          },
        ],
        categoryId: 7,
        statusId: 1,
      },
      {
        id: '3-5',
        order: 5,
        title: 'نازک‌کاری (گچ، رنگ، پنجره، کف‌پوش)',
        status: 'done',
        leftVariant: 'tender',
        tenderInfo: {
          publishDateTime: 'تاریخ و زمان انتشار: 11:00 - 1404/02/29',
          title: 'ناظر ساخت ساختمان',
          label: 'مناقصه:',
          separator: '_',
        },
        relationBadges: [
          {
            variant: 'blue',
            text: 'هم‌نیاز : تسک 3',
          },
        ],
        categoryId: 7,
        statusId: 1,
      },
    ],
  },
  {
    id: 4,
    title: 'نهایی‌سازی',
    categoryId: 10,
    statusId: 1,
    tasks: [],
  },
];

export default function TemplateOverviewTestPage(_props?: TemplateOverviewTestPageProps) {
  const [expandedPhases, setExpandedPhases] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: true,
    4: false,
  });

  const togglePhase = (phaseNum: number) => {
    setExpandedPhases((prev) => ({
      ...prev,
      [phaseNum]: !prev[phaseNum],
    }));
  };

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <div className={styles.content}>

          {/* ---------- Header (Frame44 / Frame43 / Frame42 / Frame40 / NumberStats ...) ---------- */}
          <div className={headerStyles.headerCard}>
            <div className={headerStyles.headerContent}>
              <div className={headerStyles.title}>
                <p dir="auto">تمپلیت 1</p>
              </div>

              <div className={headerStyles.details}>

                {/* Frame40 */}
                <div className={headerStyles.infoRow}>
                  <div className={headerStyles.label}>
                    <p dir="auto">صندوق مربوطه</p>
                  </div>
                  <div className={headerStyles.value}>
                    <p dir="auto">صندوق مهربانی</p>
                  </div>
                </div>

                {/* NumberStatsChartsTotalOrder (Frame39 etc.) */}
                <div className={statsStyles.statsCard} data-name="Number Stats & Charts/Total order">
                  <div className={statsStyles.inner}>
                    <div className={statsStyles.content}>
                      <div className={statsStyles.statsRow}>
                        {/* Frame12 */}
                        <div className={statsStyles.statsAmount}>
                          <p className={statsStyles.amount} dir="auto">2,005,679,680</p>
                          <p className={statsStyles.currency} dir="auto">ریال</p>
                        </div>

                        {/* Frame11 (Left + Frame10) */}
                        <div className={statsStyles.statsLeft}>
                          <div className={statsStyles.statsInfo} data-name="Left">
                            <p className={statsStyles.statsTitle} dir="auto">صندوق معیشت</p>
                            <div className={statsStyles.statsUpdate} data-name="Data/Type 1">
                              <div className={statsStyles.updateText}>
                                <p dir="auto">بروزرسانی دوشنبه، ۲۰ مرداد</p>
                              </div>
                            </div>
                          </div>

                          <div className={statsStyles.statsIcon}>
                            <div className={statsStyles.iconText}>
                              <p dir="auto">معیشت</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Frame41 */}
                <div className={headerStyles.infoRow}>
                  <div className={headerStyles.label}>
                    <p dir="auto">تعداد فازها</p>
                  </div>
                  <div className={headerStyles.value}>
                    <p dir="auto">4 فاز</p>
                  </div>
                </div>

                {/* Description */}
                <div className={headerStyles.description}>
                  <p dir="auto">
                    لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* ---------- end header ---------- */}
          {/* ---------- Phases (rendered via module) ---------- */}
          <TemplatePhases phases={samplePhases} expandedPhases={expandedPhases} togglePhase={togglePhase} />
          {/* ---------- end Phases ---------- */}
          {/* Create Project Button (bottom) */}
          <div className={styles.createProjectButton}>
            <div className={styles.buttonOuter}>
              <div className={styles.buttonInner}>
                <div className={styles.buttonContent}>
                  <div className={styles.buttonPadding}>
                    <div className={styles.buttonTextWrapper}>
                      <div className={styles.buttonText}>
                        <p dir="auto">ایجاد پروژه</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

