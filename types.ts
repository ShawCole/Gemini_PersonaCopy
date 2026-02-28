export interface BrandIdentity {
  name: string;
  industry: string;
  mission: string;
  toneOfVoice: string;
  productDescription: string;
  uniqueSellingPoints: string[];
}

export interface Avatar {
  id: string;
  name: string;
  demographics: {
    ageRange: string;
    gender: string;
    location: string;
    occupation: string;
    incomeLevel: string;
  };
  psychographics: {
    coreValues: string[];
    hobbies: string[];
    lifestyle: string;
  };
  deepAnalysis: {
    fears: string[];
    motivations: string[];
    painPoints: string[];
    objections: string[];
    dreamOutcome: string;
  };
}

export type PlatformMode = 
  | 'Social Guardian (Meta/TikTok)' 
  | 'Commercial Pipeline (DSP/Native)' 
  | 'Safe-Haven (VSL/Owned)';

export type AssetType = 
  | 'Facebook Ad' 
  | 'Video Script' 
  | 'Landing Page' 
  | 'Email Sequence' 
  | 'PDF Lead Magnet'
  | 'Anti-Gravity Landing Page (2026 Compliance)'
  | 'Anti-Gravity VSL Script (2026 Compliance)';

export interface GeneratedAsset {
  id: string;
  title: string;
  avatarId: string;
  assetType: AssetType;
  platformMode: PlatformMode;
  content: string;
  createdAt: number;
}

export type ViewState = 'BRAND' | 'AVATARS' | 'GENERATE' | 'LIBRARY';