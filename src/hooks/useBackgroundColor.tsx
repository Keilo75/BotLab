import { MantineTheme } from "@mantine/core";

const useBackgroundColor = (theme: MantineTheme, level?: number) => {
  const additional = level || 0;
  return theme.colorScheme === "dark"
    ? theme.colors.dark[8 + additional]
    : theme.colors.gray[1 + additional];
};

export default useBackgroundColor;
