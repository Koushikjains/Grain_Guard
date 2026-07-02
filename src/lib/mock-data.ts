export const mockUsers = [
  { id: 'OW-KSWC01', name: 'Karnataka State Warehousing Corp', role: 'owner', phone: '9988776655' },
  { id: 'OW-CKN002', name: 'CKN Logistics & Cold Storage', role: 'owner', phone: '9988776644' },
  { id: 'OW-KALE03', name: 'Kalegowda Enterprises', role: 'owner', phone: '9988776633' },
  { id: 'FA-KOUS99', name: 'Koushik Jain', role: 'farmer', phone: '9876543210' },
  { id: 'FA-MANC88', name: 'Manchegowda S.', role: 'farmer', phone: '9876543211' }
];

export const mockFacilities = [
  { 
    id: 'fac-1', 
    owner_id: 'OW-KSWC01', 
    name: 'KSWC Mandya Unit-II', 
    address: 'V.C. Farm Road, Mandya', 
    storage_type: 'govt', 
    accepted_grains: ['Paddy', 'Ragi', 'Wheat'], 
    best_grain: 'Paddy', 
    capacity_kg: 12000000, 
    available_capacity_kg: 10000000, 
    price_per_kg_per_month: 0.15, 
    climate_control: true, 
    security_features: ['CCTV', '24/7 Guard', 'Biometric Access'], 
    images: [
      'https://loremflickr.com/800/500/green,crops?random=1',
      'https://loremflickr.com/800/500/green,crops?random=2',
      'https://loremflickr.com/800/500/green,crops?random=3'
    ],
    temperature: '20°C',
    humidity: '48%',
    lat: 12.5218, 
    lng: 76.8951,
    created_at: '2026-05-01T10:00:00Z'
  },
  { 
    id: 'fac-2', 
    owner_id: 'OW-KSWC01', 
    name: 'KSWC Mysuru Unit-I', 
    address: 'Hebbal Industrial Area, Mysuru', 
    storage_type: 'govt', 
    accepted_grains: ['Paddy', 'Maize'], 
    best_grain: 'Maize', 
    capacity_kg: 16705000, 
    available_capacity_kg: 5000000, 
    price_per_kg_per_month: 0.15, 
    climate_control: false, 
    security_features: ['CCTV', '24/7 Guard'], 
    images: [
      '/KSWC Mysuru Unit-I/OIP (1).webp',
      '/KSWC Mysuru Unit-I/media__1782966101915.jpg',
      '/KSWC Mysuru Unit-I/media__1782966141415.png',
      '/KSWC Mysuru Unit-I/media__1782966214438.png'
    ],
    temperature: '24°C',
    humidity: '55%',
    lat: 12.3396, 
    lng: 76.6022,
    created_at: '2026-05-05T10:00:00Z'
  },
  { 
    id: 'fac-3', 
    owner_id: 'OW-CKN002', 
    name: 'CKN Cold Storage & Logistics', 
    address: 'Naidunagar, Mysuru', 
    storage_type: 'commercial', 
    accepted_grains: ['Vegetables', 'Fruits'], 
    best_grain: 'Vegetables', 
    capacity_kg: 5000000, 
    available_capacity_kg: 1000000, 
    price_per_kg_per_month: 0.45, 
    climate_control: true, 
    security_features: ['CCTV', 'Alarm System'], 
    images: [
      '/CKN Cold Storage & Logistics/986511-godowns.webp',
      '/CKN Cold Storage & Logistics/istockphoto-1689990130-612x612.jpg',
      '/CKN Cold Storage & Logistics/pexels-paparazziratzfatzzi-8572149.jpg',
      '/CKN Cold Storage & Logistics/OIP.webp'
    ],
    temperature: '4°C',
    humidity: '85%',
    lat: 12.3350, 
    lng: 76.6500,
    created_at: '2026-05-10T10:00:00Z'
  },
  { 
    id: 'fac-4', 
    owner_id: 'OW-KALE03', 
    name: 'Kalegowda Private Silos', 
    address: 'Kalahalli Village, Mandya', 
    storage_type: 'p2p', 
    accepted_grains: ['Paddy', 'Ragi'], 
    best_grain: 'Paddy', 
    capacity_kg: 5200000, 
    available_capacity_kg: 5200000, 
    price_per_kg_per_month: 0.20, 
    climate_control: false, 
    security_features: ['Lock'], 
    images: [
      '/Kalegowda Private Silos/16.jpg',
      '/Kalegowda Private Silos/bulk-storage-facilities-1000x1000.webp',
      '/Kalegowda Private Silos/industrial-storage-racks-1000x1000.webp',
      '/Kalegowda Private Silos/OIP.webp'
    ],
    temperature: '26°C',
    humidity: '50%',
    lat: 12.5100, 
    lng: 76.8800,
    created_at: '2026-05-12T10:00:00Z'
  }
];

export const mockBookings = [
  { 
    id: 'book-1', 
    farmer_id: 'FA-KOUS99', 
    facility_id: 'fac-1', 
    crop_types: ['Paddy'], 
    quantity_kg: 20000, 
    duration_days: 180, 
    total_price: 30000, 
    status: 'checked_in',
    created_at: '2026-06-01T10:00:00Z',
    facility: { id: 'fac-1', name: 'KSWC Mandya Unit-II', address: 'V.C. Farm Road, Mandya', price_per_kg_per_month: 0.15 },
    farmer: { id: 'FA-KOUS99', unique_id: 'FA-KOUS99', name: 'Koushik Jain', phone: '9876543210', address: 'Mandya' }
  },
  { 
    id: 'book-2', 
    farmer_id: 'FA-MANC88', 
    facility_id: 'fac-4', 
    crop_types: ['Ragi'], 
    quantity_kg: 5000, 
    duration_days: 90, 
    total_price: 3000, 
    status: 'pending',
    created_at: '2026-06-10T14:30:00Z',
    facility: { id: 'fac-4', name: 'Kalegowda Private Silos', address: 'Kalahalli Village, Mandya', price_per_kg_per_month: 0.20 },
    farmer: { id: 'FA-MANC88', unique_id: 'FA-MANC88', name: 'Manchegowda S.', phone: '9876543211', address: 'Mysuru' }
  }
];
