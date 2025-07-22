import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  TrendingUp, 
  Star, 
  Zap, 
  Target, 
  Heart,
  Instagram,
  Youtube,
  Twitter,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Globe,
  Camera,
  MessageCircle
} from 'lucide-react'
import blink from '@/blink/client'
import { User } from '@/types'

// Import components
import BrandDashboard from '@/components/BrandDashboard'
import CreatorDashboard from '@/components/CreatorDashboard'
import ProfileSetup from '@/components/ProfileSetup'

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [userType, setUserType] = useState<'brand' | 'creator' | null>(null)
  const [profileComplete, setProfileComplete] = useState(false)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged(async (state) => {
      if (state.user) {
        // Check if user exists in our database
        const existingUsers = await blink.db.users.list({
          where: { id: state.user.id },
          limit: 1
        })
        
        if (existingUsers.length > 0) {
          const userData = existingUsers[0] as User
          setUser(userData)
          setUserType(userData.userType)
          setProfileComplete(true)
        } else {
          // New user, needs to complete profile
          setUser(state.user as User)
          setProfileComplete(false)
        }
      } else {
        setUser(null)
        setUserType(null)
        setProfileComplete(false)
      }
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading InfluenceHub...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LandingPage />
  }

  if (!userType) {
    return <UserTypeSelection setUserType={setUserType} user={user} setProfileComplete={setProfileComplete} />
  }

  if (!profileComplete) {
    return <ProfileSetup userType={userType} user={user} onComplete={() => setProfileComplete(true)} />
  }

  return userType === 'brand' ? <BrandDashboard user={user} /> : <CreatorDashboard user={user} />
}

function LandingPage() {
  const handleGetStarted = (type: 'brand' | 'creator') => {
    blink.auth.login(`/?type=${type}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Hero Pattern Background */}
      <div className="absolute inset-0 hero-pattern"></div>
      
      {/* Header */}
      <header className="relative z-10 border-b border-border/50 glass-effect">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold gradient-text">InfluenceHub</span>
            </div>
            <Button variant="outline" onClick={() => blink.auth.login()}>
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-float">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
              🚀 The Future of Influencer Marketing
            </Badge>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
            Connect <span className="gradient-text">Brands</span> with{' '}
            <span className="gradient-text">Creators</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            The ultimate platform where brands discover authentic creators and influencers 
            build meaningful partnerships across every industry.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
              onClick={() => handleGetStarted('brand')}
            >
              <Target className="w-5 h-5 mr-2" />
              I'm a Brand
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-accent text-accent hover:bg-accent hover:text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
              onClick={() => handleGetStarted('creator')}
            >
              <Camera className="w-5 h-5 mr-2" />
              I'm a Creator
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Social Proof */}
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8 text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-primary" />
              <span className="font-medium">1000+ Creators</span>
            </div>
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-accent" />
              <span className="font-medium">25 Campaigns</span>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <span className="font-medium">20+ Brands</span>
            </div>
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-red-500" />
              <span className="font-medium">Affordable Rates</span>
            </div>
          </div>
        </div>
      </section>

      {/* Achievement Stats Section */}
      <section className="relative z-10 py-16 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-accent/20 text-accent border-accent/30">
              ✨ Proven Track Record
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted by <span className="gradient-text">Creators</span> & <span className="gradient-text">Brands</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join our growing community of successful partnerships with industry-leading affordable rates
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Target className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-primary mb-2">25</div>
              <div className="text-sm text-muted-foreground font-medium">Campaigns Conducted</div>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-accent to-accent/80 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-accent mb-2">1000+</div>
              <div className="text-sm text-muted-foreground font-medium">Creators Onboarded</div>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-primary mb-2">20+</div>
              <div className="text-sm text-muted-foreground font-medium">Brand Applications</div>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <div className="text-2xl font-bold text-green-600 mb-2">Best</div>
              <div className="text-sm text-muted-foreground font-medium">Affordable Rates</div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Card className="glass-effect max-w-2xl mx-auto">
              <CardContent className="p-8">
                <div className="flex items-center justify-center mb-4">
                  <Star className="w-6 h-6 text-yellow-500 mr-2" />
                  <span className="text-lg font-semibold">Why Choose Us?</span>
                </div>
                <p className="text-muted-foreground">
                  We offer the most competitive and affordable rates in the industry while maintaining 
                  premium quality partnerships. Our proven track record speaks for itself.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose InfluenceHub?</h2>
            <p className="text-xl text-muted-foreground">Everything you need for successful influencer marketing</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="glass-effect hover:shadow-xl transition-all duration-300 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Lightning Fast Matching</h3>
                <p className="text-muted-foreground">AI-powered algorithm connects brands with perfect creators in seconds</p>
              </CardContent>
            </Card>

            <Card className="glass-effect hover:shadow-xl transition-all duration-300 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-accent to-primary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Global Reach</h3>
                <p className="text-muted-foreground">Connect with creators and brands from every corner of the world</p>
              </CardContent>
            </Card>

            <Card className="glass-effect hover:shadow-xl transition-all duration-300 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Seamless Communication</h3>
                <p className="text-muted-foreground">Built-in messaging and collaboration tools for smooth partnerships</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Media Icons */}
      <section className="relative z-10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold mb-8">Integrate with All Major Platforms</h3>
          <div className="flex justify-center items-center space-x-8">
            <Instagram className="w-12 h-12 text-pink-500 hover:scale-110 transition-transform cursor-pointer" />
            <Youtube className="w-12 h-12 text-red-500 hover:scale-110 transition-transform cursor-pointer" />
            <Twitter className="w-12 h-12 text-blue-500 hover:scale-110 transition-transform cursor-pointer" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 bg-white/30 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-muted-foreground">© 2024 InfluenceHub. Built with ❤️ for creators and brands.</p>
        </div>
      </footer>
    </div>
  )
}

function UserTypeSelection({ 
  setUserType, 
  user, 
  setProfileComplete 
}: { 
  setUserType: (type: 'brand' | 'creator') => void
  user: User
  setProfileComplete: (complete: boolean) => void
}) {
  const handleUserTypeSelection = async (type: 'brand' | 'creator') => {
    try {
      // Create user record in database
      await blink.db.users.create({
        id: user.id,
        email: user.email,
        displayName: user.displayName || user.email.split('@')[0],
        userType: type,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      
      setUserType(type)
      setProfileComplete(false) // Will trigger profile setup
    } catch (error) {
      console.error('Error creating user:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Welcome to InfluenceHub!</h1>
          <p className="text-xl text-muted-foreground">Let's set up your account. What describes you best?</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card 
            className="glass-effect hover:shadow-2xl transition-all duration-300 cursor-pointer group border-2 hover:border-primary"
            onClick={() => handleUserTypeSelection('brand')}
          >
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform">
                <Target className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl font-bold mb-4">I'm a Brand</h3>
              <p className="text-muted-foreground mb-6 text-lg">
                Looking to partner with creators and influencers to promote my products or services
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Create campaigns</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Discover creators</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Track performance</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="glass-effect hover:shadow-2xl transition-all duration-300 cursor-pointer group border-2 hover:border-accent"
            onClick={() => handleUserTypeSelection('creator')}
          >
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-accent to-accent/80 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform">
                <Camera className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl font-bold mb-4">I'm a Creator</h3>
              <p className="text-muted-foreground mb-6 text-lg">
                Ready to monetize my content and collaborate with amazing brands
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Browse campaigns</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Showcase portfolio</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Earn money</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default App