import React from "react";

interface Props {
  text: string;
}

const Label: React.FC<Props> = ({ text }) => {
  return <label className="label">{text}</label>;
};

export default Label;
