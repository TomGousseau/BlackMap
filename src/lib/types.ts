export interface LocationData {
  id: string;
  name: string;
  lat: number;
  lng: number;
  category?: string;
  rating?: number;
  reviews?: ReviewData[];
  imageUrl?: string;
  description?: string;
  featured?: boolean;
  important?: boolean; // Purple pin - for future use
  ownerId?: string; // Owner cannot review their own business
  createdAt?: string; // ISO timestamp - can delete within 10 min
  views?: number;
}

export interface ReviewData {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
  imageUrl?: string;
}

export interface BusinessProfile {
  id: string;
  name: string;
  website?: string;
  imageUrl?: string;
  description?: string;
  category?: string;
  reputation: number; // 0-5
  reviews: BusinessReview[];
  createdAt: string;
}

export interface BusinessReview {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
}
