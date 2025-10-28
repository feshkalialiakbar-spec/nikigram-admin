'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styles from './RatingSlider.module.scss';

export type RatingSliderProps = {
  min?: number; // default -5
  max?: number; // default 5
  step?: number; // default 1
  value?: number; // controlled value
  defaultValue?: number; // uncontrolled initial value
  onChange?: (value: number) => void;
  className?: string;
  disabled?: boolean;
};

const clamp = (val: number, min: number, max: number) => Math.min(max, Math.max(min, val));

const RatingSlider: React.FC<RatingSliderProps> = ({
  min = -5,
  max = 5,
  step = 1,
  value,
  defaultValue = 0,
  onChange,
  className,
  disabled = false
}) => {
  const isControlled = typeof value === 'number';
  const [internal, setInternal] = useState<number>(clamp(defaultValue, min, max));
  const current = isControlled ? (value as number) : internal;

  const range = max - min;
  const steps = useMemo(() => Array.from({ length: range + 1 }, (_, i) => min + i), [min, range]);

  const trackRef = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState(false);

  const percent = ((current - min) / (max - min)) * 100; // 0..100

  const setValue = useCallback(
    (newVal: number) => {
      const v = Math.round(clamp(newVal, min, max) / step) * step;
      if (!isControlled) setInternal(v);
      onChange?.(v);
    },
    [isControlled, max, min, onChange, step]
  );

  const positionToValue = useCallback(
    (clientX: number) => {
      const track = trackRef.current;
      if (!track) return current;
      const rect = track.getBoundingClientRect();
      const x = clamp(clientX - rect.left, 0, rect.width);
      const ratio = x / rect.width; // 0..1 LTR
      const raw = min + ratio * (max - min);
      return Math.round(raw / step) * step;
    },
    [current, max, min, step]
  );

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (disabled) return;
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
    setDragging(true);
    setValue(positionToValue(e.clientX));
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging || disabled) return;
    setValue(positionToValue(e.clientX));
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (disabled) return;
    setDragging(false);
    (e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId);
  };

  // keyboard
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      setValue(current - step);
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      setValue(current + step);
    } else if (e.key === 'Home') {
      e.preventDefault();
      setValue(min);
    } else if (e.key === 'End') {
      e.preventDefault();
      setValue(max);
    }
  };

  // keep internal in sync if controlled changes
  useEffect(() => {
    if (isControlled) setInternal(value as number);
  }, [isControlled, value]);

  const tooltip = String(current);

  return (
    <div className={`${styles.sliderWrap} ${className || ''}`}>
      <div
        ref={trackRef}
        className={styles.sliderTrack}
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={current}
        tabIndex={disabled ? -1 : 0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onKeyDown={onKeyDown}
      >
        <div className={styles.trackRed} />
        <div className={styles.trackGray} />
        <div className={styles.trackGreen} />
        <div className={styles.knob} style={{ left: `calc(${percent}% )` }}>
          <div className={styles.tooltip}><span>{tooltip}</span></div>
        </div>
        <div className={styles.marks}>
          {steps.map((s) => (
            <span key={s}>{s}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RatingSlider;


