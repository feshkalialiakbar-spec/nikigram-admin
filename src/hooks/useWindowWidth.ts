import { useState, useEffect } from "react";

/**
 * مقدار اولیه همیشه 375 (mobile) است.
 * بعد از mount شدن کلاینت، مقدار window.innerWidth واقعی ست می‌شود.
 * hydrated: true یعنی روی کلاینت هستیم و مقدار width واقعی است.
 */
export default function useWindowWidth(defaultWidth = 375) {
  // اگر SSR هست، window وجود ندارد و مقدار پیش‌فرض استفاده می‌شود.
  const isSSR = typeof window === "undefined";
  const [width, setWidth] = useState(isSSR ? defaultWidth : window.innerWidth);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // اگر SSR است، هیچ کاری نکن.
    if (isSSR) return;

    // mount شدیم: مقدار واقعی را ست کن.
    setWidth(window.innerWidth);
    setHydrated(true);

    // listener برای تغییر سایز
    const handleResize = () => setWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isSSR]);

  return { width, hydrated };
}