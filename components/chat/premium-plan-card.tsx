"use client";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

export function PremiumPlanCard({ onUpgrade }: { onUpgrade: () => void }) {
  return (
    <div className="nova-premium-shell">
      <section className="nova-premium" aria-label="Premium Plan">
        <div className="nova-premium-title">
          <span
            className="nova-icon-button nova-icon-button--primary nova-crown"
            aria-hidden="true"
          >
            <Icon name="crown-solid" />
          </span>
          <strong>Premium Plan</strong>
        </div>
        <p className="nova-premium-description">
          Unlock advanced AI tools
          <br />
          and features.
        </p>
        <Button variant="primary" onClick={onUpgrade}>
          Upgrade Now
        </Button>
      </section>
    </div>
  );
}
