import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { Badge } from '@/shared/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import {
  HelpCircle,
  MessageCircle,
  Mail,
  Phone,
  BookOpen,
  ExternalLink,
  Clock,
  CheckCircle2,
} from 'lucide-react';

const Support = () => {
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    priority: '',
    category: '',
    message: '',
  });

  const faqs = [
    {
      question: 'How do I get started with the API?',
      answer:
        'Generate an API key in the API Keys section, then follow our quick start guide in the documentation.',
    },
    {
      question: "What's included in my current plan?",
      answer:
        'Your Developer plan includes 10,000 API calls/month, email support, and access to all standard voices.',
    },
    {
      question: 'How can I upgrade my plan?',
      answer: 'Visit the Billing section to compare plans and upgrade instantly with no downtime.',
    },
    {
      question: 'What languages are supported?',
      answer:
        'We support 216 languages including English, Spanish, French, German, Japanese, and many more.',
    },
  ];

  const tickets = [
    { id: 'TKT-001', subject: 'API rate limit question', status: 'resolved', date: '2024-06-20' },
    { id: 'TKT-002', subject: 'Voice quality issue', status: 'in-progress', date: '2024-06-22' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Support Center</h1>
          <p className="text-gray-600 mt-1">
            Get help and support for your Zero Voice Infinity account
          </p>
        </div>
      </div>

      {/* Contact Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5 text-[#2d4cc8]" />
              <span>Live Chat</span>
            </CardTitle>
            <CardDescription>Get instant help from our support team</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-green-600">Available now</span>
            </div>
            <Button className="w-full bg-gradient-to-r from-[#1a1947] via-[#2d4cc8] to-[#4c7cf0] text-white">
              Start Chat
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Mail className="h-5 w-5 text-[#2d4cc8]" />
              <span>Email Support</span>
            </CardTitle>
            <CardDescription>Send us a detailed message</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-3">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Response within 24h</span>
            </div>
            <Button variant="outline" className="w-full">
              Send Email
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-[#2d4cc8]" />
              <span>Documentation</span>
            </CardTitle>
            <CardDescription>Browse our comprehensive guides</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-3">
              <ExternalLink className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Self-service help</span>
            </div>
            <Button variant="outline" className="w-full">
              View Docs
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Create Ticket */}
      <Card>
        <CardHeader>
          <CardTitle>Create Support Ticket</CardTitle>
          <CardDescription>Submit a detailed support request</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="Brief description of your issue"
                value={ticketForm.subject}
                onChange={e => setTicketForm({ ...ticketForm, subject: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select onValueChange={value => setTicketForm({ ...ticketForm, priority: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select onValueChange={value => setTicketForm({ ...ticketForm, category: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="api">API Issues</SelectItem>
                <SelectItem value="billing">Billing</SelectItem>
                <SelectItem value="technical">Technical Support</SelectItem>
                <SelectItem value="account">Account Management</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Describe your issue in detail..."
              rows={4}
              value={ticketForm.message}
              onChange={e => setTicketForm({ ...ticketForm, message: e.target.value })}
            />
          </div>
          <Button className="bg-gradient-to-r from-[#1a1947] via-[#2d4cc8] to-[#4c7cf0] text-white">
            Submit Ticket
          </Button>
        </CardContent>
      </Card>

      {/* My Tickets */}
      <Card>
        <CardHeader>
          <CardTitle>My Support Tickets</CardTitle>
          <CardDescription>Track your recent support requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tickets.map(ticket => (
              <div
                key={ticket.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <div className="font-medium">{ticket.subject}</div>
                  <div className="text-sm text-gray-600">
                    #{ticket.id} • {ticket.date}
                  </div>
                </div>
                <Badge
                  variant={ticket.status === 'resolved' ? 'default' : 'secondary'}
                  className={ticket.status === 'resolved' ? 'bg-green-100 text-green-800' : ''}
                >
                  {ticket.status === 'resolved' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                  {ticket.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* FAQ */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
          <CardDescription>Quick answers to common questions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 pb-4 last:border-0">
                <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                  <HelpCircle className="w-4 h-4 mr-2 text-[#2d4cc8]" />
                  {faq.question}
                </h4>
                <p className="text-sm text-gray-600 ml-6">{faq.answer}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Support;
