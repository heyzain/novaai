"use client";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

export function UserProfileHeader({
  name = "Emma Grace",
  plan = "Free",
  avatarSrc = "/avatars/emma-grace.png",
  onGift,
}: {
  name?: string;
  plan?: string;
  avatarSrc?: string;
  onGift?: () => void;
}) {
  return (
    <div className="nova-profile-header">
      <Avatar
        src={avatarSrc}
        alt={name}
        initials={name
          .split(" ")
          .map((part) => part[0])
          .slice(0, 2)
          .join("")}
      />
      <div className="nova-profile-copy">
        <strong>{name}</strong>
        <span>{plan}</span>
      </div>
      <Button className="nova-profile-gift" onClick={onGift}>
        <Icon name="gift" />
        Gift Offer
      </Button>
    </div>
  );
}
