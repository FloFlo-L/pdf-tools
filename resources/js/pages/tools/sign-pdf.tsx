import { Title, Text } from '@mantine/core';
import { FaSignature } from 'react-icons/fa';

export default function SignPdf() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4">
      <div className="space-y-2 text-center">
        <Title order={2}>
          <FaSignature className="mr-2 inline" />
          Sign PDF
        </Title>
        <Text c="dimmed">Add your signature to any PDF document</Text>
      </div>
    </div>
  );
}
