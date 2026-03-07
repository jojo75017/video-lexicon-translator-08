import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CreditCard, 
  Download, 
  Check, 
  Crown, 
  Zap, 
  Building2,
  Receipt,
  Calendar,
  Shield,
  Star
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Invoice {
  id: string;
  date: string;
  amount: string;
  status: 'payée' | 'en_attente' | 'échouée';
}

const invoices: Invoice[] = [
  { id: 'INV-001', date: '1 Jan 2024', amount: '97€', status: 'payée' },
  { id: 'INV-002', date: '1 Déc 2023', amount: '97€', status: 'payée' },
  { id: 'INV-003', date: '1 Nov 2023', amount: '97€', status: 'payée' },
  { id: 'INV-004', date: '1 Oct 2023', amount: '97€', status: 'payée' },
];

interface PlanFeature {
  name: string;
  free: boolean | string;
  pro: boolean | string;
  enterprise: boolean | string;
}

const planFeatures: PlanFeature[] = [
  { name: 'Appels API', free: '1 000/mois', pro: '50 000/mois', enterprise: 'Illimité' },
  { name: 'Stockage', free: '500 Mo', pro: '50 Go', enterprise: 'Illimité' },
  { name: 'Membres équipe', free: '1', pro: '10', enterprise: 'Illimité' },
  { name: 'Projets', free: '3', pro: '25', enterprise: 'Illimité' },
  { name: 'Support prioritaire', free: false, pro: true, enterprise: true },
  { name: 'Domaine personnalisé', free: false, pro: true, enterprise: true },
  { name: 'Analytiques avancées', free: false, pro: true, enterprise: true },
  { name: 'Accès API', free: false, pro: true, enterprise: true },
  { name: 'Intégrations', free: '3', pro: '20', enterprise: 'Illimité' },
  { name: 'SSO & SAML', free: false, pro: false, enterprise: true },
  { name: 'SLA Garanti', free: false, pro: false, enterprise: true },
  { name: 'Account Manager', free: false, pro: false, enterprise: true },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'payée': return 'bg-green-100 text-green-800';
    case 'en_attente': return 'bg-yellow-100 text-yellow-800';
    case 'échouée': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'payée': return 'Payée';
    case 'en_attente': return 'En attente';
    case 'échouée': return 'Échouée';
    default: return status;
  }
};

export const SaasBilling: React.FC = () => {
  const [billingPeriod, setBillingPeriod] = useState<'mensuel' | 'annuel'>('mensuel');
  const currentPlan = 'pro';

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Facturation</h1>
        <p className="text-muted-foreground">Gérez votre abonnement et les méthodes de paiement</p>
      </div>

      {/* Current Plan Overview */}
      <Card className="border-primary">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                <Crown className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  Plan Pro
                  <Badge variant="secondary">Actuel</Badge>
                </CardTitle>
                <CardDescription>Accès complet à toutes les fonctionnalités Pro</CardDescription>
              </div>
            </div>
            <Button variant="outline">Changer de plan</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Coût</p>
              <p className="text-2xl font-bold">97€<span className="text-sm font-normal text-muted-foreground"> unique</span></p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Date d'achat</p>
              <p className="text-lg font-semibold">1 Janvier 2024</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Moyen de paiement</p>
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                <span>•••• 4242</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Statut</p>
              <Badge className="bg-green-100 text-green-800">Actif</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Historique de facturation
              </CardTitle>
              <CardDescription>Téléchargez vos factures passées</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Tout télécharger
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Facture</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell>{invoice.amount}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(invoice.status)} variant="secondary">
                      {getStatusLabel(invoice.status)}
                    </Badge>
                  </TableCell>
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

      {/* Plan Comparison */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Comparer les Plans</h2>
            <p className="text-muted-foreground">Choisissez le plan parfait pour votre équipe</p>
          </div>
          <Tabs value={billingPeriod} onValueChange={(value) => setBillingPeriod(value as 'mensuel' | 'annuel')}>
            <TabsList>
              <TabsTrigger value="mensuel">Mensuel</TabsTrigger>
              <TabsTrigger value="annuel">
                Annuel
                <Badge variant="secondary" className="ml-2 text-xs">-20%</Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Free Plan */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-muted-foreground" />
                Gratuit
              </CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold">0€</span>
                <span className="text-muted-foreground">/mois</span>
              </div>
              <CardDescription>Parfait pour débuter</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {planFeatures.slice(0, 5).map((feature) => (
                  <li key={feature.name} className="flex items-center gap-2 text-sm">
                    {feature.free ? (
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    ) : (
                      <div className="h-4 w-4 flex-shrink-0" />
                    )}
                    <span className={!feature.free ? 'text-muted-foreground' : ''}>
                      {feature.name}: {typeof feature.free === 'boolean' ? (feature.free ? '✓' : '✗') : feature.free}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Rétrograder
              </Button>
            </CardFooter>
          </Card>

          {/* Pro Plan */}
          <Card className="relative border-primary shadow-lg">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge className="bg-gradient-to-r from-primary to-primary/70">Le plus populaire</Badge>
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-amber-500" />
                Pro
              </CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold">97€</span>
                <span className="text-muted-foreground"> unique</span>
              </div>
              <CardDescription>Pour les équipes en croissance</CardDescription>
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
                {currentPlan === 'pro' ? 'Plan actuel' : 'Passer au Pro'}
              </Button>
            </CardFooter>
          </Card>

          {/* Enterprise Plan */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Entreprise
              </CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold">Personnalisé</span>
              </div>
              <CardDescription>Pour les grandes organisations</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {planFeatures.slice(0, 7).map((feature) => (
                  <li key={feature.name} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span>{feature.name}: {typeof feature.enterprise === 'boolean' ? (feature.enterprise ? '✓' : '✗') : feature.enterprise}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Contacter les ventes
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Moyens de paiement
              </CardTitle>
              <CardDescription>Gérez vos cartes et modes de paiement</CardDescription>
            </div>
            <Button>
              <CreditCard className="h-4 w-4 mr-2" />
              Ajouter une carte
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-4">
              <div className="h-12 w-16 rounded bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-medium">Visa se terminant par 4242</p>
                <p className="text-sm text-muted-foreground">Expire 12/2025</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Par défaut</Badge>
              <Button variant="ghost" size="sm">Modifier</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SaasBilling;
