import { Group, Text } from '@mantine/core';
import type { DropzoneProps } from '@mantine/dropzone';
import { Dropzone, PDF_MIME_TYPE } from '@mantine/dropzone';
import { PiFilePdf, PiUpload, PiX } from 'react-icons/pi';

export default function DropZone(props: Partial<DropzoneProps>) {
  return (
    <Dropzone
      loading={false}
      onDrop={(files) => console.log('accepted files', files)}
      onReject={(files) => console.log('rejected files', files)}
      maxSize={50 * 1024 ** 2}
      accept={PDF_MIME_TYPE}
      {...props}
    >
      <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: 'none' }}>
        <Dropzone.Accept>
          <PiUpload size={52} color="var(--mantine-color-blue-6)" />
        </Dropzone.Accept>
        <Dropzone.Reject>
          <PiX size={52} color="var(--mantine-color-red-6)" />
        </Dropzone.Reject>
        <Dropzone.Idle>
          <PiFilePdf size={52} color="var(--mantine-color-dimmed)" />
        </Dropzone.Idle>

        <div>
          <Text size="xl" inline>
            Drag PDF here or click to select file
          </Text>
          <Text size="sm" c="dimmed" inline mt={7}>
            File should not exceed 50mb
          </Text>
        </div>
      </Group>
    </Dropzone>
  );
}
