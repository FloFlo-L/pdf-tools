// resources/js/Components/Navbar.jsx
import { Title } from '@mantine/core';

export default function Navbar() {
  return (
    <div className="flex h-16 items-center justify-center bg-primary px-4">
      <Title order={1} style={{ color: 'white' }} size="h3">
        <a href="/">PDF Tools</a>
      </Title>
    </div>
  );
}
