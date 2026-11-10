import Image from "next/image";

export function Avatar({
  initials = "EG",
  size = "md",
  src,
  alt = `${initials} avatar`,
}: {
  initials?: string;
  size?: "sm" | "md";
  src?: string;
  alt?: string;
}) {
  return (
    <span
      className={`nova-avatar nova-avatar--${size}`}
      role={src ? undefined : "img"}
      aria-label={src ? undefined : alt}
    >
      {src ? <Image src={src} alt={alt} width={84} height={84} /> : initials}
    </span>
  );
}
