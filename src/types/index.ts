export interface User {
  id: string
  email: string
  displayName?: string
  userType: 'brand' | 'creator'
  avatarUrl?: string
  bio?: string
  location?: string
  website?: string
  industry?: string
  createdAt: string
  updatedAt: string
}

export interface BrandProfile {
  id: string
  userId: string
  companyName: string
  companySize?: string
  targetAudience?: string
  budgetRange?: string
  verified: boolean
  createdAt: string
  updatedAt: string
}

export interface CreatorProfile {
  id: string
  userId: string
  niche?: string
  followerCount: number
  engagementRate: number
  contentTypes: string[]
  pricingTier?: string
  portfolioItems: PortfolioItem[]
  socialLinks: SocialLinks
  createdAt: string
  updatedAt: string
}

export interface PortfolioItem {
  id: string
  title: string
  description: string
  imageUrl: string
  link?: string
  metrics?: {
    views?: number
    likes?: number
    shares?: number
  }
}

export interface SocialLinks {
  instagram?: string
  youtube?: string
  tiktok?: string
  twitter?: string
  linkedin?: string
}

export interface Campaign {
  id: string
  brandUserId: string
  title: string
  description: string
  budget?: number
  requirements: string[]
  deliverables: string[]
  deadline?: string
  status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled'
  industry?: string
  targetAudience?: string
  createdAt: string
  updatedAt: string
  brand?: User
}

export interface CampaignApplication {
  id: string
  campaignId: string
  creatorUserId: string
  proposal: string
  proposedPrice?: number
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn'
  createdAt: string
  updatedAt: string
  creator?: User
  campaign?: Campaign
}

export interface Message {
  id: string
  senderUserId: string
  recipientUserId: string
  campaignId?: string
  content: string
  messageType: 'text' | 'image' | 'file'
  readStatus: boolean
  createdAt: string
  sender?: User
  recipient?: User
}

export interface Collaboration {
  id: string
  campaignId: string
  brandUserId: string
  creatorUserId: string
  agreedPrice?: number
  deliverables: string[]
  deadline?: string
  status: 'active' | 'in_progress' | 'review' | 'completed' | 'cancelled'
  createdAt: string
  updatedAt: string
  campaign?: Campaign
  brand?: User
  creator?: User
}