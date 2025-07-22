import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  MessageCircle,
  Send,
  Search,
  Plus,
  MoreVertical,
  Phone,
  Video,
  Paperclip,
  Smile
} from 'lucide-react'
import blink from '@/blink/client'
import { User, Message } from '@/types'

interface MessagingCenterProps {
  user: User
}

interface Conversation {
  id: string
  otherUser: User
  lastMessage?: Message
  unreadCount: number
}

export default function MessagingCenter({ user }: MessagingCenterProps) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  const loadConversations = useCallback(async () => {
    try {
      setLoading(true)
      
      // For now, show empty state since we don't have conversations yet
      setConversations([])
    } catch (error) {
      console.error('Error loading conversations:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  const loadMessages = useCallback(async (conversationId: string) => {
    try {
      // For now, show empty messages
      setMessages([])
    } catch (error) {
      console.error('Error loading messages:', error)
    }
  }, [])

  useEffect(() => {
    loadConversations()
  }, [loadConversations])

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id)
    }
  }, [selectedConversation, loadMessages])

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return
    
    try {
      const message = await blink.db.messages.create({
        id: `msg_${Date.now()}`,
        senderUserId: user.id,
        recipientUserId: selectedConversation.id,
        content: newMessage.trim(),
        messageType: 'text',
        readStatus: 0,
        createdAt: new Date().toISOString()
      })
      
      setMessages(prev => [...prev, message as Message])
      setNewMessage('')
      
      // Update conversation last message
      setConversations(prev => 
        prev.map(conv => 
          conv.id === selectedConversation.id 
            ? { ...conv, lastMessage: message as Message }
            : conv
        )
      )
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const filteredConversations = conversations.filter(conv =>
    conv.otherUser.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.otherUser.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading messages...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
      {/* Conversations List */}
      <Card className="glass-effect lg:col-span-1">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Messages</CardTitle>
            <Button size="sm" variant="ghost">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <ScrollArea className="h-[480px]">
            <div className="text-center py-12 px-4">
              <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">No conversations yet</h3>
              <p className="text-sm text-muted-foreground">
                Start messaging creators or brands to see conversations here
              </p>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Chat Area */}
      <Card className="glass-effect lg:col-span-2">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center">
            <MessageCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Select a conversation</h3>
            <p className="text-muted-foreground">
              Choose a conversation from the list to start messaging
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}