import { Paper } from "@mantine/core";
import React from "react";
import useBackgroundColor from "src/hooks/useBackgroundColor";

const MenuList: React.FC = ({ children }) => {
  return (
    <Paper
      className="menu-list"
      sx={(theme) => ({
        background: useBackgroundColor(theme, 1),
        borderRadius: 0,
      })}
    >
      {children}
    </Paper>
  );
};

export default MenuList;
