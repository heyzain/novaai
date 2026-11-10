import Image from "next/image";
import { APP_BRAND } from "@/config/app-brand";

export function AppLogo({
  size = 44,
  alt = APP_BRAND.name,
}: {
  size?: number;
  alt?: string;
}) {
  return (
    <span className="nova-mark" style={{ width: size, height: size }}>
      <Image
        className="nova-mark-image"
        src={APP_BRAND.icon.src}
        width={size}
        height={size}
        sizes={`${size}px`}
        alt={alt}
        title={APP_BRAND.icon.name}
      />
    </span>
  );
}
