import { ActionIcon, useComputedColorScheme, useMantineColorScheme } from "@mantine/core";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import cx from "clsx";

import classes from "@/styles/modules/ThemeToggle.module.css";

export const ThemeToggle = () => {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light", { getInitialValueInEffect: true });

  const toggleColorScheme = () => {
    setColorScheme(computedColorScheme === "dark" ? "light" : "dark");
  };

  return (
    <ActionIcon
      radius="xl"
      size="lg"
      variant="light"
      color="grape"
      onClick={() => toggleColorScheme()}
      aria-label="Toggle dark/light mode"
    >
      <SunIcon className={cx(classes.icon, classes.light)}/>
      <MoonIcon className={cx(classes.icon, classes.dark)}/>
    </ActionIcon>
  );
};
