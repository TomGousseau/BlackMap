import type { LocationData } from "./types";

export const FEATURED_LOCATIONS: LocationData[] = [
  // Israel
  {
    id: "jerusalem",
    name: "Jerusalem Old City",
    lat: 31.7767,
    lng: 35.2345,
    category: "Historic",
    rating: 4.9,
    imageUrl: "https://images.unsplash.com/photo-1547483238-2cbf881a559f?w=400&h=250&fit=crop",
    description: "Ancient walled city with sacred sites for three major religions",
    featured: true,
    views: 28400,
    reviews: [
      { id: "r1", author: "Sarah M.", rating: 5, text: "Absolutely breathtaking. The history here is unmatched.", date: "2026-02-15" },
      { id: "r2", author: "David K.", rating: 5, text: "A must-visit destination. Incredible atmosphere.", date: "2026-01-20" },
    ],
  },
  {
    id: "tel-aviv",
    name: "Tel Aviv Beach",
    lat: 32.0853,
    lng: 34.7818,
    category: "Beach",
    rating: 4.7,
    imageUrl: "https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=400&h=250&fit=crop",
    description: "Vibrant Mediterranean beachfront with incredible nightlife",
    featured: true,
    views: 22100,
    reviews: [
      { id: "r3", author: "Emma L.", rating: 5, text: "Best beach city in the Middle East!", date: "2026-02-28" },
    ],
  },
  {
    id: "dead-sea",
    name: "Dead Sea",
    lat: 31.5,
    lng: 35.5,
    category: "Nature",
    rating: 4.8,
    imageUrl: "https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=400&h=250&fit=crop",
    description: "The lowest point on Earth — float effortlessly in mineral-rich waters",
    featured: true,
    views: 19800,
    reviews: [
      { id: "r4", author: "Michael R.", rating: 5, text: "Surreal experience floating in the water.", date: "2026-03-01" },
    ],
  },
  {
    id: "masada",
    name: "Masada Fortress",
    lat: 31.3156,
    lng: 35.3536,
    category: "Historic",
    rating: 4.8,
    imageUrl: "https://images.unsplash.com/photo-1580834341580-8c17a3a630ca?w=400&h=250&fit=crop",
    description: "Ancient hilltop fortress with stunning desert views",
    featured: true,
    views: 15600,
  },
  // Switzerland — GOLD FEATURED
  {
    id: "zurich",
    name: "Zürich",
    lat: 47.3769,
    lng: 8.5417,
    category: "City",
    rating: 4.9,
    imageUrl: "https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=400&h=250&fit=crop",
    description: "Switzerland's largest city — finance, culture, lake views",
    featured: true,
    views: 34200,
    reviews: [
      { id: "r5", author: "Oliver S.", rating: 5, text: "Cleanest city I've ever visited. The lake is gorgeous.", date: "2026-02-10" },
      { id: "r6", author: "Sophia W.", rating: 5, text: "Perfect blend of modern and traditional Swiss culture.", date: "2026-01-25" },
    ],
  },
  {
    id: "zermatt",
    name: "Zermatt & Matterhorn",
    lat: 46.0207,
    lng: 7.7491,
    category: "Mountain",
    rating: 5.0,
    imageUrl: "https://images.unsplash.com/photo-1529983399047-b0fdaccbc3d9?w=400&h=250&fit=crop",
    description: "Iconic alpine village at the foot of the Matterhorn",
    featured: true,
    views: 41500,
    reviews: [
      { id: "r7", author: "James B.", rating: 5, text: "The Matterhorn at sunrise is life-changing.", date: "2026-03-05" },
    ],
  },
  {
    id: "interlaken",
    name: "Interlaken",
    lat: 46.6863,
    lng: 7.8632,
    category: "Adventure",
    rating: 4.9,
    imageUrl: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=400&h=250&fit=crop",
    description: "Adventure capital of Switzerland between two alpine lakes",
    featured: true,
    views: 29700,
  },
  {
    id: "lucerne",
    name: "Lucerne",
    lat: 47.0502,
    lng: 8.3093,
    category: "City",
    rating: 4.8,
    imageUrl: "https://images.unsplash.com/photo-1527668752968-14dc70a27c95?w=400&h=250&fit=crop",
    description: "Medieval architecture on a pristine alpine lake",
    featured: true,
    views: 26300,
  },
  {
    id: "geneva",
    name: "Geneva",
    lat: 46.2044,
    lng: 6.1432,
    category: "City",
    rating: 4.7,
    imageUrl: "https://images.unsplash.com/photo-1573108037329-37aa135a142e?w=400&h=250&fit=crop",
    description: "International hub on Lake Geneva with the famous Jet d'Eau",
    featured: true,
    views: 31000,
  },
  {
    id: "st-moritz",
    name: "St. Moritz",
    lat: 46.4908,
    lng: 9.8355,
    category: "Luxury",
    rating: 4.9,
    imageUrl: "https://images.unsplash.com/photo-1548777123-e216912df7d8?w=400&h=250&fit=crop",
    description: "Legendary alpine luxury resort and winter sports destination",
    featured: true,
    views: 23800,
  },
  // Madrid
  {
    id: "madrid-centro",
    name: "Madrid Centro",
    lat: 40.4168,
    lng: -3.7038,
    category: "City",
    rating: 4.7,
    imageUrl: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400&h=250&fit=crop",
    description: "Spain's vibrant capital — art, food, and golden sunsets",
    featured: true,
    views: 27500,
    reviews: [
      { id: "r8", author: "Carlos M.", rating: 5, text: "The heart of Spain! Incredible tapas everywhere.", date: "2026-02-20" },
    ],
  },
];

export const POPULAR_SEARCHES = [
  "Zürich, Switzerland",
  "Jerusalem, Israel",
  "Zermatt, Switzerland",
  "Tel Aviv, Israel",
  "Geneva, Switzerland",
  "Madrid, Spain",
  "Interlaken, Switzerland",
  "Dead Sea, Israel",
  "Lucerne, Switzerland",
  "St. Moritz, Switzerland",
];

// Israel center
export const REGION_ISRAEL: [number, number] = [31.5, 34.85];
// Switzerland center
export const REGION_SWITZERLAND: [number, number] = [46.8, 8.2];
// Madrid
export const REGION_MADRID: [number, number] = [40.4168, -3.7038];
// Default: overview Europe/Middle East
export const DEFAULT_CENTER: [number, number] = [40.0, 20.0];
export const DEFAULT_ZOOM = 5;
