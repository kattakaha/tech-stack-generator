"use client";

import Image from "next/image";

export default function SkillIcons({ src }: { src: string }) {
  return (
    <Image
      src={src}
      width={100}
      height={100}
      alt="技術スタックアイコン"
      className="m-auto w-auto h-auto"
    />
  );
}
