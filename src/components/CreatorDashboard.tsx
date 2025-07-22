import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Search,
  Filter,
  Users,
  TrendingUp,
  DollarSign,
  MessageCircle,
  Eye,
  Calendar,
  Target,
  Sparkles,
  Settings,
  LogOut,
  Bell,
  BarChart3,
  Briefcase,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  Camera,
  Heart,
  Send
} from 'lucide-react'
import blink from '@/blink/client'
import { User, Campaign, CampaignApplication } from '@/types'
import MessagingCenter from './MessagingCenter'

interface CreatorDashboardProps {
  user: User
}

export default function CreatorDashboard({ user }: CreatorDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [applications, setApplications] = useState<CampaignApplication[]>([])
  const [loading, setLoading] = useState(true)

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true)
      
      // Load available campaigns
      const campaignData = await blink.db.campaigns.list({
        where: { status: 'active' },
        orderBy: { createdAt: 'desc' }
      })
      setCampaigns(campaignData as Campaign[])

      // Load user's applications
      const applicationData = await blink.db.campaignApplications.list({
        where: { creatorUserId: user.id },
        orderBy: { createdAt: 'desc' }
      })
      setApplications(applicationData as CampaignApplication[])
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }, [user.id])

  useEffect(() => {
    loadDashboardData()
  }, [loadDashboardData])

  const handleLogout = () => {
    blink.auth.logout()
  }

  const stats = {
    totalApplications: applications.length,
    acceptedApplications: applications.filter(a => a.status === 'accepted').length,
    pendingApplications: applications.filter(a => a.status === 'pending').length,
    availableCampaigns: campaigns.length
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      <header className="border-b border-border/50 glass-effect sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold gradient-text">InfluenceHub</span>
              </div>
              <Badge className="bg-accent/10 text-accent border-accent/20">
                Creator Dashboard
              </Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
              <div className="flex items-center space-x-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user.avatarUrl} />
                  <AvatarFallback>{user.displayName?.[0] || user.email[0]}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{user.displayName || user.email}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 glass-effect">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="campaigns" className="flex items-center space-x-2">
              <Search className="w-4 h-4" />
              <span>Browse</span>
            </TabsTrigger>
            <TabsTrigger value="applications" className="flex items-center space-x-2">
              <Send className="w-4 h-4" />
              <span>Applications</span>
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="flex items-center space-x-2">
              <Camera className="w-4 h-4" />
              <span>Portfolio</span>
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center space-x-2">
              <MessageCircle className="w-4 h-4" />
              <span>Messages</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="glass-effect">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Applications</p>
                      <p className="text-3xl font-bold">{stats.totalApplications}</p>
                    </div>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Send className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-effect">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Accepted</p>
                      <p className="text-3xl font-bold">{stats.acceptedApplications}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-effect">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Pending</p>
                      <p className="text-3xl font-bold">{stats.pendingApplications}</p>
                    </div>
                    <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6 text-orange-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-effect">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Available Campaigns</p>
                      <p className="text-3xl font-bold">{stats.availableCampaigns}</p>
                    </div>
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                      <Target className="w-6 h-6 text-accent" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass-effect">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="w-5 h-5" />
                    <span>Latest Campaigns</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {campaigns.slice(0, 3).map((campaign) => (
                    <div key={campaign.id} className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                      <div>
                        <p className="font-medium">{campaign.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {campaign.budget ? `$${campaign.budget.toLocaleString()}` : 'Budget not specified'}
                        </p>
                      </div>
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                    </div>
                  ))}
                  {campaigns.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      No campaigns available right now. Check back later!
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card className="glass-effect">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Send className="w-5 h-5" />
                    <span>Recent Applications</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {applications.slice(0, 3).map((application) => (
                    <div key={application.id} className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                      <div>
                        <p className="font-medium">Application Submitted</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(application.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant={
                        application.status === 'pending' ? 'secondary' :
                        application.status === 'accepted' ? 'default' : 'destructive'
                      }>
                        {application.status}
                      </Badge>
                    </div>
                  ))}
                  {applications.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      No applications yet. Start applying to campaigns!
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="campaigns" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Browse Campaigns</h2>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaigns.map((campaign) => (
                <CampaignBrowseCard key={campaign.id} campaign={campaign} user={user} />
              ))}
              {campaigns.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <Target className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No campaigns available</h3>
                  <p className="text-muted-foreground">
                    Check back later for new campaign opportunities
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">My Applications</h2>
            </div>

            <div className="space-y-4">
              {applications.map((application) => (
                <Card key={application.id} className="glass-effect">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="font-medium">Campaign Application</p>
                        <p className="text-sm text-muted-foreground">
                          Applied {new Date(application.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant={
                        application.status === 'pending' ? 'secondary' :
                        application.status === 'accepted' ? 'default' : 'destructive'
                      }>
                        {application.status}
                      </Badge>
                    </div>
                    
                    <p className="text-muted-foreground mb-4">{application.proposal}</p>
                    
                    {application.proposedPrice && (
                      <p className="font-medium mb-4">
                        Proposed Price: ${application.proposedPrice}
                      </p>
                    )}

                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-2" />
                        View Campaign
                      </Button>
                      {application.status === 'pending' && (
                        <Button size="sm" variant="ghost">
                          <XCircle className="w-4 h-4 mr-2" />
                          Withdraw
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
              {applications.length === 0 && (
                <div className="text-center py-12">
                  <Send className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No applications yet</h3>
                  <p className="text-muted-foreground">
                    Browse campaigns and start applying to build your portfolio
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">My Portfolio</h2>
              <Button className="bg-accent hover:bg-accent/90">
                <Camera className="w-4 h-4 mr-2" />
                Add Work
              </Button>
            </div>

            <div className="text-center py-12">
              <Camera className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Build your portfolio</h3>
              <p className="text-muted-foreground mb-6">
                Showcase your best work to attract brands and increase your chances of getting hired
              </p>
              <Button className="bg-accent hover:bg-accent/90">
                <Camera className="w-4 h-4 mr-2" />
                Add Your First Project
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="messages">
            <MessagingCenter user={user} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// Campaign Browse Card Component
function CampaignBrowseCard({ campaign, user }: { campaign: Campaign; user: User }) {
  const [applying, setApplying] = useState(false)

  const handleApply = async () => {
    setApplying(true)
    try {
      await blink.db.campaignApplications.create({
        id: `app_${Date.now()}`,
        campaignId: campaign.id,
        creatorUserId: user.id,
        proposal: `I'm interested in working on your ${campaign.title} campaign. I believe my content style and audience would be a great fit for this project.`,
        proposedPrice: campaign.budget ? Math.floor(campaign.budget * 0.8) : undefined,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      
      // Show success message or update UI
      alert('Application submitted successfully!')
    } catch (error) {
      console.error('Error applying to campaign:', error)
      alert('Failed to submit application. Please try again.')
    } finally {
      setApplying(false)
    }
  }

  const deliverables = campaign.deliverables ? JSON.parse(campaign.deliverables) : []

  return (
    <Card className="glass-effect hover:shadow-xl transition-all duration-300 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors">
            {campaign.title}
          </CardTitle>
          <Badge className="ml-2 bg-green-500/10 text-green-500 border-green-500/20">
            Active
          </Badge>
        </div>
        {campaign.industry && (
          <Badge variant="outline" className="w-fit">
            {campaign.industry}
          </Badge>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-muted-foreground text-sm line-clamp-3">
          {campaign.description}
        </p>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          {campaign.budget && (
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-green-500" />
              <span className="font-medium">${campaign.budget.toLocaleString()}</span>
            </div>
          )}
          
          {campaign.deadline && (
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-blue-500" />
              <span>{new Date(campaign.deadline).toLocaleDateString()}</span>
            </div>
          )}
        </div>
        
        {deliverables.length > 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">DELIVERABLES</p>
            <div className="flex flex-wrap gap-1">
              {deliverables.slice(0, 2).map((deliverable: string, index: number) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {deliverable}
                </Badge>
              ))}
              {deliverables.length > 2 && (
                <Badge variant="secondary" className="text-xs">
                  +{deliverables.length - 2} more
                </Badge>
              )}
            </div>
          </div>
        )}
        
        <div className="flex space-x-2 pt-2">
          <Button size="sm" variant="outline" className="flex-1">
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </Button>
          <Button 
            size="sm" 
            className="flex-1 bg-accent hover:bg-accent/90"
            onClick={handleApply}
            disabled={applying}
          >
            {applying ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Applying...
              </>
            ) : (
              <>
                <Heart className="w-4 h-4 mr-2" />
                Apply Now
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}