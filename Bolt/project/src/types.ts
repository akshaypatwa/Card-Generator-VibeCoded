export interface CardData {
  id: string;
  topic: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  tags: string[];
  details?: string; // Added optional details field
  label?: string;
}

export interface CardCollection {
  id: string;
  name: string;
  cards: CardData[];
  createdAt: string;
  updatedAt: string;
}
