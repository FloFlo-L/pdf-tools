import { Title } from '@mantine/core';
import ToggleLanguage from './toggle-language';
import ToggleTheme from './toggle-theme';

export default function Navbar() {
  return (
    <div className="flex h-16 items-center bg-primary px-4">
      <div className="mx-auto flex w-full max-w-6xl justify-between">
        <ToggleLanguage />
        <Title order={1} style={{ color: 'white' }} size="h3">
          <a href="/">PDF Tools</a>
        </Title>
        <ToggleTheme />
      </div>
    </div>
  );
}
