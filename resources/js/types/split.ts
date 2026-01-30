export type SplitStep = 'upload' | 'configure' | 'splitting' | 'download';

export type PageRange = {
  id: string;
  from: number;
  to: number;
};

export type SplitResult = {
  id: string;
  type: 'pdf' | 'zip';
  filename: string;
  files: string[];
};
