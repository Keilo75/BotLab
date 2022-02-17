import React from "react";
import Container from "src/components/ui/Container";
import Link from "src/components/ui/Link";

interface Props {}

const Settings: React.FC<Props> = ({}) => {
  return (
    <div>
      <Container type="info">
        Use this page to register your bots settings. If you have not done so yet, create a new Bot
        Account in the{" "}
        <Link href="https://discord.com/developers/applications" text="Discord Developer Portal" />.
      </Container>
    </div>
  );
};

export default Settings;
