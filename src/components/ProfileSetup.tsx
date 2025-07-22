import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  User, 
  Building, 
  MapPin, 
  Globe, 
  Users, 
  DollarSign,
  Instagram,
  Youtube,
  Twitter,
  Linkedin,
  Plus,
  X,
  Upload,
  CheckCircle
} from 'lucide-react'
import blink from '@/blink/client'
import { User as UserType } from '@/types'

interface ProfileSetupProps {
  userType: 'brand' | 'creator'
  user: UserType
  onComplete: () => void
}

const industries = [
  'Fashion & Beauty',
  'Technology',
  'Food & Beverage',
  'Travel & Lifestyle',
  'Fitness & Health',
  'Gaming',
  'Education',
  'Finance',
  'Entertainment',
  'Home & Garden',
  'Automotive',
  'Sports',
  'Art & Design',
  'Music',
  'Other'
]

const contentTypes = [
  'Instagram Posts',
  'Instagram Stories',
  'Instagram Reels',
  'YouTube Videos',
  'YouTube Shorts',
  'TikTok Videos',
  'Twitter Posts',
  'LinkedIn Articles',
  'Blog Posts',
  'Podcasts',
  'Live Streams',
  'Product Reviews',
  'Tutorials',
  'Unboxing Videos'
]

const companySizes = [
  'Startup (1-10 employees)',
  'Small (11-50 employees)',
  'Medium (51-200 employees)',
  'Large (201-1000 employees)',
  'Enterprise (1000+ employees)'
]

const budgetRanges = [
  'Under $1,000',
  '$1,000 - $5,000',
  '$5,000 - $10,000',
  '$10,000 - $25,000',
  '$25,000 - $50,000',
  '$50,000+'
]

const pricingTiers = [
  'Micro ($50-$500)',
  'Mid-tier ($500-$2,500)',
  'Macro ($2,500-$10,000)',
  'Mega ($10,000+)'
]

export default function ProfileSetup({ userType, user, onComplete }: ProfileSetupProps) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  
  // Basic profile data
  const [displayName, setDisplayName] = useState(user.displayName || '')
  const [bio, setBio] = useState('')
  const [location, setLocation] = useState('')
  const [website, setWebsite] = useState('')
  const [industry, setIndustry] = useState('')
  
  // Brand-specific data
  const [companyName, setCompanyName] = useState('')
  const [companySize, setCompanySize] = useState('')
  const [targetAudience, setTargetAudience] = useState('')
  const [budgetRange, setBudgetRange] = useState('')
  
  // Creator-specific data
  const [niche, setNiche] = useState('')
  const [followerCount, setFollowerCount] = useState('')
  const [selectedContentTypes, setSelectedContentTypes] = useState<string[]>([])
  const [pricingTier, setPricingTier] = useState('')
  const [socialLinks, setSocialLinks] = useState({
    instagram: '',
    youtube: '',
    twitter: '',
    linkedin: ''
  })

  const totalSteps = userType === 'brand' ? 3 : 4
  const progress = (step / totalSteps) * 100

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleContentTypeToggle = (contentType: string) => {
    setSelectedContentTypes(prev => 
      prev.includes(contentType)
        ? prev.filter(type => type !== contentType)
        : [...prev, contentType]
    )
  }

  const handleComplete = async () => {
    setLoading(true)
    try {
      // Update user profile
      await blink.db.users.update(user.id, {
        displayName,
        bio,
        location,
        website,
        industry,
        updatedAt: new Date().toISOString()
      })

      if (userType === 'brand') {
        // Create brand profile
        await blink.db.brandProfiles.create({
          id: `brand_${user.id}`,
          userId: user.id,
          companyName,
          companySize,
          targetAudience,
          budgetRange,
          verified: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
      } else {
        // Create creator profile
        await blink.db.creatorProfiles.create({
          id: `creator_${user.id}`,
          userId: user.id,
          niche,
          followerCount: parseInt(followerCount) || 0,
          engagementRate: 0.0,
          contentTypes: JSON.stringify(selectedContentTypes),
          pricingTier,
          portfolioItems: JSON.stringify([]),
          socialLinks: JSON.stringify(socialLinks),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
      }

      onComplete()
    } catch (error) {
      console.error('Error completing profile setup:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <Card className="glass-effect">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold mb-2">
              Complete Your {userType === 'brand' ? 'Brand' : 'Creator'} Profile
            </CardTitle>
            <p className="text-muted-foreground">
              Step {step} of {totalSteps} - Let's get you set up for success!
            </p>
            <Progress value={progress} className="mt-4" />
          </CardHeader>
          
          <CardContent className="space-y-6">
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold mb-2">Basic Information</h3>
                  <p className="text-muted-foreground">Tell us about yourself</p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                      id="displayName"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Your name or brand name"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell us about yourself..."
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="City, Country"
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        placeholder="https://yourwebsite.com"
                        className="mt-1"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="industry">Industry</Label>
                    <Select value={industry} onValueChange={setIndustry}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select your industry" />
                      </SelectTrigger>
                      <SelectContent>
                        {industries.map((ind) => (
                          <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && userType === 'brand' && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold mb-2">Company Details</h3>
                  <p className="text-muted-foreground">Tell us about your company</p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Your company name"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="companySize">Company Size</Label>
                    <Select value={companySize} onValueChange={setCompanySize}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select company size" />
                      </SelectTrigger>
                      <SelectContent>
                        {companySizes.map((size) => (
                          <SelectItem key={size} value={size}>{size}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="targetAudience">Target Audience</Label>
                    <Textarea
                      id="targetAudience"
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                      placeholder="Describe your target audience..."
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && userType === 'brand' && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold mb-2">Campaign Preferences</h3>
                  <p className="text-muted-foreground">Set your campaign budget range</p>
                </div>
                
                <div>
                  <Label htmlFor="budgetRange">Typical Campaign Budget</Label>
                  <Select value={budgetRange} onValueChange={setBudgetRange}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      {budgetRanges.map((budget) => (
                        <SelectItem key={budget} value={budget}>{budget}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {step === 2 && userType === 'creator' && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold mb-2">Creator Details</h3>
                  <p className="text-muted-foreground">Tell us about your content</p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="niche">Content Niche</Label>
                    <Input
                      id="niche"
                      value={niche}
                      onChange={(e) => setNiche(e.target.value)}
                      placeholder="e.g., Fashion, Tech Reviews, Cooking"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="followerCount">Total Follower Count</Label>
                    <Input
                      id="followerCount"
                      type="number"
                      value={followerCount}
                      onChange={(e) => setFollowerCount(e.target.value)}
                      placeholder="Total followers across all platforms"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label>Content Types</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {contentTypes.map((type) => (
                        <Badge
                          key={type}
                          variant={selectedContentTypes.includes(type) ? "default" : "outline"}
                          className="cursor-pointer justify-center py-2"
                          onClick={() => handleContentTypeToggle(type)}
                        >
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && userType === 'creator' && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold mb-2">Social Media Links</h3>
                  <p className="text-muted-foreground">Connect your social profiles</p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Instagram className="w-5 h-5 text-pink-500" />
                    <Input
                      value={socialLinks.instagram}
                      onChange={(e) => setSocialLinks(prev => ({ ...prev, instagram: e.target.value }))}
                      placeholder="Instagram username or URL"
                      className="flex-1"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Youtube className="w-5 h-5 text-red-500" />
                    <Input
                      value={socialLinks.youtube}
                      onChange={(e) => setSocialLinks(prev => ({ ...prev, youtube: e.target.value }))}
                      placeholder="YouTube channel URL"
                      className="flex-1"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Twitter className="w-5 h-5 text-blue-500" />
                    <Input
                      value={socialLinks.twitter}
                      onChange={(e) => setSocialLinks(prev => ({ ...prev, twitter: e.target.value }))}
                      placeholder="Twitter username or URL"
                      className="flex-1"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Linkedin className="w-5 h-5 text-blue-600" />
                    <Input
                      value={socialLinks.linkedin}
                      onChange={(e) => setSocialLinks(prev => ({ ...prev, linkedin: e.target.value }))}
                      placeholder="LinkedIn profile URL"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 4 && userType === 'creator' && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold mb-2">Pricing & Preferences</h3>
                  <p className="text-muted-foreground">Set your pricing tier</p>
                </div>
                
                <div>
                  <Label htmlFor="pricingTier">Pricing Tier</Label>
                  <Select value={pricingTier} onValueChange={setPricingTier}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select your pricing tier" />
                    </SelectTrigger>
                    <SelectContent>
                      {pricingTiers.map((tier) => (
                        <SelectItem key={tier} value={tier}>{tier}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={step === 1}
              >
                Back
              </Button>
              
              {step < totalSteps ? (
                <Button onClick={handleNext}>
                  Next
                </Button>
              ) : (
                <Button onClick={handleComplete} disabled={loading}>
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Completing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Complete Profile
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}