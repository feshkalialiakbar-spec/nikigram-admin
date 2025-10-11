"use client"; 
import styles from "./index.module.css";

interface HoverRevealProps {
  imageFront: string; // عکس اصلی (کامل همیشه دیده میشه)
  imageBack: string;  // عکس زیری که فقط روی هاور دیده میشه
  slices?: number;
  width?: string;
  height?: string;
}

const HoverReveal: React.FC<HoverRevealProps> = ({
  imageFront,
  imageBack,
  slices = 50,
  width = "100%",
  height = "600px",
}) => {
  return (
    <div
      className={styles.wrapper}
      style={{
        backgroundImage: `url(${imageFront})`, // عکس رویی کامل
        width,
        height,
      }}
    >
      {Array.from({ length: slices }).map((_, i) => (
        <div
          key={i}
          className={styles.slice}
          style={{
            backgroundImage: `url(${imageBack})`, // عکس زیری روی slice
            backgroundPosition: `${(i / (slices - 1)) * 100}% 50%`,
            backgroundSize: `${slices * 100}% auto`, // خیلی مهم برای هماهنگی
            width: `calc(${width} / ${slices})`,
          }}
        />
      ))}
    </div>
  );
};



export default function Page() {
    return (
        <main style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <HoverReveal
                imageFront="https://unsplash.it/1200/800?image=1080"
                imageBack="https://unsplash.it/1200/800?image=1074"
                slices={10}
                width="1200px"
                height="600px"
            />
        </main>
    );
}

// export default HoverReveal;