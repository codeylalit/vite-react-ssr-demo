import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { CreditCard, Download, Calendar, DollarSign, Zap, Shield, Headphones } from 'lucide-react';

const Billing = () => {
  const billingData = {
    currentPlan: {
      name: 'Developer',
      price: 29,
      period: 'month',
      nextBilling: '2024-07-24',
      features: [
        '10,000 API calls/month',
        'Up to 10 concurrent requests',
        '30 days data retention',
        'Email support',
        'Standard rate limits',
      ],
    },
    usage: {
      apiCalls: 2847,
      limit: 10000,
      percentage: 28.47,
    },
    invoices: [
      { id: 'INV-2024-06', date: '2024-06-24', amount: 29.0, status: 'paid' },
      { id: 'INV-2024-05', date: '2024-05-24', amount: 29.0, status: 'paid' },
      { id: 'INV-2024-04', date: '2024-04-24', amount: 29.0, status: 'paid' },
      { id: 'INV-2024-03', date: '2024-03-24', amount: 29.0, status: 'paid' },
    ],
    plans: [
      {
        name: 'Starter',
        price: 0,
        period: 'month',
        features: [
          '1,000 API calls/month',
          'Up to 2 concurrent requests',
          '7 days data retention',
          'Community support',
          'Basic rate limits',
        ],
        current: false,
      },
      {
        name: 'Developer',
        price: 29,
        period: 'month',
        features: [
          '10,000 API calls/month',
          'Up to 10 concurrent requests',
          '30 days data retention',
          'Email support',
          'Standard rate limits',
        ],
        current: true,
      },
      {
        name: 'Professional',
        price: 99,
        period: 'month',
        features: [
          '100,000 API calls/month',
          'Up to 50 concurrent requests',
          '90 days data retention',
          'Priority support',
          'Higher rate limits',
          'Custom models',
        ],
        current: false,
      },
      {
        name: 'Enterprise',
        price: 299,
        period: 'month',
        features: [
          'Unlimited API calls',
          'Unlimited concurrent requests',
          '1 year data retention',
          '24/7 phone support',
          'No rate limits',
          'Custom models',
          'Dedicated infrastructure',
        ],
        current: false,
      },
    ],
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Billing & Plans</h1>
          <p className="text-gray-600 mt-1">Manage your subscription and billing information</p>
        </div>
      </div>

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Current Plan
            <Badge className="bg-gradient-to-r from-[#1a1947] via-[#2d4cc8] to-[#4c7cf0] text-white">
              {billingData.currentPlan.name}
            </Badge>
          </CardTitle>
          <CardDescription>Your active subscription details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-[#2d4cc8]" />
                <span className="text-sm font-medium">Monthly Cost</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                ${billingData.currentPlan.price}/{billingData.currentPlan.period}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-[#2d4cc8]" />
                <span className="text-sm font-medium">Next Billing</span>
              </div>
              <div className="text-lg font-semibold text-gray-700">
                {formatDate(billingData.currentPlan.nextBilling)}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-[#2d4cc8]" />
                <span className="text-sm font-medium">Usage This Month</span>
              </div>
              <div className="text-lg font-semibold text-gray-700">
                {billingData.usage.apiCalls.toLocaleString()} /{' '}
                {billingData.usage.limit.toLocaleString()} calls
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="font-medium mb-3">Plan Features</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {billingData.currentPlan.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-[#2d4cc8] to-[#4c7cf0] rounded-full" />
                  <span className="text-sm text-gray-600">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex space-x-3">
            <Button variant="outline">Manage Plan</Button>
            <Button variant="outline">Update Payment Method</Button>
            <Button variant="outline">Download Invoice</Button>
          </div>
        </CardContent>
      </Card>

      {/* Available Plans */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Available Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {billingData.plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative ${plan.current ? 'ring-2 ring-[#2d4cc8] bg-gradient-to-br from-[#2d4cc8]/5 to-[#4c7cf0]/5' : ''}`}
            >
              {plan.current && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-[#1a1947] via-[#2d4cc8] to-[#4c7cf0] text-white">
                    Current Plan
                  </Badge>
                </div>
              )}

              <CardHeader>
                <CardTitle className="text-center">{plan.name}</CardTitle>
                <div className="text-center">
                  <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
                  <span className="text-gray-600">/{plan.period}</span>
                </div>
              </CardHeader>

              <CardContent>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center space-x-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-[#2d4cc8] rounded-full flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full ${
                    plan.current
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#1a1947] via-[#2d4cc8] to-[#4c7cf0] hover:from-[#1a1947]/90 hover:via-[#2d4cc8]/90 hover:to-[#4c7cf0]/90 text-white'
                  }`}
                  disabled={plan.current}
                >
                  {plan.current ? 'Current Plan' : plan.price === 0 ? 'Downgrade' : 'Upgrade'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>Your recent invoices and payments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {billingData.invoices.map((invoice, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-white rounded-lg">
                    <CreditCard className="h-4 w-4 text-[#2d4cc8]" />
                  </div>
                  <div>
                    <div className="font-medium">{invoice.id}</div>
                    <div className="text-sm text-gray-600">{formatDate(invoice.date)}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="font-medium">${invoice.amount.toFixed(2)}</div>
                    <Badge
                      variant={invoice.status === 'paid' ? 'default' : 'destructive'}
                      className="text-xs"
                    >
                      {invoice.status}
                    </Badge>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Billing;
