import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';
import { Download, Play, Plus, Trash2 } from 'lucide-react';

const meta = {
  title: 'UI Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A versatile button component with multiple variants, sizes, and states. Built on top of Radix UI primitives with full accessibility support.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
      description: 'Visual style variant of the button',
    },
    size: {
      control: { type: 'select' },
      options: ['default', 'sm', 'lg', 'icon'],
      description: 'Size of the button',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
    },
    asChild: {
      control: 'boolean',
      description: 'Change the component to the HTML tag or custom component of the only child',
    },
  },
  args: { onClick: () => {} },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic variants
export const Default: Story = {
  args: {
    children: 'Default Button',
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Delete Account',
  },
  parameters: {
    docs: {
      description: {
        story: 'Used for dangerous or destructive actions like deleting items.',
      },
    },
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline Button',
  },
  parameters: {
    docs: {
      description: {
        story: 'A button with a border and transparent background.',
      },
    },
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Action',
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost Button',
  },
  parameters: {
    docs: {
      description: {
        story: 'A subtle button with no background or border.',
      },
    },
  },
};

export const Link: Story = {
  args: {
    variant: 'link',
    children: 'Link Button',
  },
  parameters: {
    docs: {
      description: {
        story: 'Styled like a hyperlink.',
      },
    },
  },
};

// Size variants
export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small Button',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large Button',
  },
};

export const Icon: Story = {
  args: {
    size: 'icon',
    children: <Plus className="h-4 w-4" />,
  },
  parameters: {
    docs: {
      description: {
        story: 'Square button optimized for icons.',
      },
    },
  },
};

// With icons
export const WithLeftIcon: Story = {
  args: {
    children: (
      <>
        <Download className="mr-2 h-4 w-4" />
        Download
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Button with an icon on the left side.',
      },
    },
  },
};

export const WithRightIcon: Story = {
  args: {
    children: (
      <>
        Play Audio
        <Play className="ml-2 h-4 w-4" />
      </>
    ),
  },
};

// States
export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled Button',
  },
  parameters: {
    docs: {
      description: {
        story: 'Button in disabled state.',
      },
    },
  },
};

export const Loading: Story = {
  args: {
    disabled: true,
    children: (
      <>
        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        Loading...
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Button showing loading state.',
      },
    },
  },
};

// AsChild usage
export const AsLink: Story = {
  args: {
    asChild: true,
    children: <a href="https://example.com">External Link</a>,
  },
  parameters: {
    docs: {
      description: {
        story: 'Button component rendered as an anchor tag using asChild prop.',
      },
    },
  },
};

// Real-world examples
export const PrimaryAction: Story = {
  args: {
    size: 'lg',
    children: (
      <>
        <Plus className="mr-2 h-5 w-5" />
        Create API Key
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Primary action button as used in the dashboard.',
      },
    },
  },
};

export const DangerousAction: Story = {
  args: {
    variant: 'destructive',
    children: (
      <>
        <Trash2 className="mr-2 h-4 w-4" />
        Delete API Key
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Destructive action button with warning icon.',
      },
    },
  },
};

// Button groups
export const ButtonGroup: Story = {
  render: () => (
    <div className="flex gap-2">
      <Button variant="outline">Cancel</Button>
      <Button>Save Changes</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Common button group pattern with secondary and primary actions.',
      },
    },
  },
};

// All variants showcase
export const AllVariants: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
      <Button>Default</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All button variants displayed together for comparison.',
      },
    },
  },
};

// All sizes showcase
export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon">
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All button sizes displayed together for comparison.',
      },
    },
  },
}; 