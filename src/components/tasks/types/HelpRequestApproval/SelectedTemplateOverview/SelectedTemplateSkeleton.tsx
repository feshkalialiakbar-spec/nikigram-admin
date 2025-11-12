import type { FC } from 'react';
import styles from './styles/SelectedTemplateOverview.module.scss';
import headerStyles from '../../../../../app/test/styles/Header.module.css';

const placeholderPhases = Array.from({ length: 3 });

const SelectedTemplateSkeleton: FC = () => (
  <section className={styles.container}>
    <div className={styles.hero}>
      <div className={headerStyles.headerCard}>
        <div className={styles.skeletonTemplateCard} />
      </div>
    </div>
    <div className={styles.skeletonDescription} />
    <div className={styles.skeletonPhaseList}>
      {placeholderPhases.map((_, index) => (
        <div key={index} className={styles.skeletonPhase} />
      ))}
    </div>
  </section>
);

export default SelectedTemplateSkeleton;
