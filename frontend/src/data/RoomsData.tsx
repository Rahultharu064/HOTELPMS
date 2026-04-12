export interface Room {
  id: number;
  title: string;
  price: number;
  description: string;
  shortDescription: string;
  images: string[];
  videoUrl?: string;
  facilities: string[];
  type: 'deluxe' | 'executive' | 'presidential' | 'standard';
  capacity: number;
  size: number;
  bedType: string;
}

export const RoomsData: Room[] = [
  {
    id: 1,
    title: 'Deluxe Suite',
    price: 129,
    description: 'Experience luxury in our spacious Deluxe Suite, featuring modern amenities, a comfortable king-size bed, and stunning city views. Perfect for both business and leisure travelers.',
    shortDescription: 'Spacious suite with city view and modern amenities',
    images: [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39',
    ],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    facilities: ['WiFi', 'TV', 'AC', 'Mini Bar', 'Room Service'],
    type: 'deluxe',
    capacity: 2,
    size: 45,
    bedType: 'King Size Bed',
  },
  {
    id: 2,
    title: 'Executive Room',
    price: 159,
    description: 'Our Executive Room offers the perfect blend of comfort and productivity. Featuring a dedicated workspace, premium bedding, and access to our executive lounge.',
    shortDescription: 'Modern design with premium comfort and workspace',
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39',
    ],
    facilities: ['WiFi', 'TV', 'AC', 'Work Desk', 'Executive Lounge Access'],
    type: 'executive',
    capacity: 2,
    size: 55,
    bedType: 'Queen Size Bed',
  },
  {
    id: 3,
    title: 'Presidential Suite',
    price: 299,
    description: 'Indulge in the ultimate luxury with our Presidential Suite. Featuring a private terrace, jacuzzi, separate living area, and panoramic views of the city.',
    shortDescription: 'Ultimate luxury with private terrace and jacuzzi',
    images: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39',
    ],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    facilities: ['WiFi', 'TV', 'AC', 'Jacuzzi', 'Private Terrace', 'Butler Service'],
    type: 'presidential',
    capacity: 4,
    size: 120,
    bedType: 'King Size Bed + Sofa Bed',
  },
  {
    id: 4,
    title: 'Standard Room',
    price: 89,
    description: 'Comfortable and cozy standard room perfect for solo travelers or couples. Includes all essential amenities for a pleasant stay.',
    shortDescription: 'Cozy and comfortable room with essential amenities',
    images: [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427',
    ],
    facilities: ['WiFi', 'TV', 'AC', 'Basic Amenities'],
    type: 'standard',
    capacity: 2,
    size: 30,
    bedType: 'Double Bed',
  },
];