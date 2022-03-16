import { Anchor } from "@mantine/core";
import React from "react";
import useKeyboardClick from "src/hooks/useKeyboardClick";

interface Props {
  href: string;
}

const ExternalLink: React.FC<Props> = ({ href, children }) => {
  const handleLinkClick = (anchor: HTMLAnchorElement) => {
    window.fs.openLinkInBrowser(anchor.href);
  };

  const keyboardClickEvents = useKeyboardClick(handleLinkClick, { preventDefault: true });

  return (
    <Anchor href={href} {...keyboardClickEvents}>
      {children}
    </Anchor>
  );
};

export default ExternalLink;
