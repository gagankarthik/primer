"use client";

import { useState } from "react";
import { Card } from "@/components/app/Page";
import { Row, Switch } from "@/components/parent/Layout";

/**
 * The switchable half of platform settings. Local state until the API lands.
 *
 * Every row here changes a default, never an individual family's setting. The
 * rule the page follows: if a household could reasonably want it different, it
 * does not belong on this screen.
 */
export function AdminSettingsPanels() {
  const [openSignup, setOpenSignup] = useState(true);
  const [creatorApps, setCreatorApps] = useState(false);
  const [autoPublish, setAutoPublish] = useState(false);
  const [strictFlags, setStrictFlags] = useState(true);

  return (
    <>
      <Card
        title="Who can join"
        blurb="Sign-up is open to parents by default. Creators are invited, not applied for, until there are enough reviewers to read what they submit."
      >
        <Row
          label="Open parent sign-up"
          hint="Turning this off puts new households on a waiting list rather than showing an error."
        >
          <Switch
            checked={openSignup}
            onChange={setOpenSignup}
            label="Open parent sign-up"
          />
        </Row>
        <Row
          label="Accept creator applications"
          hint="Off. Review capacity is the constraint, and a queue nobody reads is worse than a closed door."
        >
          <Switch
            checked={creatorApps}
            onChange={setCreatorApps}
            label="Accept creator applications"
          />
        </Row>
      </Card>

      <Card
        title="Review and safety"
        blurb="How cautious the platform is by default."
      >
        <Row
          label="Publish approved modules automatically"
          hint="Off deliberately. Approval and publication are two decisions, and keeping them apart is what lets a reviewer approve at 6pm without shipping at 6pm."
        >
          <Switch
            checked={autoPublish}
            onChange={setAutoPublish}
            label="Publish approved modules automatically"
          />
        </Row>
        <Row
          label="Flag on ambiguity"
          hint="On. Raises more false positives on purpose. A queue with nothing to clear is a classifier that has stopped catching things."
        >
          <Switch
            checked={strictFlags}
            onChange={setStrictFlags}
            label="Flag on ambiguity"
          />
        </Row>
      </Card>
    </>
  );
}
