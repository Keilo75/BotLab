import React from "react";

interface Props {
  href: string;
  text: string;
}

const Link: React.FC<Props> = ({ href, text }) => {
  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement> | React.KeyboardEvent<HTMLAnchorElement>
  ) => {
    if (e.type === "click") {
      e.preventDefault();
      window.fs.openLinkInBrowser(e.currentTarget.href);
    }

    if (e.type === "keydown") {
      const key = (e as React.KeyboardEvent).key;
      if (key === "Enter" || key === " ") {
        e.preventDefault();
        window.fs.openLinkInBrowser(e.currentTarget.href);
      }
    }
  };

  return (
    <a className="link" href={href} onClick={handleLinkClick} onKeyDown={handleLinkClick}>
      {text}
    </a>
  );
};

export default Link;
