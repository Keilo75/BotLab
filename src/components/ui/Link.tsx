import React from "react";
import useKeyboardClick from "src/hooks/useKeyboardClick";

interface Props {
  href: string;
  text: string;
}

const Link: React.FC<Props> = ({ href, text }) => {
  const handleLinkClick = (anchor: HTMLAnchorElement) => {
    window.fs.openLinkInBrowser(anchor.href);
  };

  const keyboardClickEvents = useKeyboardClick(handleLinkClick, { preventDefault: true });

  return (
    <a className="link" href={href} {...keyboardClickEvents}>
      {text}
    </a>
  );
};

export default Link;
