import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Badge } from './badge';
import { Separator } from './separator';
import { Calendar, Clock, Download, Eye, Star } from 'lucide-react';

const meta = {
  title: 'UI Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A flexible card component for displaying content in a structured layout.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content goes here.</p>
      </CardContent>
    </Card>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Project Setup</CardTitle>
        <CardDescription>Get started with your new project</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This card includes a footer with action buttons.</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Deploy</Button>
      </CardFooter>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Card with a footer containing action buttons.',
      },
    },
  },
};

export const APIKeyCard: Story = {
  render: () => (
    <Card className="w-[400px]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Production API Key</CardTitle>
            <CardDescription>Main production key for voice synthesis</CardDescription>
          </div>
          <Badge variant="default">Active</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">API Key</label>
          <div className="flex items-center space-x-2">
            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
              zvi_prod_****************************
            </code>
            <Button size="sm" variant="outline">
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <Separator />
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Created</p>
            <p className="font-medium">Jan 10, 2024</p>
          </div>
          <div>
            <p className="text-muted-foreground">Last Used</p>
            <p className="font-medium">2 hours ago</p>
          </div>
          <div>
            <p className="text-muted-foreground">Requests</p>
            <p className="font-medium">8,450</p>
          </div>
          <div>
            <p className="text-muted-foreground">Rate Limit</p>
            <p className="font-medium">10,000/hour</p>
          </div>
        </div>

        <div>
          <p className="text-sm text-muted-foreground mb-2">Permissions</p>
          <div className="flex flex-wrap gap-1">
            <Badge variant="secondary">voice.synthesize</Badge>
            <Badge variant="secondary">voice.list</Badge>
            <Badge variant="secondary">usage.view</Badge>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm">
          Edit
        </Button>
        <Button variant="destructive" size="sm">
          Delete
        </Button>
      </CardFooter>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Real-world example: API key management card from the dashboard.',
      },
    },
  },
};

export const StatsCard: Story = {
  render: () => (
    <Card className="w-[300px]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">API Calls This Month</CardTitle>
        <Download className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">12,450</div>
        <p className="text-xs text-muted-foreground">
          +20.1% from last month
        </p>
        <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary w-[65%]" />
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          65% of monthly limit
        </p>
      </CardContent>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Dashboard statistics card with progress indicator.',
      },
    },
  },
};

export const BlogPostCard: Story = {
  render: () => (
    <Card className="w-[350px] cursor-pointer hover:shadow-md transition-shadow">
      <div className="aspect-video bg-muted rounded-t-lg" />
      <CardHeader>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Jan 20, 2024</span>
          <Clock className="h-4 w-4" />
          <span>5 min read</span>
        </div>
        <CardTitle className="line-clamp-2">
          Getting Started with Zero Voice Infinity API
        </CardTitle>
        <CardDescription className="line-clamp-3">
          Learn how to integrate our voice synthesis API into your applications with this comprehensive guide covering authentication, basic requests, and best practices.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">Tutorial</Badge>
          <Badge variant="secondary">API</Badge>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Star className="h-4 w-4 fill-current text-yellow-500" />
          <span>4.8</span>
        </div>
        <Button variant="ghost" size="sm">
          Read More
        </Button>
      </CardFooter>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Blog post or article card with image, metadata, and actions.',
      },
    },
  },
};

export const SimpleCard: Story = {
  render: () => (
    <Card className="w-[300px] p-6">
      <h3 className="font-semibold mb-2">Simple Card</h3>
      <p className="text-sm text-muted-foreground">
        A simple card without using the header/content/footer structure.
      </p>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Minimal card usage without structured sections.',
      },
    },
  },
};

export const CardGrid: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i} className="p-4">
          <h3 className="font-medium mb-2">Card {i}</h3>
          <p className="text-sm text-muted-foreground">
            This is card number {i} in a responsive grid layout.
          </p>
        </Card>
      ))}
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Cards arranged in a responsive grid layout.',
      },
    },
  },
}; 