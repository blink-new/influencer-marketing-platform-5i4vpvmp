import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Calendar,
  DollarSign,
  Eye,
  Users,
  Target,
  Clock,
  CheckCircle,
  Pause,
  Play
} from 'lucide-react'
import { Campaign } from '@/types'

interface CampaignCardProps {
  campaign: Campaign
}

export default function CampaignCard({ campaign }: CampaignCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-500 border-green-500/20'
      case 'draft':
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20'
      case 'paused':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
      case 'completed':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
      case 'cancelled':
        return 'bg-red-500/10 text-red-500 border-red-500/20'
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Play className="w-3 h-3" />
      case 'draft':
        return <Clock className="w-3 h-3" />
      case 'paused':
        return <Pause className="w-3 h-3" />
      case 'completed':
        return <CheckCircle className="w-3 h-3" />
      default:
        return <Clock className="w-3 h-3" />
    }
  }

  const deliverables = campaign.deliverables ? JSON.parse(campaign.deliverables) : []
  const requirements = campaign.requirements ? JSON.parse(campaign.requirements) : []

  return (
    <Card className="glass-effect hover:shadow-xl transition-all duration-300 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors">
            {campaign.title}
          </CardTitle>
          <Badge className={`ml-2 flex items-center space-x-1 ${getStatusColor(campaign.status)}`}>
            {getStatusIcon(campaign.status)}
            <span className="capitalize">{campaign.status}</span>
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
          
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4 text-accent" />
            <span>{deliverables.length} deliverable{deliverables.length !== 1 ? 's' : ''}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-primary" />
            <span>0 applications</span>
          </div>
        </div>
        
        {deliverables.length > 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">DELIVERABLES</p>
            <div className="flex flex-wrap gap-1">
              {deliverables.slice(0, 3).map((deliverable: string, index: number) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {deliverable}
                </Badge>
              ))}
              {deliverables.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{deliverables.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}
        
        <div className="flex space-x-2 pt-2">
          <Button size="sm" variant="outline" className="flex-1">
            <Eye className="w-4 h-4 mr-2" />
            View
          </Button>
          <Button size="sm" className="flex-1 bg-primary hover:bg-primary/90">
            <Users className="w-4 h-4 mr-2" />
            Applications
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}