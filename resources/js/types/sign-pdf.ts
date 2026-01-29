export type SignStep = 'upload' | 'sign' | 'signing' | 'download';

export type PdfInfo = {
  id: string;
  pageCount: number;
  width: number;
  height: number;
};

export type SignatureType = 'draw' | 'text' | 'date';

export type SignatureColor = '#000000' | '#4a4a4a' | '#1971c2' | '#c92a2a' | '#2f9e44';

export type SignatureData = {
  type: SignatureType;
  data: string;
  font?: string;
  color?: SignatureColor;
};

export type SignaturePosition = {
  x: number;
  y: number;
  width: number;
  height: number;
  page: number;
};

export type SignatureElement = {
  id: string;
  data: SignatureData;
  position: SignaturePosition;
};
