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

      {/* Success Stories */}
      <section className="relative z-10 py-20 bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">
              🎯 Success Stories
            </Badge>
            <h2 className="text-4xl font-bold mb-4">Real Results from Real Campaigns</h2>
            <p className="text-xl text-muted-foreground">See how our affordable rates deliver exceptional ROI</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="glass-effect hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-4">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold">TechStart Inc.</h4>
                    <p className="text-sm text-muted-foreground">SaaS Company</p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">
                  "Increased our user signups by 340% with just 5 micro-influencers. The affordable rates made it possible to test multiple creators."
                </p>
                <div className="flex justify-between text-sm">
                  <span className="text-green-600 font-semibold">+340% Signups</span>
                  <span className="text-primary font-semibold">5 Creators</span>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center mr-4">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold">BeautyGlow</h4>
                    <p className="text-sm text-muted-foreground">Cosmetics Brand</p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">
                  "Our skincare launch reached 2M+ people through 12 beauty creators. Best ROI we've ever achieved at these rates!"
                </p>
                <div className="flex justify-between text-sm">
                  <span className="text-green-600 font-semibold">2M+ Reach</span>
                  <span className="text-primary font-semibold">12 Creators</span>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mr-4">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold">FitLife Gear</h4>
                    <p className="text-sm text-muted-foreground">Fitness Equipment</p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">
                  "Generated $50K in sales from a $2K campaign budget. The platform's affordable creator rates are unmatched."
                </p>
                <div className="flex justify-between text-sm">
                  <span className="text-green-600 font-semibold">2500% ROI</span>
                  <span className="text-primary font-semibold">8 Creators</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">What Our Community Says</h2>
            <p className="text-xl text-muted-foreground">Trusted by creators and brands worldwide</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="glass-effect">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-bold">S</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Sarah Chen</h4>
                    <p className="text-sm text-muted-foreground">Beauty Creator • 150K followers</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground">
                  "Finally found a platform with fair rates! Made $3K last month from 4 campaigns. The brands are professional and payments are always on time."
                </p>
              </CardContent>
            </Card>

            <Card className="glass-effect">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-bold">M</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Marcus Johnson</h4>
                    <p className="text-sm text-muted-foreground">Tech Reviewer • 85K followers</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground">
                  "Love how easy it is to find relevant tech brands. The messaging system is smooth and the rates are competitive. Highly recommend!"
                </p>
              </CardContent>
            </Card>

            <Card className="glass-effect">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-bold">A</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Alex Rivera</h4>
                    <p className="text-sm text-muted-foreground">Marketing Director • EcoClean</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground">
                  "Best platform for finding authentic creators. The affordable rates let us work with more influencers and get better results. Game changer!"
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="relative z-10 py-20 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-green-500/20 text-green-700 border-green-500/30">
              💰 Affordable Rates
            </Badge>
            <h2 className="text-4xl font-bold mb-4">Transparent, Fair Pricing</h2>
            <p className="text-xl text-muted-foreground">No hidden fees. No surprises. Just great value.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="glass-effect border-2 border-border/50">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-2">Creators</h3>
                <div className="text-4xl font-bold text-primary mb-4">Free</div>
                <p className="text-muted-foreground mb-6">Join and start earning</p>
                <ul className="space-y-3 text-left mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span>Browse unlimited campaigns</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span>Direct brand messaging</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span>Portfolio showcase</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span>Secure payments</span>
                  </li>
                </ul>
                <Button className="w-full" onClick={() => handleGetStarted('creator')}>
                  Join as Creator
                </Button>
              </CardContent>
            </Card>

            <Card className="glass-effect border-2 border-primary shadow-xl scale-105">
              <CardContent className="p-8 text-center relative">
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-white">
                  Most Popular
                </Badge>
                <h3 className="text-2xl font-bold mb-2">Brands - Starter</h3>
                <div className="text-4xl font-bold text-primary mb-4">$99<span className="text-lg text-muted-foreground">/mo</span></div>
                <p className="text-muted-foreground mb-6">Perfect for small businesses</p>
                <ul className="space-y-3 text-left mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span>Up to 5 active campaigns</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span>Creator discovery tools</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span>Campaign analytics</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span>Priority support</span>
                  </li>
                </ul>
                <Button className="w-full" onClick={() => handleGetStarted('brand')}>
                  Start Free Trial
                </Button>
              </CardContent>
            </Card>

            <Card className="glass-effect border-2 border-border/50">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-2">Brands - Pro</h3>
                <div className="text-4xl font-bold text-primary mb-4">$299<span className="text-lg text-muted-foreground">/mo</span></div>
                <p className="text-muted-foreground mb-6">For growing companies</p>
                <ul className="space-y-3 text-left mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span>Unlimited campaigns</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span>Advanced analytics</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span>White-label reports</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span>Dedicated account manager</span>
                  </li>
                </ul>
                <Button className="w-full" onClick={() => handleGetStarted('brand')}>
                  Contact Sales
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <p className="text-lg text-muted-foreground">
              💡 <strong>Why our rates are affordable:</strong> We believe in fair partnerships. 
              Creators keep 85% of campaign payments, and brands get maximum ROI with our efficient matching system.
            </p>
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

      {/* FAQ Section */}
      <section className="relative z-10 py-20 bg-white/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-muted-foreground">Everything you need to know about our affordable rates</p>
          </div>

          <div className="space-y-6">
            <Card className="glass-effect">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-3">How are your rates more affordable than competitors?</h3>
                <p className="text-muted-foreground">
                  We operate on a lean model with lower overhead costs, allowing us to offer competitive rates. 
                  Creators keep 85% of campaign payments (vs industry standard of 70%), and brands pay 50% less 
                  in platform fees compared to major competitors.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-effect">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-3">What's included in the campaign management?</h3>
                <p className="text-muted-foreground">
                  All plans include campaign creation tools, creator discovery, messaging system, content approval 
                  workflows, performance tracking, and secure payment processing. Pro plans add advanced analytics 
                  and dedicated support.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-effect">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-3">How do creators get paid?</h3>
                <p className="text-muted-foreground">
                  Payments are processed securely through our platform within 7 days of campaign completion. 
                  We support bank transfers, PayPal, and digital wallets. No hidden fees - creators receive 
                  exactly what was agreed upon.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-effect">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-3">Can I try the platform before committing?</h3>
                <p className="text-muted-foreground">
                  Absolutely! Creators can join for free and browse campaigns immediately. Brands get a 14-day 
                  free trial with full access to all features. No credit card required to start.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-effect">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-3">What industries do you support?</h3>
                <p className="text-muted-foreground">
                  We support all industries - from tech and beauty to fitness and food. Our diverse creator 
                  network spans every niche, ensuring perfect matches for any brand or product category.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 py-20 bg-gradient-to-r from-primary to-accent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-white/90 mb-8">
            Join 1000+ creators and 20+ brands already growing with our affordable rates
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              className="bg-white text-primary hover:bg-white/90 px-8 py-6 text-lg rounded-xl shadow-lg"
              onClick={() => handleGetStarted('creator')}
            >
              <Camera className="w-5 h-5 mr-2" />
              Join as Creator - Free
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-6 text-lg rounded-xl"
              onClick={() => handleGetStarted('brand')}
            >
              <Target className="w-5 h-5 mr-2" />
              Start Brand Trial
            </Button>
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