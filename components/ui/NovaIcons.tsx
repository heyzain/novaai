import type { CSSProperties, HTMLAttributes, SVGProps } from "react";
import { Icon } from "./icon";
import { IconTile } from "./icon-tile";
import { iconAliases } from "./icon-catalog";
import { APP_BRAND } from "@/config/app-brand";
import { AppLogo } from "@/components/branding/app-logo";

/** Compatibility facade for the supplied icon names; geometry is shared with the UI. */
export const iconNames = [
  "nova",
  ...Object.keys(iconAliases),
] as readonly NovaIconName[];
export type NovaIconName = "nova" | keyof typeof iconAliases;
export interface NovaIconProps extends Omit<
  SVGProps<SVGSVGElement>,
  "color" | "name"
> {
  name: NovaIconName;
  size?: number | string;
  color?: string;
  strokeWidth?: number;
  title?: string;
  /** Accepted for compatibility. Filled-symbol cutouts are now transparent. */
  cutoutColor?: string;
}

export function NovaIcon({
  name,
  size = 24,
  color = "currentColor",
  strokeWidth = 1.5,
  title,
  cutoutColor,
  style,
  ...props
}: NovaIconProps) {
  void cutoutColor;
  if (name === "nova")
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        aria-hidden={
          title || props["aria-label"] || props["aria-labelledby"]
            ? undefined
            : true
        }
        role={title ? "img" : undefined}
        aria-label={title}
        focusable="false"
        style={{ flexShrink: 0, ...style }}
        {...props}
      >
        {title && <title>{title}</title>}
        <image href={APP_BRAND.icon.src} width="24" height="24" />
      </svg>
    );
  return (
    <Icon
      name={iconAliases[name]}
      size={size}
      color={color}
      strokeWidth={strokeWidth}
      title={title}
      style={{ flexShrink: 0, ...style }}
      {...props}
    />
  );
}

export interface NovaIconTileProps extends Omit<
  HTMLAttributes<HTMLSpanElement>,
  "color"
> {
  name: NovaIconName;
  size?: number;
  iconScale?: number;
  variant?: "blue" | "dark";
  iconColor?: string;
  strokeWidth?: number;
  background?: string;
  radius?: number;
}
export function NovaIconTile({
  name,
  size = 52,
  variant = "dark",
  style,
  ...props
}: NovaIconTileProps) {
  if (name === "nova") {
    const {
      iconScale,
      iconColor,
      strokeWidth,
      background,
      radius,
      ...spanProps
    } = props;
    void iconScale;
    void iconColor;
    void strokeWidth;
    void background;
    void radius;
    return (
      <span
        {...spanProps}
        style={
          {
            display: "inline-flex",
            width: size,
            height: size,
            flexShrink: 0,
            ...style,
          } as CSSProperties
        }
      >
        <AppLogo size={size} />
      </span>
    );
  }
  return (
    <IconTile
      name={iconAliases[name]}
      size={size}
      variant={variant === "blue" ? "primary" : "secondary"}
      style={style}
      {...props}
    />
  );
}
export default NovaIcon;
