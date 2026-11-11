import type { CSSProperties, HTMLAttributes } from "react";
import { Icon, type IconName } from "./icon";

export type IconTileProps = Omit<HTMLAttributes<HTMLSpanElement>, "color"> & {
  name: IconName;
  size?: number;
  iconScale?: number;
  variant?: "primary" | "secondary";
  iconColor?: string;
  strokeWidth?: number;
  background?: string;
  radius?: number;
};

/** Decorative preview of the same material used by IconButton. */
export function IconTile({
  name,
  size = 52,
  iconScale,
  variant = "secondary",
  iconColor = "currentColor",
  strokeWidth = 1.5,
  background,
  radius,
  className = "",
  style,
  ...props
}: IconTileProps) {
  const scale = iconScale ?? (name === "send-solid" ? 0.515 : 24 / 52);
  return (
    <span
      {...props}
      className={`nova-icon-tile nova-icon-tile--${variant} ${className}`}
      style={
        {
          "--nova-icon-button-size": `${size}px`,
          color: iconColor,
          ...(background ? { background } : {}),
          ...(radius !== undefined ? { borderRadius: size * radius } : {}),
          ...style,
        } as CSSProperties
      }
    >
      <Icon name={name} size={size * scale} strokeWidth={strokeWidth} />
    </span>
  );
}
