export type ConvertStep = 'upload' | 'preview' | 'converting' | 'download';

export type ConvertedFile = {
  id: string;
  type: 'png' | 'zip';
  filename: string;
};
