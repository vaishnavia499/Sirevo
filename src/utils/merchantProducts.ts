export interface MerchantProduct {
  id: string;
  name: string;
  image: string;
  price: string;
  rawPrice: number;
  originalPrice?: string;
  rawOriginalPrice?: number;
  stock: number;
  stockLabel?: string;
  lowStockThreshold?: number;
  aiMatch: number;
  aiSearches: number;
  shortlisted: number;
  purchased: number;
  status: 'Active' | 'Disabled';
  category: string;
  sku?: string;
  description?: string;
  specifications?: string[];
  tags?: string[];
  brand?: string;
  warranty?: string;
  stockLogs?: {
    id: string;
    timestamp: string;
    previousStock: number;
    newStock: number;
    change: number;
    reason: string;
  }[];
}

export const DEFAULT_MERCHANT_PRODUCTS: MerchantProduct[] = [
  {
    id: 'prod-1',
    name: 'Lenovo IdeaPad Slim 5',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&auto=format&fit=crop&q=80',
    price: '₹55,000',
    rawPrice: 55000,
    originalPrice: '₹68,990',
    rawOriginalPrice: 68990,
    stock: 45,
    lowStockThreshold: 10,
    aiMatch: 94,
    aiSearches: 320,
    shortlisted: 86,
    purchased: 24,
    status: 'Active',
    category: 'Laptops',
    brand: 'Lenovo',
    sku: 'LEN-SLIM5-16GB',
    description: '14" FHD IPS display, AMD Ryzen 7 5700U, 16GB DDR4 RAM, 512GB NVMe SSD, Backlit Keyboard, Fingerprint Reader, 12-hour battery life.',
    specifications: [
      'Processor: AMD Ryzen 7 5700U',
      'RAM: 16GB DDR4',
      'Storage: 512GB SSD',
      'Display: 14" FHD Antiglare',
      'Battery: 56.5Wh (12 hrs)'
    ],
    tags: ['laptop', 'coding', 'student', 'thin and light', 'ryzen 7'],
    warranty: '1 Year Onsite Warranty',
    stockLogs: [
      {
        id: 'log-1',
        timestamp: 'Just now',
        previousStock: 48,
        newStock: 45,
        change: -3,
        reason: 'Customer orders fulfilled'
      }
    ]
  },
  {
    id: 'prod-2',
    name: 'Sony WH-1000XM5',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=80',
    price: '₹29,990',
    rawPrice: 29990,
    originalPrice: '₹34,990',
    rawOriginalPrice: 34990,
    stock: 2,
    stockLabel: '2 left',
    lowStockThreshold: 5,
    aiMatch: 88,
    aiSearches: 512,
    shortlisted: 145,
    purchased: 42,
    status: 'Active',
    category: 'Audio',
    brand: 'Sony',
    sku: 'SNY-XM5-BLK',
    description: 'Industry-leading noise cancellation with two processors and 8 microphones. Crystal-clear hands-free calling and up to 30-hour battery life.',
    specifications: [
      'Driver Unit: 30mm Carbon Fiber',
      'Battery: 30 hours with ANC',
      'Bluetooth: 5.2 with LDAC',
      'Weight: 250g',
      'Fast Charging: 3 min = 3 hrs'
    ],
    tags: ['headphones', 'anc', 'noise cancelling', 'sony', 'wireless audio'],
    warranty: '1 Year Manufacturer Warranty',
    stockLogs: [
      {
        id: 'log-2',
        timestamp: '2 hours ago',
        previousStock: 5,
        newStock: 2,
        change: -3,
        reason: 'Flash sale checkout'
      }
    ]
  },
  {
    id: 'prod-3',
    name: 'Logitech MX Master 3S',
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=400&auto=format&fit=crop&q=80',
    price: '₹8,995',
    rawPrice: 8995,
    originalPrice: '₹10,995',
    rawOriginalPrice: 10995,
    stock: 0,
    stockLabel: 'Out of stock',
    lowStockThreshold: 5,
    aiMatch: 42,
    aiSearches: 12,
    shortlisted: 3,
    purchased: 0,
    status: 'Disabled',
    category: 'Accessories',
    brand: 'Logitech',
    sku: 'LOG-MX3S-GRY',
    description: 'Quiet Clicks, 8K DPI track-on-glass sensor, MagSpeed electromagnetic scrolling, USB-C quick charge, multi-OS seamless flow.',
    specifications: [
      'Sensor: Darkfield 8000 DPI',
      'Battery: 500mAh (70 days)',
      'Connectivity: Bluetooth + Bolt',
      'Buttons: 7 customizable buttons'
    ],
    tags: ['mouse', 'ergonomic', 'productivity', 'logitech mx'],
    warranty: '2 Year Limited Hardware Warranty',
    stockLogs: [
      {
        id: 'log-3',
        timestamp: 'Yesterday',
        previousStock: 2,
        newStock: 0,
        change: -2,
        reason: 'Inventory depleted'
      }
    ]
  }
];

const STORAGE_KEY = 'sirevo_merchant_products';

export function getStoredMerchantProducts(): MerchantProduct[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error loading merchant products from localStorage', e);
  }
  return DEFAULT_MERCHANT_PRODUCTS;
}

export function saveStoredMerchantProducts(products: MerchantProduct[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch (e) {
    console.error('Error saving merchant products to localStorage', e);
  }
}
