export type ShipmentStatus = 'pendente' | 'em_transito' | 'entregue' | 'cancelado';

export interface Profile {
  id: string; // User ID (auth.users)
  role: 'admin' | 'user';
  name: string;
  created_at?: string;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  cpf: string;
  plate: string;
  vehicle_model: string;
  status: 'ativo' | 'inativo';
  created_at?: string;
}

export interface Shipment {
  id: string;
  tracking_code: string; // e.g. rodo-10001
  status: ShipmentStatus;
  customer_name: string;
  customer_document: string;
  origin: string;
  destination: string;
  description: string;
  value: number;
  freight_value: number;
  driver_percentage: number;
  driver_id: string | null;
  expected_delivery_date: string;
  proof_url: string | null;
  created_at: string;
  updated_at: string;
  
  // Relations mapped by Supabase
  driver?: Driver;
}

export interface TrackingPoint {
  id: string;
  shipment_id: string;
  latitude: number;
  longitude: number;
  accuracy: number | null;
  speed: number | null;
  heading: number | null;
  created_at: string;
}

export interface DeliveryProof {
  id: string;
  shipment_id: string;
  image_url: string;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
}
