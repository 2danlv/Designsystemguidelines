import { useEffect, useRef } from "react";

type VideoBackgroundProps = {
  src: string;
  title: string;
  opacity?: number;
  poster?: string;
};

export function VideoBackground({ src, title, opacity = 1, poster }: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.load();
    void video.play().catch(() => undefined);
  }, [src]);

  return (
    <video
      ref={videoRef}
      src={src}
      poster={poster}
      title={title}
      className="absolute inset-0 h-full w-full object-cover"
      style={{ opacity }}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      controls={false}
      disablePictureInPicture
      controlsList="nodownload noplaybackrate nofullscreen"
      tabIndex={-1}
      aria-hidden="true"
    />
  );
}
