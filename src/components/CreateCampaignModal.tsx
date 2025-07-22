import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { 
  Plus,
  X,
  Calendar as CalendarIcon,
  DollarSign,
  Target,
  CheckCircle
} from 'lucide-react'
import { format } from 'date-fns'
import blink from '@/blink/client'
import { User } from '@/types'

interface CreateCampaignModalProps {
  user: User
  onClose: () => void
  onSuccess: () => void
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

const deliverableOptions = [
  'Instagram Post',
  'Instagram Story',
  'Instagram Reel',
  'YouTube Video',
  'YouTube Short',
  'TikTok Video',
  'Twitter Post',
  'LinkedIn Article',
  'Blog Post',
  'Product Review',
  'Unboxing Video',
  'Tutorial',
  'Live Stream',
  'Podcast Mention'
]

const requirementOptions = [
  'Must include product in content',
  'Must mention brand name',
  'Must include specific hashtags',
  'Must tag brand account',
  'Must include call-to-action',
  'Must show product in use',
  'Must include discount code',
  'Must follow brand guidelines',
  'Must submit for approval before posting',
  'Must provide analytics after posting'
]

export default function CreateCampaignModal({ user, onClose, onSuccess }: CreateCampaignModalProps) {
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  
  // Campaign data
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [budget, setBudget] = useState('')
  const [industry, setIndustry] = useState('')
  const [targetAudience, setTargetAudience] = useState('')
  const [deadline, setDeadline] = useState<Date>()
  const [selectedDeliverables, setSelectedDeliverables] = useState<string[]>([])
  const [selectedRequirements, setSelectedRequirements] = useState<string[]>([])
  const [customRequirement, setCustomRequirement] = useState('')

  const totalSteps = 3

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

  const handleDeliverableToggle = (deliverable: string) => {
    setSelectedDeliverables(prev => 
      prev.includes(deliverable)
        ? prev.filter(d => d !== deliverable)
        : [...prev, deliverable]
    )
  }

  const handleRequirementToggle = (requirement: string) => {
    setSelectedRequirements(prev => 
      prev.includes(requirement)
        ? prev.filter(r => r !== requirement)
        : [...prev, requirement]
    )
  }

  const addCustomRequirement = () => {
    if (customRequirement.trim() && !selectedRequirements.includes(customRequirement.trim())) {
      setSelectedRequirements(prev => [...prev, customRequirement.trim()])
      setCustomRequirement('')
    }
  }

  const removeRequirement = (requirement: string) => {
    setSelectedRequirements(prev => prev.filter(r => r !== requirement))
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await blink.db.campaigns.create({
        id: `campaign_${Date.now()}`,
        brandUserId: user.id,
        title,
        description,
        budget: budget ? parseFloat(budget) : undefined,
        requirements: JSON.stringify(selectedRequirements),
        deliverables: JSON.stringify(selectedDeliverables),
        deadline: deadline?.toISOString().split('T')[0],
        status: 'active',
        industry,
        targetAudience,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      
      onSuccess()
    } catch (error) {
      console.error('Error creating campaign:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Create New Campaign
          </DialogTitle>
          <p className="text-muted-foreground">
            Step {step} of {totalSteps} - Let's create an amazing campaign!
          </p>
        </DialogHeader>

        <div className="space-y-6">
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold mb-2">Campaign Basics</h3>
                <p className="text-muted-foreground">Tell us about your campaign</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Campaign Title *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Summer Collection Launch"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Campaign Description *</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your campaign goals, brand message, and what you're looking for..."
                    className="mt-1"
                    rows={4}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="budget">Budget (USD)</Label>
                    <div className="relative mt-1">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="budget"
                        type="number"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        placeholder="5000"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="industry">Industry</Label>
                    <Select value={industry} onValueChange={setIndustry}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        {industries.map((ind) => (
                          <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="targetAudience">Target Audience</Label>
                  <Textarea
                    id="targetAudience"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    placeholder="Describe your target audience demographics, interests, etc."
                    className="mt-1"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold mb-2">Deliverables & Timeline</h3>
                <p className="text-muted-foreground">What do you need from creators?</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label>Required Deliverables *</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {deliverableOptions.map((deliverable) => (
                      <Badge
                        key={deliverable}
                        variant={selectedDeliverables.includes(deliverable) ? "default" : "outline"}
                        className="cursor-pointer justify-center py-2"
                        onClick={() => handleDeliverableToggle(deliverable)}
                      >
                        {deliverable}
                      </Badge>
                    ))}
                  </div>
                  {selectedDeliverables.length === 0 && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Select at least one deliverable
                    </p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="deadline">Campaign Deadline</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal mt-1"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {deadline ? format(deadline, "PPP") : "Select deadline"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={deadline}
                        onSelect={setDeadline}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold mb-2">Campaign Requirements</h3>
                <p className="text-muted-foreground">Set your campaign guidelines</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label>Campaign Requirements</Label>
                  <div className="grid grid-cols-1 gap-2 mt-2">
                    {requirementOptions.map((requirement) => (
                      <Badge
                        key={requirement}
                        variant={selectedRequirements.includes(requirement) ? "default" : "outline"}
                        className="cursor-pointer justify-start py-2 px-3"
                        onClick={() => handleRequirementToggle(requirement)}
                      >
                        {requirement}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="customRequirement">Add Custom Requirement</Label>
                  <div className="flex space-x-2 mt-1">
                    <Input
                      id="customRequirement"
                      value={customRequirement}
                      onChange={(e) => setCustomRequirement(e.target.value)}
                      placeholder="Enter custom requirement..."
                      className="flex-1"
                    />
                    <Button onClick={addCustomRequirement} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                {selectedRequirements.length > 0 && (
                  <div>
                    <Label>Selected Requirements</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedRequirements.map((requirement) => (
                        <Badge
                          key={requirement}
                          variant="default"
                          className="flex items-center space-x-1"
                        >
                          <span>{requirement}</span>
                          <X
                            className="w-3 h-3 cursor-pointer"
                            onClick={() => removeRequirement(requirement)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={step === 1 ? onClose : handleBack}
            >
              {step === 1 ? 'Cancel' : 'Back'}
            </Button>
            
            {step < totalSteps ? (
              <Button 
                onClick={handleNext}
                disabled={
                  (step === 1 && (!title || !description)) ||
                  (step === 2 && selectedDeliverables.length === 0)
                }
              >
                Next
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit} 
                disabled={loading || selectedDeliverables.length === 0}
                className="bg-primary hover:bg-primary/90"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Create Campaign
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}