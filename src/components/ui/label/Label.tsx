import { Text, TextProps } from "@mantine/core";
import React from "react";

const Label: React.FC<TextProps<"div">> = (props) => {
  const { children, ...other } = props;

  return (
    <Text size="sm" weight={500} {...other}>
      {children}
    </Text>
  );
};

export default Label;
