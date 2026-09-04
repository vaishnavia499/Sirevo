export type PageRoute = 
  | 'home'
  | 'search'
  | 'product-detail'
  | 'compare'
  | 'orders'
  | 'payment'
  | 'payment-success'
  | 'ai-history'
  | 'cart'
  | 'profile'
  | 'settings'
  | 'auth'
  | 'merchant-register'
  | 'customer-signup'
  | 'merchant-dashboard'
  | 'merchant-add-product'
  | 'merchant-products'
  | 'merchant-ai-visibility'
  | 'merchant-ai-suggestions'
  | 'merchant-orders'
  | 'merchant-revenue'
  | 'merchant-profile';

export type UIAction = 'text_response' | 'product_grid' | 'checkout_confirmation' | 'budget_warning';

export interface CuratedProduct {
  product_id: string;
  name: string;
  price: number;
  source: 'registered_merchant' | 'external_web' | string;
  ai_match_percentage: number;
  ai_explanation: string;
  specs?: {
    ram?: string;
    storage?: string;
    battery?: string;
    delivery?: string;
    processor?: string;
    screen?: string;
    os?: string;
    weight?: string;
    warranty?: string;
    [key: string]: any;
  };
  original_price?: number;
  badge?: string;
  external_link?: string;
  merchant_id?: string;
  thumbnail?: string;
  image?: string;
  category?: string;
  merchant?: string;
  in_stock?: boolean;
}

export interface CheckoutData {
  product_id: string;
  merchant_id: string;
  amount_to_charge: number;
  product_name?: string;
}

export interface SirevoAIResponse {
  ui_action: UIAction;
  chat_message: string;
  curated_products?: CuratedProduct[];
  checkout_data?: CheckoutData;
}

export interface StructuredSearchRequest {
  query: string;
  category: string;
  budget: number | null;
  requirements: string[];
  preferences: string[];
}

export type SearchUIState = 'idle' | 'searching' | 'results';

export type NavigationHandler = (page: PageRoute, query?: string) => void;

export interface NavItem {
  id: PageRoute;
  label: string;
  path: string;
  iconName: string;
  badge?: string | number;
}
