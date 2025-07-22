import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Plus,
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
  XCircle
} from 'lucide-react'
import blink from '@/blink/client'
import { User, Campaign, CampaignApplication } from '@/types'
import CreateCampaignModal from './CreateCampaignModal'
import CampaignCard from './CampaignCard'
import CreatorDiscovery from './CreatorDiscovery'
import MessagingCenter from './MessagingCenter'

interface BrandDashboardProps {
  user: User
}

export default function BrandDashboard({ user }: BrandDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [applications, setApplications] = useState<CampaignApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateCampaign, setShowCreateCampaign] = useState(false)

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true)
      
      // Load campaigns
      const campaignData = await blink.db.campaigns.list({
        where: { brandUserId: user.id },
        orderBy: { createdAt: 'desc' }
      })
      setCampaigns(campaignData as Campaign[])

      // Load applications for all campaigns
      if (campaignData.length > 0) {
        const campaignIds = campaignData.map(c => c.id)
        const applicationData = await blink.db.campaignApplications.list({
          where: { 
            campaignId: { in: campaignIds }
          },
          orderBy: { createdAt: 'desc' }
        })
        setApplications(applicationData as CampaignApplication[])
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }, [user.id])

  useEffect(() => {
    loadDashboardData()
  }, [user.id, loadDashboardData])

  const handleLogout = () => {
    blink.auth.logout()
  }

  const stats = {
    totalCampaigns: campaigns.length,
    activeCampaigns: campaigns.filter(c => c.status === 'active').length,
    totalApplications: applications.length,
    pendingApplications: applications.filter(a => a.status === 'pending').length
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
              <Badge className="bg-primary/10 text-primary border-primary/20">
                Brand Dashboard
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
              <Briefcase className="w-4 h-4" />
              <span>Campaigns</span>
            </TabsTrigger>
            <TabsTrigger value="creators" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Discover</span>
            </TabsTrigger>
            <TabsTrigger value="applications" className="flex items-center space-x-2">
              <Star className="w-4 h-4" />
              <span>Applications</span>
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
                      <p className="text-sm font-medium text-muted-foreground">Total Campaigns</p>
                      <p className="text-3xl font-bold">{stats.totalCampaigns}</p>
                    </div>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Briefcase className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-effect">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Campaigns</p>
                      <p className="text-3xl font-bold">{stats.activeCampaigns}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-green-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-effect">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Applications</p>
                      <p className="text-3xl font-bold">{stats.totalApplications}</p>
                    </div>
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-accent" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-effect">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Pending Reviews</p>
                      <p className="text-3xl font-bold">{stats.pendingApplications}</p>
                    </div>
                    <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6 text-orange-500" />
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
                    <Briefcase className="w-5 h-5" />
                    <span>Recent Campaigns</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {campaigns.slice(0, 3).map((campaign) => (
                    <div key={campaign.id} className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                      <div>
                        <p className="font-medium">{campaign.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {campaign.status === 'active' ? 'Active' : 'Draft'}
                        </p>
                      </div>
                      <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'}>
                        {campaign.status}
                      </Badge>
                    </div>
                  ))}
                  {campaigns.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      No campaigns yet. Create your first campaign!
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card className="glass-effect">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Star className="w-5 h-5" />
                    <span>Recent Applications</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {applications.slice(0, 3).map((application) => (
                    <div key={application.id} className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                      <div>
                        <p className="font-medium">New Application</p>
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
                      No applications yet.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="campaigns" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Your Campaigns</h2>
              <Button onClick={() => setShowCreateCampaign(true)} className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Create Campaign
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
              {campaigns.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <Target className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No campaigns yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Create your first campaign to start connecting with creators
                  </p>
                  <Button onClick={() => setShowCreateCampaign(true)} className="bg-primary hover:bg-primary/90">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Campaign
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="creators">
            <CreatorDiscovery />
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Campaign Applications</h2>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {applications.map((application) => (
                <Card key={application.id} className="glass-effect">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback>C</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">Creator Application</p>
                          <p className="text-sm text-muted-foreground">
                            Applied {new Date(application.createdAt).toLocaleDateString()}
                          </p>
                        </div>
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

                    {application.status === 'pending' && (
                      <div className="flex space-x-2">
                        <Button size="sm" className="bg-green-500 hover:bg-green-600">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Accept
                        </Button>
                        <Button size="sm" variant="outline">
                          <XCircle className="w-4 h-4 mr-2" />
                          Decline
                        </Button>
                        <Button size="sm" variant="ghost">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Message
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
              {applications.length === 0 && (
                <div className="text-center py-12">
                  <Star className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No applications yet</h3>
                  <p className="text-muted-foreground">
                    Applications will appear here when creators apply to your campaigns
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="messages">
            <MessagingCenter user={user} />
          </TabsContent>
        </Tabs>
      </div>

      {showCreateCampaign && (
        <CreateCampaignModal
          user={user}
          onClose={() => setShowCreateCampaign(false)}
          onSuccess={() => {
            setShowCreateCampaign(false)
            loadDashboardData()
          }}
        />
      )}
    </div>
  )
}