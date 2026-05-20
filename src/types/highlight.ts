export type HighlightDTO = {
  id: number;
  title: string;
  description: string | null;
  imageUrl: string;
  buttonText: string | null;
  buttonLink: string | null;
  active: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
};

export type PublicHighlightDTO = {
  id: number;
  title: string;
  description: string | null;
  imageUrl: string;
  buttonText: string | null;
  buttonLink: string | null;
};
