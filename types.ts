export interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export interface LicenseConfig {
  productName: string;
  count: number;
  format: 'uuid' | 'alphanumeric' | 'phonetic' | 'custom';
  complexity: 'low' | 'medium' | 'high';
}

export interface LegalConfig {
  documentType: 'tos' | 'dmca' | 'eula' | 'privacy';
  entityName: string;
  productType: string;
  jurisdiction: string;
  strictness: 'friendly' | 'standard' | 'strict';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  isThinking?: boolean;
}

export enum ToolType {
  WATERMARK = 'watermark',
  LICENSE = 'license',
  LEGAL = 'legal',
  ADVISOR = 'advisor',
  DASHBOARD = 'dashboard'
}
