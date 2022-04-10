import { Anchor } from "@mantine/core";
import React from "react";

interface Props {
  href: string;
}

const ExternalLink: React.FC<Props> = ({ href, children }) => {
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.fs.openLinkInBrowser(e.currentTarget.href);
  };

  return (
    <Anchor href={href} onClick={handleLinkClick}>
      {children}
    </Anchor>
  );
};

export default ExternalLink;
