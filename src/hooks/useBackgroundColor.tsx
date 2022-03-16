import { MantineTheme } from "@mantine/core";

const useBackgroundColor = (theme: MantineTheme) => {
  return theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[1];
};

export default useBackgroundColor;
