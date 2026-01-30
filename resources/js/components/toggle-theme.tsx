import { ActionIcon, useMantineColorScheme } from '@mantine/core';
import { PiMoon, PiSun } from 'react-icons/pi';

export default function ToggleTheme() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <ActionIcon variant="subtle" color="white" onClick={toggleColorScheme} aria-label="Toggle color scheme" size="lg">
      {isDark ? <PiSun size={20} /> : <PiMoon size={20} />}
    </ActionIcon>
  );
}
