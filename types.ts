
export interface User {
  id: string;
  username: string;
  email: string;
  phone: string;
  dateJoined: string;
}

export interface Package {
  id: number;
  name: string;
  dataLimitMb: number;
  timeLimitMinutes: number;
  price: number;
  validityDays: number;
  isActive: boolean;
}

export interface UserPackage {
  id: string;
  package: Package;
  remainingDataMb: number;
  remainingTimeMinutes: number;
  expiryTime: string;
  status: 'active' | 'expired' | 'exhausted';
}

export interface HotspotSession {
  id: string;
  macAddress: string;
  ipAddress: string;
  startTime: string;
  dataUsedMb: number;
  status: 'connected' | 'disconnected';
}

export interface MpesaTransaction {
  id: string;
  merchantRequestId: string;
  checkoutRequestId: string;
  phoneNumber: string;
  amount: number;
  receiptNumber?: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: string;
}
