import type { Metadata } from "next";
import { DesignSystemShowcase } from "@/components/design-system/design-system-showcase";
import "@/design-system/showcase.css";

export const metadata: Metadata = {
  title: "Nova — Design system",
  description: "Nova foundations, components, and interface patterns.",
};

export default function DesignSystemPage() {
  return <DesignSystemShowcase />;
}
