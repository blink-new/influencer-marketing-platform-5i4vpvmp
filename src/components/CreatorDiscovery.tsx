import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Search,
  Filter,
  Users,
  TrendingUp,
  MapPin,
  Instagram,
  Youtube,
  Twitter,
  MessageCircle,
  Heart,
  Star,
  Eye
} from 'lucide-react'
import blink from '@/blink/client'
import { User, CreatorProfile } from '@/types'

interface CreatorWithProfile extends User {
  creatorProfile?: CreatorProfile
}

const industries = [
  'All Industries',
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
  'Music'
]

const followerRanges = [
  'All Ranges',
  '1K - 10K',
  '10K - 100K',
  '100K - 1M',
  '1M+'
]

export default function CreatorDiscovery() {
  const [creators, setCreators] = useState<CreatorWithProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIndustry, setSelectedIndustry] = useState('All Industries')
  const [selectedFollowerRange, setSelectedFollowerRange] = useState('All Ranges')

  const checkFollowerRange = (count: number, range: string) => {
    switch (range) {
      case '1K - 10K':
        return count >= 1000 && count < 10000
      case '10K - 100K':
        return count >= 10000 && count < 100000
      case '100K - 1M':
        return count >= 100000 && count < 1000000
      case '1M+':
        return count >= 1000000
      default:
        return true
    }
  }

  const loadCreators = async () => {
    try {
      setLoading(true)
      
      // Load all creator users
      const creatorUsers = await blink.db.users.list({
        where: { userType: 'creator' },
        orderBy: { createdAt: 'desc' }
      })
      
      // Load creator profiles
      const creatorProfiles = await blink.db.creatorProfiles.list({
        orderBy: { followerCount: 'desc' }
      })
      
      // Combine users with their profiles
      const creatorsWithProfiles = creatorUsers.map(user => {
        const profile = creatorProfiles.find(p => p.userId === user.id)
        return {
          ...user,
          creatorProfile: profile
        } as CreatorWithProfile
      })
      
      setCreators(creatorsWithProfiles)
    } catch (error) {
      console.error('Error loading creators:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCreators()
  }, [])

  const filteredCreators = creators.filter(creator => {
    const matchesSearch = !searchQuery || 
      creator.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      creator.bio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      creator.creatorProfile?.niche?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesIndustry = selectedIndustry === 'All Industries' || 
      creator.industry === selectedIndustry
    
    const matchesFollowerRange = selectedFollowerRange === 'All Ranges' || 
      checkFollowerRange(creator.creatorProfile?.followerCount || 0, selectedFollowerRange)
    
    return matchesSearch && matchesIndustry && matchesFollowerRange
  })

  const formatFollowerCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
  }

  const getSocialLinks = (profile?: CreatorProfile) => {
    if (!profile?.socialLinks) return {}
    try {
      return JSON.parse(profile.socialLinks)
    } catch {
      return {}
    }
  }

  const getContentTypes = (profile?: CreatorProfile) => {
    if (!profile?.contentTypes) return []
    try {
      return JSON.parse(profile.contentTypes)
    } catch {
      return []
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Discovering amazing creators...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Discover Creators</h2>
        <Badge className="bg-primary/10 text-primary border-primary/20">
          {filteredCreators.length} creators found
        </Badge>
      </div>

      {/* Filters */}
      <Card className="glass-effect">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search creators..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
              <SelectTrigger>
                <SelectValue placeholder="Industry" />
              </SelectTrigger>
              <SelectContent>
                {industries.map((industry) => (
                  <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedFollowerRange} onValueChange={setSelectedFollowerRange}>
              <SelectTrigger>
                <SelectValue placeholder="Followers" />
              </SelectTrigger>
              <SelectContent>
                {followerRanges.map((range) => (
                  <SelectItem key={range} value={range}>{range}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button variant="outline" className="flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <span>More Filters</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Creator Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCreators.map((creator) => {
          const socialLinks = getSocialLinks(creator.creatorProfile)
          const contentTypes = getContentTypes(creator.creatorProfile)
          
          return (
            <Card key={creator.id} className="glass-effect hover:shadow-xl transition-all duration-300 group">
              <CardHeader className="text-center pb-3">
                <Avatar className="w-20 h-20 mx-auto mb-4">
                  <AvatarImage src={creator.avatarUrl} />
                  <AvatarFallback className="text-lg">
                    {creator.displayName?.[0] || creator.email[0]}
                  </AvatarFallback>
                </Avatar>
                
                <CardTitle className="text-lg font-semibold">
                  {creator.displayName || creator.email.split('@')[0]}
                </CardTitle>
                
                {creator.creatorProfile?.niche && (
                  <Badge variant="outline" className="w-fit mx-auto">
                    {creator.creatorProfile.niche}
                  </Badge>
                )}
                
                <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{formatFollowerCount(creator.creatorProfile?.followerCount || 0)}</span>
                  </div>
                  
                  {creator.creatorProfile?.engagementRate && (
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-4 h-4" />
                      <span>{(creator.creatorProfile.engagementRate * 100).toFixed(1)}%</span>
                    </div>
                  )}
                  
                  {creator.location && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{creator.location}</span>
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {creator.bio && (
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {creator.bio}
                  </p>
                )}
                
                {/* Social Media Links */}
                <div className="flex justify-center space-x-3">
                  {socialLinks.instagram && (
                    <Instagram className="w-5 h-5 text-pink-500 cursor-pointer hover:scale-110 transition-transform" />
                  )}
                  {socialLinks.youtube && (
                    <Youtube className="w-5 h-5 text-red-500 cursor-pointer hover:scale-110 transition-transform" />
                  )}
                  {socialLinks.twitter && (
                    <Twitter className="w-5 h-5 text-blue-500 cursor-pointer hover:scale-110 transition-transform" />
                  )}
                </div>
                
                {/* Content Types */}
                {contentTypes.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">CONTENT TYPES</p>
                    <div className="flex flex-wrap gap-1">
                      {contentTypes.slice(0, 3).map((type: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {type}
                        </Badge>
                      ))}
                      {contentTypes.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{contentTypes.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Pricing */}
                {creator.creatorProfile?.pricingTier && (
                  <div className="text-center">
                    <Badge className="bg-accent/10 text-accent border-accent/20">
                      {creator.creatorProfile.pricingTier}
                    </Badge>
                  </div>
                )}
                
                {/* Action Buttons */}
                <div className="flex space-x-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Eye className="w-4 h-4 mr-2" />
                    View Profile
                  </Button>
                  <Button size="sm" className="flex-1 bg-primary hover:bg-primary/90">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Contact
                  </Button>
                </div>
                
                <Button size="sm" variant="ghost" className="w-full">
                  <Heart className="w-4 h-4 mr-2" />
                  Save to Favorites
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredCreators.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No creators found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search criteria or check back later for new creators
          </p>
        </div>
      )}
    </div>
  )
}