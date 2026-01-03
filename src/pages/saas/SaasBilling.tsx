import React, { useState } from 'react';
import { 
  CreditCard, 
  Check, 
  Zap, 
  Crown, 
  Shield, 
  Download,
  ExternalLink,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface PlanFeature {
  name: string;
  free: boolean | string;
  pro: boolean | string;
  enterprise: boolean | string;
}

const planFeatures: PlanFeature[] = [
  { name: 'Projects', free: '3', pro: '25', enterprise: 'Unlimited' },
  { name: 'Team Members', free: '1', pro: '10', enterprise: 'Unlimited' },
  { name: 'API Requests/month', free: '1,000', pro: '50,000', enterprise: 'Unlimited' },
  { name: 'Storage', free: '1 GB', pro: '25 GB', enterprise: '500 GB' },
  { name: 'AI Credits/month', free: '100', pro: '5,000', enterprise: 'Unlimited' },
  { name: 'Priority Support', free: false, pro: true, enterprise: true },
  { name: 'Custom Integrations', free: false, pro: true, enterprise: true },
  { name: 'SSO Authentication', free: false, pro: false, enterprise: true },
  { name: 'Dedicated Account Manager', free: false, pro: false, enterprise: true },
  { name: 'SLA Guarantee', free: false, pro: false, enterprise: true },
];

interface Invoice {
  id: string;
  date: string;
  amount: string;
  status: 'paid' | 'pending' | 'failed';
  description: string;
}

const invoices: Invoice[] = [
  { id: 'INV-001', date: '2024-01-01', amount: '$49.00', status: 'paid', description: 'Pro Plan - January' },
  { id: 'INV-002', date: '2023-12-01', amount: '$49.00', status: 'paid', description: 'Pro Plan - December' },
  { id: 'INV-003', date: '2023-11-01', amount: '$49.00', status: 'paid', description: 'Pro Plan - November' },
  { id: 'INV-004', date: '2023-10-01', amount: '$49.00', status: 'paid', description: 'Pro Plan - October' },
];

export const SaasBilling: React.FC = () => {
  const [currentPlan] = useState<'free' | 'pro' | 'enterprise'>('pro');
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">Paid</Badge>;
      case 'pending':
        return <Badge className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Billing & Subscription</h1>
        <p className="text-muted-foreground">Manage your subscription and billing information</p>
      </div>

      {/* Current Plan Overview */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-amber-500" />
                Pro Plan
              </CardTitle>
              <CardDescription>Your current subscription</CardDescription>
            </div>
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500">Active</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Monthly Cost</p>
              <p className="text-2xl font-bold">$49<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Next Billing Date</p>
              <p className="text-lg font-semibold">February 1, 2024</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Payment Method</p>
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                <span>•••• 4242</span>
              </div>
            </div>
            <div className="flex items-end">
              <Button variant="outline">
                Manage Subscription
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">API Requests</span>
                <span className="text-sm text-muted-foreground">32,450 / 50,000</span>
              </div>
              <Progress value={65} className="h-2" />
              <p className="text-xs text-muted-foreground">Resets in 12 days</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Storage Used</span>
                <span className="text-sm text-muted-foreground">18.5 GB / 25 GB</span>
              </div>
              <Progress value={74} className="h-2" />
              <p className="text-xs text-muted-foreground">74% of plan limit</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">AI Credits</span>
                <span className="text-sm text-muted-foreground">3,200 / 5,000</span>
              </div>
              <Progress value={64} className="h-2" />
              <p className="text-xs text-muted-foreground">Resets in 12 days</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Plans Comparison */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Available Plans</CardTitle>
              <CardDescription>Compare features and choose the right plan for you</CardDescription>
            </div>
            <Tabs value={billingPeriod} onValueChange={(v) => setBillingPeriod(v as 'monthly' | 'yearly')}>
              <TabsList>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="yearly">
                  Yearly
                  <Badge variant="secondary" className="ml-2 text-xs">-20%</Badge>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Free Plan */}
            <Card className="relative">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-gray-500" />
                  Free
                </CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <CardDescription>Perfect for getting started</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {planFeatures.slice(0, 5).map((feature) => (
                    <li key={feature.name} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>{feature.name}: {feature.free}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" disabled={currentPlan === 'free'}>
                  {currentPlan === 'free' ? 'Current Plan' : 'Downgrade'}
                </Button>
              </CardFooter>
            </Card>

            {/* Pro Plan */}
            <Card className="relative border-primary shadow-lg">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-primary to-primary/70">Most Popular</Badge>
              </div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-amber-500" />
                  Pro
                </CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">${billingPeriod === 'yearly' ? '39' : '49'}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <CardDescription>For growing teams and businesses</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {planFeatures.slice(0, 7).map((feature) => (
                    <li key={feature.name} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>{feature.name}: {typeof feature.pro === 'boolean' ? (feature.pro ? '✓' : '✗') : feature.pro}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" disabled={currentPlan === 'pro'}>
                  {currentPlan === 'pro' ? 'Current Plan' : 'Upgrade to Pro'}
                </Button>
              </CardFooter>
            </Card>

            {/* Enterprise Plan */}
            <Card className="relative">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-violet-500" />
                  Enterprise
                </CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">Custom</span>
                </div>
                <CardDescription>For large organizations</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {planFeatures.map((feature) => (
                    <li key={feature.name} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>{feature.name}: {typeof feature.enterprise === 'boolean' ? (feature.enterprise ? '✓' : '✗') : feature.enterprise}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Contact Sales
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>View and download your past invoices</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell>{invoice.description}</TableCell>
                  <TableCell>{invoice.amount}</TableCell>
                  <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
          <CardDescription>Manage your payment information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">VISA</span>
              </div>
              <div>
                <p className="font-medium">Visa ending in 4242</p>
                <p className="text-sm text-muted-foreground">Expires 12/2025</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Default</Badge>
              <Button variant="outline" size="sm">Update</Button>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline">
            <CreditCard className="mr-2 h-4 w-4" />
            Add Payment Method
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SaasBilling;
