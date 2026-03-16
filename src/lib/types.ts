export interface LocationData {
  id: string;
  name: string;
  lat: number;
  lng: number;
  category?: string;
  rating?: number;
  reviews?: ReviewData[];
  imageUrl?: string;
  imageUrls?: string[]; // Multiple images - for gallery
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
  approved?: boolean; // Needs admin approval
  important?: boolean; // Purple badge - set by admin
}

export interface BusinessReview {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
}

export interface PersonData {
  id: string;
  name: string;
  lat: number;
  lng: number;
  imageUrl?: string;
  imageUrls?: string[]; // Multiple images for gallery
  about?: string;
  reason?: string;
  notableAction?: string;
  workedFor?: string;
  relations?: { name: string; imageUrl?: string }[]; // Related people with optional picture
  age?: string;
  // Social links
  discord?: string; // Discord username
  youtube?: string; // YouTube channel URL
  discordId?: string; // Discord user ID
  phone?: string; // Phone number
  telegram?: string; // Telegram @ username
  telegramId?: string; // Telegram user ID
  vk?: string; // VK profile URL
  github?: string; // GitHub username
  steam?: string; // Steam profile URL
  website?: string; // Personal website
  nationality?: string; // Nationality
  createdAt?: string;
  approved?: boolean;
  important?: boolean;
  verified?: boolean; // Admin-verified person
  rating?: number; // Admin quality rating (1-5)
  reviews?: ReviewData[];
  status?: 'Updated' | 'Terminated' | 'Outdated'; // Page status set by owner during modification
  ownerId?: string; // Owner can modify their own person page
  signature?: string; // Creator signature (max 20 chars)
}
