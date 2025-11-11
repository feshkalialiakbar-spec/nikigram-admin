'use client';

import { useState } from 'react';
import svgPaths from "./imports/svg-x98sifuilj";
import styles from './styles/App.module.css';
import headerStyles from './styles/Header.module.css';
import statsStyles from './styles/Stats.module.css';
import phaseStyles from './styles/Phase.module.css';
import taskStyles from './styles/Task.module.css';
import badgeStyles from './styles/Badge.module.css';
import buttonStyles from './styles/AssignmentButtons.module.css';

type TemplateOverviewTestPageProps = {
  template?: unknown;
  templateOptions?: Array<{ id: string; title: string; fundName: string }>;
  selectedTemplateId?: string | null;
  listError?: string | null;
  detailError?: string | null;
};

export default function TemplateOverviewTestPage(_: TemplateOverviewTestPageProps) {
  const [expandedPhases, setExpandedPhases] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: true,
    4: false
  });

  const togglePhase = (phaseNum: number) => {
    setExpandedPhases(prev => ({
      ...prev,
      [phaseNum]: !prev[phaseNum]
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

          {/* ---------- Phases (all inline) ---------- */}
          {/* Phase 1 */}
          <div className={phaseStyles.phase}>
            <div className={phaseStyles.inner}>
              <div className={phaseStyles.content}>
                <div className={phaseStyles.phaseHeader}>
                  <button
                    onClick={() => togglePhase(1)}
                    className={`${phaseStyles.toggleButton} ${expandedPhases[1] ? phaseStyles.expanded : phaseStyles.collapsed}`}
                    data-name="vuesax/bulk/arrow-up"
                  >
                    <div className="absolute contents inset-0">
                      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                        <g id="arrow-up">
                          <path d={svgPaths.p9f39700} fill="var(--fill-0, #007BFF)" id="Vector" />
                          <path d={svgPaths.p369d6c00} fill="var(--fill-0, #007BFF)" id="Vector_2" opacity="0.4" />
                        </g>
                      </svg>
                    </div>
                  </button>

                  <div className={phaseStyles.phaseHeaderRight}>
                    <div className={phaseStyles.headerInfo}>
                      <p className={phaseStyles.phaseName} dir="auto">اجرای ساخت</p>
                      <p className={phaseStyles.phaseNumber} dir="auto">فاز 1:</p>
                      <div className={phaseStyles.phaseDot}>
                        <svg fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
                          <circle cx="4" cy="4" fill="var(--fill-0, #007BFF)" id="Ellipse 8" r="4" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {expandedPhases[1] && (
                  <div className={phaseStyles.phaseBody}>
                    <div className={phaseStyles.bodyInner}>
                      <div className={phaseStyles.tasks}>

                        {/* TaskRow 1 */}
                        <div className={taskStyles.taskRow}>
                          <div className={taskStyles.taskLeft}>
                            {/* showUser */}
                            <div data-name="Component 4">
                              <div className={taskStyles.editButton} data-name="vuesax/bulk/edit-2">
                                <div className="absolute contents inset-0">
                                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                                    <g id="edit-2">
                                      <path d={svgPaths.p3dd95700} fill="var(--fill-0, #007BFF)" id="Vector" opacity="0.4" />
                                      <path d={svgPaths.p33964d80} fill="var(--fill-0, #007BFF)" id="Vector_2" opacity="0.4" />
                                      <path d={svgPaths.p10a34900} fill="var(--fill-0, #007BFF)" id="Vector_3" />
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>

                            <div className={taskStyles.userInfo}>
                              <div className={taskStyles.userContainer} data-name="Container">
                                <div className={taskStyles.userName}>
                                  <p dir="auto">نسترن علی‌پور</p>
                                </div>
                                <div className={taskStyles.userImage} data-name="Image">
                                  <div className={taskStyles.imageBg} />
                                </div>
                              </div>
                              <p className={taskStyles.label} dir="auto">انتصاب به کاربر:</p>
                            </div>
                          </div>

                          <div className={taskStyles.taskRight}>
                            <div className={`${badgeStyles.badge} ${badgeStyles.blue}`} data-name="Badge">
                              <div className={badgeStyles.content}>
                                <div className={badgeStyles.text}><p dir="auto">هم‌نیاز : تسک 2</p></div>
                              </div>
                            </div>

                            <div className={taskStyles.taskInfo}>
                              <p className={taskStyles.taskName} dir="auto">خاک‌برداری و فونداسیون</p>
                              <p className={taskStyles.taskNumber} dir="auto">تسک 1:</p>
                            </div>

                            <div className={taskStyles.statusIcon}>
                              <div className={taskStyles.icon} data-name="vuesax/bulk/tick-square">
                                <div className="absolute contents inset-0">
                                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                                    <g id="tick-square">
                                      <path d={svgPaths.pd3eef80} fill="var(--fill-0, #28A745)" id="Vector" opacity="0.4" />
                                      <path d={svgPaths.p1b028e00} fill="var(--fill-0, #28A745)" id="Vector_2" />
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* TaskRow 1 end */}

                        {/* TaskRow 2 (showTender) */}
                        <div className={taskStyles.taskRow}>
                          <div className={taskStyles.taskLeft}>
                            <div data-name="Component 4">
                              <div className={taskStyles.editButton} data-name="vuesax/bulk/edit-2">
                                <div className="absolute contents inset-0">
                                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                                    <g id="edit-2">
                                      <path d={svgPaths.p3dd95700} fill="var(--fill-0, #007BFF)" id="Vector" opacity="0.4" />
                                      <path d={svgPaths.p33964d80} fill="var(--fill-0, #007BFF)" id="Vector_2" opacity="0.4" />
                                      <path d={svgPaths.p10a34900} fill="var(--fill-0, #007BFF)" id="Vector_3" />
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>

                            <div className={taskStyles.tenderInfo}>
                              <div className={taskStyles.tenderDetails}>
                                <p dir="auto">تاریخ و زمان انتشار: 11:00 - 1404/02/29</p>
                              </div>
                              <div className={taskStyles.separator}>
                                <p dir="auto">_</p>
                              </div>
                              <div className={taskStyles.tenderTitle}>
                                <p dir="auto">ناظر ساخت ساختمان</p>
                              </div>
                              <p className={taskStyles.label} dir="auto">مناقصه:</p>
                            </div>
                          </div>

                          <div className={taskStyles.taskRight}>
                            <div className={`${badgeStyles.badge} ${badgeStyles.blue}`} data-name="Badge">
                              <div className={badgeStyles.content}>
                                <div className={badgeStyles.text}><p dir="auto">هم‌نیاز : تسک 1</p></div>
                              </div>
                            </div>

                            <div className={taskStyles.taskInfo}>
                              <p className={taskStyles.taskName} dir="auto">نازک‌کاری (گچ، رنگ، پنجره، کف‌پوش)</p>
                              <p className={taskStyles.taskNumber} dir="auto">تسک 2:</p>
                            </div>

                            <div className={taskStyles.statusIcon}>
                              <div className={taskStyles.icon} data-name="vuesax/bulk/tick-square">
                                <div className="absolute contents inset-0">
                                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                                    <g id="tick-square">
                                      <path d={svgPaths.pd3eef80} fill="var(--fill-0, #28A745)" id="Vector" opacity="0.4" />
                                      <path d={svgPaths.p1b028e00} fill="var(--fill-0, #28A745)" id="Vector_2" />
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* TaskRow 2 end */}

                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Phase 2 */}
          <div className={phaseStyles.phase}>
            <div className={phaseStyles.inner}>
              <div className={phaseStyles.content}>
                <div className={phaseStyles.phaseHeader}>
                  <button
                    onClick={() => togglePhase(2)}
                    className={`${phaseStyles.toggleButton} ${expandedPhases[2] ? phaseStyles.expanded : phaseStyles.collapsed}`}
                    data-name="vuesax/bulk/arrow-up"
                  >
                    <div className="absolute contents inset-0">
                      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                        <g id="arrow-up">
                          <path d={svgPaths.p9f39700} fill="var(--fill-0, #007BFF)" id="Vector" />
                          <path d={svgPaths.p369d6c00} fill="var(--fill-0, #007BFF)" id="Vector_2" opacity="0.4" />
                        </g>
                      </svg>
                    </div>
                  </button>

                  <div className={phaseStyles.phaseHeaderRight}>
                    <div className={phaseStyles.headerInfo}>
                      <p className={phaseStyles.phaseName} dir="auto">گودبرداری</p>
                      <p className={phaseStyles.phaseNumber} dir="auto">فاز 2:</p>
                      <div className={phaseStyles.phaseDot}>
                        <svg fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
                          <circle cx="4" cy="4" fill="var(--fill-0, #007BFF)" r="4" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {expandedPhases[2] && (
                  <div className={phaseStyles.phaseBody}>
                    <div className={phaseStyles.bodyInner}>
                      <div className={phaseStyles.tasks}>

                        {/* TaskRow (showUser) */}
                        <div className={taskStyles.taskRow}>
                          <div className={taskStyles.taskLeft}>
                            <div data-name="Component 4">
                              <div className={taskStyles.editButton} data-name="vuesax/bulk/edit-2">
                                <div className="absolute contents inset-0">
                                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                                    <g id="edit-2">
                                      <path d={svgPaths.p3dd95700} fill="var(--fill-0, #007BFF)" id="Vector" opacity="0.4" />
                                      <path d={svgPaths.p33964d80} fill="var(--fill-0, #007BFF)" id="Vector_2" opacity="0.4" />
                                      <path d={svgPaths.p10a34900} fill="var(--fill-0, #007BFF)" id="Vector_3" />
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>

                            <div className={taskStyles.userInfo}>
                              <div className={taskStyles.userContainer} data-name="Container">
                                <div className={taskStyles.userName}>
                                  <p dir="auto">نسترن علی‌پور</p>
                                </div>
                                <div className={taskStyles.userImage} data-name="Image">
                                  <div className={taskStyles.imageBg} />
                                </div>
                              </div>
                              <p className={taskStyles.label} dir="auto">انتصاب به کاربر:</p>
                            </div>
                          </div>

                          <div className={taskStyles.taskRight}>
                            <div className={`${badgeStyles.badge} ${badgeStyles.blue}`} data-name="Badge">
                              <div className={badgeStyles.content}>
                                <div className={badgeStyles.text}><p dir="auto">هم‌نیاز : تسک 3</p></div>
                              </div>
                            </div>

                            <div className={taskStyles.taskInfo}>
                              <p className={taskStyles.taskName} dir="auto">خاک‌برداری و فونداسیون</p>
                              <p className={taskStyles.taskNumber} dir="auto">تسک 1:</p>
                            </div>

                            <div className={taskStyles.statusIcon}>
                              <div className={taskStyles.icon} data-name="vuesax/bulk/tick-square">
                                <div className="absolute contents inset-0">
                                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                                    <g id="tick-square">
                                      <path d={svgPaths.pd3eef80} fill="var(--fill-0, #28A745)" id="Vector" opacity="0.4" />
                                      <path d={svgPaths.p1b028e00} fill="var(--fill-0, #28A745)" id="Vector_2" />
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Inline AssignmentButtons + a custom task row */}
                        <div className={taskStyles.taskRow}>
                          <div className={buttonStyles.buttons}>
                            <div className={buttonStyles.button}>
                              <div className={buttonStyles.content}>
                                <div className={buttonStyles.textWrapper}>
                                  <div className={buttonStyles.text}>
                                    <p dir="auto">انتصاب به مناقصه</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className={buttonStyles.button}>
                              <div className={buttonStyles.content}>
                                <div className={buttonStyles.textWrapper}>
                                  <div className={buttonStyles.text}>
                                    <p dir="auto">انتصاب به کاربر</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className={taskStyles.taskRight}>
                            <div className={`${badgeStyles.badge} ${badgeStyles.blue}`} data-name="Badge">
                              <div className={badgeStyles.content}>
                                <div className={badgeStyles.text}><p dir="auto">هم‌نیاز : تسک 3</p></div>
                              </div>
                            </div>
                            <div className={`${badgeStyles.badge} ${badgeStyles.yellow}`} data-name="Badge">
                              <div className={badgeStyles.content}>
                                <div className={badgeStyles.text}><p dir="auto">پیش‌نیاز : تسک 1</p></div>
                              </div>
                            </div>

                            <div className={taskStyles.taskInfo}>
                              <p className={taskStyles.taskName} dir="auto">اسکلت‌بندی (بتنی یا فلزی)</p>
                              <p className={taskStyles.taskNumber} dir="auto">تسک 2:</p>
                            </div>

                            <div className={taskStyles.statusIcon}>
                              <div className={taskStyles.icon} data-name="vuesax/bulk/close-square">
                                <div className="absolute contents inset-0">
                                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                                    <g id="close-square">
                                      <path d={svgPaths.pd3eef80} fill="var(--fill-0, #E70218)" id="Vector" opacity="0.4" />
                                      <path d={svgPaths.p2bbbf000} fill="var(--fill-0, #E70218)" id="Vector_2" />
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* TaskRow 3 (showTender) */}
                        <div className={taskStyles.taskRow}>
                          <div className={taskStyles.taskLeft}>
                            <div data-name="Component 4">
                              <div className={taskStyles.editButton} data-name="vuesax/bulk/edit-2">
                                <div className="absolute contents inset-0">
                                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                                    <g id="edit-2">
                                      <path d={svgPaths.p3dd95700} fill="var(--fill-0, #007BFF)" id="Vector" opacity="0.4" />
                                      <path d={svgPaths.p33964d80} fill="var(--fill-0, #007BFF)" id="Vector_2" opacity="0.4" />
                                      <path d={svgPaths.p10a34900} fill="var(--fill-0, #007BFF)" id="Vector_3" />
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>

                            <div className={taskStyles.tenderInfo}>
                              <div className={taskStyles.tenderDetails}>
                                <p dir="auto">تاریخ و زمان انتشار: 11:00 - 1404/02/29</p>
                              </div>
                              <div className={taskStyles.separator}>
                                <p dir="auto">_</p>
                              </div>
                              <div className={taskStyles.tenderTitle}>
                                <p dir="auto">ناظر ساخت ساختمان</p>
                              </div>
                              <p className={taskStyles.label} dir="auto">مناقصه:</p>
                            </div>
                          </div>

                          <div className={taskStyles.taskRight}>
                            <div className={`${badgeStyles.badge} ${badgeStyles.blue}`} data-name="Badge">
                              <div className={badgeStyles.content}>
                                <div className={badgeStyles.text}><p dir="auto">هم‌نیاز : تسک 2</p></div>
                              </div>
                            </div>
                            <div className={`${badgeStyles.badge} ${badgeStyles.yellow}`} data-name="Badge">
                              <div className={badgeStyles.content}>
                                <div className={badgeStyles.text}><p dir="auto">پیش‌نیاز : تسک 1</p></div>
                              </div>
                            </div>

                            <div className={taskStyles.taskInfo}>
                              <p className={taskStyles.taskName} dir="auto">سفت‌کاری و دیوارچینی</p>
                              <p className={taskStyles.taskNumber} dir="auto">تسک 3:</p>
                            </div>

                            <div className={taskStyles.statusIcon}>
                              <div className={taskStyles.icon} data-name="vuesax/bulk/tick-square">
                                <div className="absolute contents inset-0">
                                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                                    <g id="tick-square">
                                      <path d={svgPaths.pd3eef80} fill="var(--fill-0, #28A745)" id="Vector" opacity="0.4" />
                                      <path d={svgPaths.p1b028e00} fill="var(--fill-0, #28A745)" id="Vector_2" />
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Phase 3 */}
          <div className={phaseStyles.phase}>
            <div className={phaseStyles.inner}>
              <div className={phaseStyles.content}>
                <div className={phaseStyles.phaseHeader}>
                  <button
                    onClick={() => togglePhase(3)}
                    className={`${phaseStyles.toggleButton} ${expandedPhases[3] ? phaseStyles.expanded : phaseStyles.collapsed}`}
                    data-name="vuesax/bulk/arrow-up"
                  >
                    <div className="absolute contents inset-0">
                      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                        <g id="arrow-up">
                          <path d={svgPaths.p9f39700} fill="var(--fill-0, #007BFF)" id="Vector" />
                          <path d={svgPaths.p369d6c00} fill="var(--fill-0, #007BFF)" id="Vector_2" opacity="0.4" />
                        </g>
                      </svg>
                    </div>
                  </button>

                  <div className={phaseStyles.phaseHeaderRight}>
                    <div className={phaseStyles.headerInfo}>
                      <p className={phaseStyles.phaseName} dir="auto">ساخت اسکلت</p>
                      <p className={phaseStyles.phaseNumber} dir="auto">فاز 3:</p>
                      <div className={phaseStyles.phaseDot}>
                        <svg fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
                          <circle cx="4" cy="4" fill="var(--fill-0, #007BFF)" r="4" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {expandedPhases[3] && (
                  <div className={phaseStyles.phaseBody}>
                    <div className={phaseStyles.bodyInner}>
                      <div className={phaseStyles.tasks}>

                        {/* TaskRow showTender */}
                        <div className={taskStyles.taskRow}>
                          <div className={taskStyles.taskLeft}>
                            <div data-name="Component 4">
                              <div className={taskStyles.editButton} data-name="vuesax/bulk/edit-2">
                                <div className="absolute contents inset-0">
                                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                                    <g id="edit-2">
                                      <path d={svgPaths.p3dd95700} fill="var(--fill-0, #007BFF)" id="Vector" opacity="0.4" />
                                      <path d={svgPaths.p33964d80} fill="var(--fill-0, #007BFF)" id="Vector_2" opacity="0.4" />
                                      <path d={svgPaths.p10a34900} fill="var(--fill-0, #007BFF)" id="Vector_3" />
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>

                            <div className={taskStyles.tenderInfo}>
                              <div className={taskStyles.tenderDetails}>
                                <p dir="auto">تاریخ و زمان انتشار: 11:00 - 1404/02/29</p>
                              </div>
                              <div className={taskStyles.separator}>
                                <p dir="auto">_</p>
                              </div>
                              <div className={taskStyles.tenderTitle}>
                                <p dir="auto">ناظر ساخت ساختمان</p>
                              </div>
                              <p className={taskStyles.label} dir="auto">مناقصه:</p>
                            </div>
                          </div>

                          <div className={taskStyles.taskRight}>
                            <div className={`${badgeStyles.badge} ${badgeStyles.blue}`} data-name="Badge">
                              <div className={badgeStyles.content}>
                                <div className={badgeStyles.text}><p dir="auto">هم‌نیاز : تسک 3</p></div>
                              </div>
                            </div>

                            <div className={taskStyles.taskInfo}>
                              <p className={taskStyles.taskName} dir="auto">خاک‌برداری و فونداسیون</p>
                              <p className={taskStyles.taskNumber} dir="auto">تسک 1:</p>
                            </div>

                            <div className={taskStyles.statusIcon}>
                              <div className={taskStyles.icon} data-name="vuesax/bulk/tick-square">
                                <div className="absolute contents inset-0">
                                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                                    <g id="tick-square">
                                      <path d={svgPaths.pd3eef80} fill="var(--fill-0, #28A745)" id="Vector" opacity="0.4" />
                                      <path d={svgPaths.p1b028e00} fill="var(--fill-0, #28A745)" id="Vector_2" />
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Inline AssignmentButtons + another custom row (like before) */}
                        <div className={taskStyles.taskRow}>
                          <div className={buttonStyles.buttons}>
                            <div className={buttonStyles.button}>
                              <div className={buttonStyles.content}>
                                <div className={buttonStyles.textWrapper}>
                                  <div className={buttonStyles.text}>
                                    <p dir="auto">انتصاب به مناقصه</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className={buttonStyles.button}>
                              <div className={buttonStyles.content}>
                                <div className={buttonStyles.textWrapper}>
                                  <div className={buttonStyles.text}>
                                    <p dir="auto">انتصاب به کاربر</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className={taskStyles.taskRight}>
                            <div className={`${badgeStyles.badge} ${badgeStyles.blue}`} data-name="Badge">
                              <div className={badgeStyles.content}>
                                <div className={badgeStyles.text}><p dir="auto">هم‌نیاز : تسک 3</p></div>
                              </div>
                            </div>
                            <div className={`${badgeStyles.badge} ${badgeStyles.yellow}`} data-name="Badge">
                              <div className={badgeStyles.content}>
                                <div className={badgeStyles.text}><p dir="auto">پیش‌نیاز : تسک 1</p></div>
                              </div>
                            </div>

                            <div className={taskStyles.taskInfo}>
                              <p className={taskStyles.taskName} dir="auto">اسکلت‌بندی (بتنی یا فلزی)</p>
                              <p className={taskStyles.taskNumber} dir="auto">تسک 2:</p>
                            </div>

                            <div className={taskStyles.statusIcon}>
                              <div className={taskStyles.icon} data-name="vuesax/bulk/close-square">
                                <div className="absolute contents inset-0">
                                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                                    <g id="close-square">
                                      <path d={svgPaths.pd3eef80} fill="var(--fill-0, #E70218)" id="Vector" opacity="0.4" />
                                      <path d={svgPaths.p2bbbf000} fill="var(--fill-0, #E70218)" id="Vector_2" />
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* TaskRow 3 */}
                        <div className={taskStyles.taskRow}>
                          <div className={taskStyles.taskLeft}>
                            <div data-name="Component 4">
                              <div className={taskStyles.editButton} data-name="vuesax/bulk/edit-2">
                                <div className="absolute contents inset-0">
                                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                                    <g id="edit-2">
                                      <path d={svgPaths.p3dd95700} fill="var(--fill-0, #007BFF)" id="Vector" opacity="0.4" />
                                      <path d={svgPaths.p33964d80} fill="var(--fill-0, #007BFF)" id="Vector_2" opacity="0.4" />
                                      <path d={svgPaths.p10a34900} fill="var(--fill-0, #007BFF)" id="Vector_3" />
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>

                            <div className={taskStyles.userInfo}>
                              <div className={taskStyles.userContainer} data-name="Container">
                                <div className={taskStyles.userName}>
                                  <p dir="auto">نسترن علی‌پور</p>
                                </div>
                                <div className={taskStyles.userImage} data-name="Image">
                                  <div className={taskStyles.imageBg} />
                                </div>
                              </div>
                              <p className={taskStyles.label} dir="auto">انتصاب به کاربر:</p>
                            </div>
                          </div>

                          <div className={taskStyles.taskRight}>
                            <div className={`${badgeStyles.badge} ${badgeStyles.blue}`} data-name="Badge">
                              <div className={badgeStyles.content}>
                                <div className={badgeStyles.text}><p dir="auto">هم‌نیاز : تسک 3</p></div>
                              </div>
                            </div>

                            <div className={taskStyles.taskInfo}>
                              <p className={taskStyles.taskName} dir="auto">سفت‌کاری و دیوارچینی</p>
                              <p className={taskStyles.taskNumber} dir="auto">تسک 3:</p>
                            </div>

                            <div className={taskStyles.statusIcon}>
                              <div className={taskStyles.icon} data-name="vuesax/bulk/tick-square">
                                <div className="absolute contents inset-0">
                                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                                    <g id="tick-square">
                                      <path d={svgPaths.pd3eef80} fill="var(--fill-0, #28A745)" id="Vector" opacity="0.4" />
                                      <path d={svgPaths.p1b028e00} fill="var(--fill-0, #28A745)" id="Vector_2" />
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* TaskRow 4 */}
                        <div className={taskStyles.taskRow}>
                          <div className={taskStyles.taskLeft}>
                            <div data-name="Component 4">
                              <div className={taskStyles.editButton} data-name="vuesax/bulk/edit-2">
                                <div className="absolute contents inset-0">
                                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                                    <g id="edit-2">
                                      <path d={svgPaths.p3dd95700} fill="var(--fill-0, #007BFF)" id="Vector" opacity="0.4" />
                                      <path d={svgPaths.p33964d80} fill="var(--fill-0, #007BFF)" id="Vector_2" opacity="0.4" />
                                      <path d={svgPaths.p10a34900} fill="var(--fill-0, #007BFF)" id="Vector_3" />
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>

                            <div className={taskStyles.userInfo}>
                              <div className={taskStyles.userContainer} data-name="Container">
                                <div className={taskStyles.userName}>
                                  <p dir="auto">نسترن علی‌پور</p>
                                </div>
                                <div className={taskStyles.userImage} data-name="Image">
                                  <div className={taskStyles.imageBg} />
                                </div>
                              </div>
                              <p className={taskStyles.label} dir="auto">انتصاب به کاربر:</p>
                            </div>
                          </div>

                          <div className={taskStyles.taskRight}>
                            <div className={`${badgeStyles.badge} ${badgeStyles.blue}`} data-name="Badge">
                              <div className={badgeStyles.content}>
                                <div className={badgeStyles.text}><p dir="auto">هم‌نیاز : تسک 3</p></div>
                              </div>
                            </div>

                            <div className={taskStyles.taskInfo}>
                              <p className={taskStyles.taskName} dir="auto">تاسیسات (برق، آب، گاز)</p>
                              <p className={taskStyles.taskNumber} dir="auto">تسک 4:</p>
                            </div>

                            <div className={taskStyles.statusIcon}>
                              <div className={taskStyles.icon} data-name="vuesax/bulk/tick-square">
                                <div className="absolute contents inset-0">
                                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                                    <g id="tick-square">
                                      <path d={svgPaths.pd3eef80} fill="var(--fill-0, #28A745)" id="Vector" opacity="0.4" />
                                      <path d={svgPaths.p1b028e00} fill="var(--fill-0, #28A745)" id="Vector_2" />
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* TaskRow 5 (showTender) */}
                        <div className={taskStyles.taskRow}>
                          <div className={taskStyles.taskLeft}>
                            <div data-name="Component 4">
                              <div className={taskStyles.editButton} data-name="vuesax/bulk/edit-2">
                                <div className="absolute contents inset-0">
                                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                                    <g id="edit-2">
                                      <path d={svgPaths.p3dd95700} fill="var(--fill-0, #007BFF)" id="Vector" opacity="0.4" />
                                      <path d={svgPaths.p33964d80} fill="var(--fill-0, #007BFF)" id="Vector_2" opacity="0.4" />
                                      <path d={svgPaths.p10a34900} fill="var(--fill-0, #007BFF)" id="Vector_3" />
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>

                            <div className={taskStyles.tenderInfo}>
                              <div className={taskStyles.tenderDetails}>
                                <p dir="auto">تاریخ و زمان انتشار: 11:00 - 1404/02/29</p>
                              </div>
                              <div className={taskStyles.separator}>
                                <p dir="auto">_</p>
                              </div>
                              <div className={taskStyles.tenderTitle}>
                                <p dir="auto">ناظر ساخت ساختمان</p>
                              </div>
                              <p className={taskStyles.label} dir="auto">مناقصه:</p>
                            </div>
                          </div>

                          <div className={taskStyles.taskRight}>
                            <div className={`${badgeStyles.badge} ${badgeStyles.blue}`} data-name="Badge">
                              <div className={badgeStyles.content}>
                                <div className={badgeStyles.text}><p dir="auto">هم‌نیاز : تسک 3</p></div>
                              </div>
                            </div>

                            <div className={taskStyles.taskInfo}>
                              <p className={taskStyles.taskName} dir="auto">نازک‌کاری (گچ، رنگ، پنجره، کف‌پوش)</p>
                              <p className={taskStyles.taskNumber} dir="auto">تسک 5:</p>
                            </div>

                            <div className={taskStyles.statusIcon}>
                              <div className={taskStyles.icon} data-name="vuesax/bulk/tick-square">
                                <div className="absolute contents inset-0">
                                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                                    <g id="tick-square">
                                      <path d={svgPaths.pd3eef80} fill="var(--fill-0, #28A745)" id="Vector" opacity="0.4" />
                                      <path d={svgPaths.p1b028e00} fill="var(--fill-0, #28A745)" id="Vector_2" />
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Phase 4 (collapsed by default) */}
          <div className={phaseStyles.phase}>
            <div className={phaseStyles.inner}>
              <div className={phaseStyles.content}>
                <div className={phaseStyles.phaseHeader}>
                  <button
                    onClick={() => togglePhase(4)}
                    className={`${phaseStyles.toggleButton} ${expandedPhases[4] ? phaseStyles.expanded : phaseStyles.collapsed}`}
                    data-name="vuesax/bulk/arrow-up"
                  >
                    <div className="absolute contents inset-0">
                      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                        <g id="arrow-up">
                          <path d={svgPaths.p9f39700} fill="var(--fill-0, #007BFF)" id="Vector" />
                          <path d={svgPaths.p369d6c00} fill="var(--fill-0, #007BFF)" id="Vector_2" opacity="0.4" />
                        </g>
                      </svg>
                    </div>
                  </button>

                  <div className={phaseStyles.phaseHeaderRight}>
                    <div className={phaseStyles.headerInfo}>
                      <p className={phaseStyles.phaseName} dir="auto">نهایی‌سازی</p>
                      <p className={phaseStyles.phaseNumber} dir="auto">فاز 4:</p>
                      <div className={phaseStyles.phaseDot}>
                        <svg fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
                          <circle cx="4" cy="4" fill="var(--fill-0, #007BFF)" r="4" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {expandedPhases[4] && (
                  <div className={phaseStyles.phaseBody}>
                    <div className={phaseStyles.bodyInner}>
                      <div className={phaseStyles.tasks}>
                        {/* empty or future tasks */}
                        <div />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
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
