import { Title } from '@mantine/core';
import { PiGithubLogo } from 'react-icons/pi';

export default function Footer() {
  return (
    <footer className="space-y-4 bg-primary px-4 py-4 text-center text-sm text-white">
      <Title order={4} className="text-primary-contrast" size="h4">
        PDF Tools
      </Title>
      <p>© {new Date().getFullYear()} PDF Tools. All rights reserved.</p>
      <p className="flex items-center justify-center gap-2">
        <PiGithubLogo className="text-xl" />
        Made by{' '}
        <a href="https://github.com/FloFlo-L/pdf-tools" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary-200">
          Florian Lescribaa
        </a>
      </p>
    </footer>
  );
}
