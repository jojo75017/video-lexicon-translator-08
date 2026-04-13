import React, { useState } from 'react';
import { 
  User, 
  Lock, 
  Bell, 
  Palette, 
  Shield, 
  Key,
  Save,
  Eye,
  EyeOff,
  Trash2,
  AlertTriangle,
  Headphones,
  Cpu,
  CheckCircle2,
  Info,
  ExternalLink,
  Globe,
  Mic,
} from 'lucide-react';
import { OpenAIConfigPanel } from '@/components/shared/OpenAIConfigPanel';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export const SaasSettings: React.FC = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-none lg:flex">
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Lock className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Appearance</span>
          </TabsTrigger>
          <TabsTrigger value="api" className="gap-2">
            <Key className="h-4 w-4" />
            <span className="hidden sm:inline">API Keys</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal details and profile picture</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="text-2xl bg-primary text-primary-foreground">JD</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Change Avatar</Button>
                    <Button variant="ghost" size="sm" className="text-red-500">Remove</Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    JPG, GIF or PNG. Max size of 2MB.
                  </p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue="Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="john@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <textarea
                  id="bio"
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Tell us about yourself..."
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your password to keep your account secure</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Input 
                    id="currentPassword" 
                    type={showCurrentPassword ? "text" : "password"} 
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input 
                    id="newPassword" 
                    type={showNewPassword ? "text" : "password"} 
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Update Password</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>Add an extra layer of security to your account</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <Shield className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="font-medium">Authenticator App</p>
                    <p className="text-sm text-muted-foreground">Use an app like Google Authenticator</p>
                  </div>
                </div>
                <Badge className="bg-green-500/10 text-green-500">Enabled</Badge>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline">Configure 2FA</Button>
            </CardFooter>
          </Card>

          <Card className="border-red-500/20">
            <CardHeader>
              <CardTitle className="text-red-500">Danger Zone</CardTitle>
              <CardDescription>Irreversible and destructive actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 border border-red-500/20 rounded-lg bg-red-500/5">
                <div>
                  <p className="font-medium">Delete Account</p>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all associated data
                  </p>
                </div>
                <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Account
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                        Delete Account
                      </DialogTitle>
                      <DialogDescription>
                        This action cannot be undone. This will permanently delete your account
                        and remove all associated data from our servers.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <p className="text-sm">Type <strong>DELETE</strong> to confirm:</p>
                      <Input placeholder="Type DELETE to confirm" />
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button variant="destructive">
                        Delete Account
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>Choose what emails you want to receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { id: 'marketing', label: 'Marketing emails', description: 'Receive emails about new features and promotions' },
                { id: 'security', label: 'Security alerts', description: 'Get notified about account security events' },
                { id: 'updates', label: 'Product updates', description: 'News about product updates and changes' },
                { id: 'weekly', label: 'Weekly digest', description: 'Weekly summary of your account activity' },
              ].map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <Label htmlFor={item.id}>{item.label}</Label>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <Checkbox id={item.id} defaultChecked={item.id !== 'marketing'} />
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button>Save Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Theme Preferences</CardTitle>
              <CardDescription>Customize the look and feel of the application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Theme Mode</Label>
                <div className="grid grid-cols-3 gap-4">
                  {['light', 'dark', 'system'].map((theme) => (
                    <button
                      key={theme}
                      className={`p-4 border rounded-lg text-center capitalize hover:border-primary transition-colors ${
                        theme === 'dark' ? 'border-primary bg-primary/5' : ''
                      }`}
                    >
                      <div className={`w-full h-20 rounded mb-2 ${
                        theme === 'light' ? 'bg-white border' :
                        theme === 'dark' ? 'bg-gray-900' :
                        'bg-gradient-to-br from-white to-gray-900'
                      }`} />
                      {theme}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select defaultValue="utc">
                  <SelectTrigger>
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utc">UTC (Coordinated Universal Time)</SelectItem>
                    <SelectItem value="est">EST (Eastern Standard Time)</SelectItem>
                    <SelectItem value="pst">PST (Pacific Standard Time)</SelectItem>
                    <SelectItem value="cet">CET (Central European Time)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* API Keys Tab */}
        <TabsContent value="api" className="space-y-6">
          {/* Résumé des clés nécessaires */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Key className="h-5 w-5 text-primary" />
                🔑 Vos Clés API — Ce qu'il faut savoir
              </CardTitle>
              <CardDescription className="text-base">
                EbookStudio Pro fonctionne avec vos propres clés API. Vous ne payez que ce que vous utilisez, sans intermédiaire.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Gemini Card */}
                <div className="p-4 rounded-xl border-2 border-blue-500/30 bg-blue-500/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                        <Cpu className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-sm">Gemini 3 Flash</p>
                        <p className="text-xs text-muted-foreground">Moteur IA principal</p>
                      </div>
                    </div>
                    <Badge className="bg-green-500/20 text-green-600 border-green-500/30">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      OBLIGATOIRE
                    </Badge>
                  </div>
                  <div className="text-sm space-y-1 text-muted-foreground">
                    <p>✅ Clé <strong className="text-foreground">100% gratuite</strong> à obtenir</p>
                    <p>✅ ~0,20 à 0,30€ par ebook complet</p>
                    <p>✅ Utilisée par les 21 fonctions IA : rédaction, réécriture, analyse marché, SEO, couvertures…</p>
                  </div>
                </div>

                {/* Azure Card */}
                <div className="p-4 rounded-xl border border-border bg-card space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                        <Headphones className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-sm">Azure Speech</p>
                        <p className="text-xs text-muted-foreground">Voix neuronales audiobooks</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-muted-foreground">
                      <Info className="w-3 h-3 mr-1" />
                      OPTIONNELLE
                    </Badge>
                  </div>
                  <div className="text-sm space-y-1 text-muted-foreground">
                    <p>🎙️ Uniquement pour créer des <strong className="text-foreground">livres audio</strong></p>
                    <p>💰 ~0,01€ par minute d'audio généré</p>
                    <p>🗣️ 7 voix françaises : Denise, Henri, Celeste, Brigitte, Alain, Jérôme, Eloise</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">En résumé :</strong> Pour écrire et publier des ebooks, vous n'avez besoin que de la clé Gemini (gratuite). 
                  La clé Azure n'est nécessaire que si vous souhaitez transformer vos livres en audiobooks.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* ═══ GUIDE 1 : GEMINI ═══ */}
          <Card className="border-blue-500/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-blue-500" />
                  Guide : Obtenir votre clé Gemini 3 Flash (gratuite)
                </CardTitle>
                <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/30">Obligatoire</Badge>
              </div>
              <CardDescription>
                3 étapes simples — moins de 2 minutes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { step: "1", title: "Créez un compte Google AI Studio", desc: "Rendez-vous sur aistudio.google.com et connectez-vous avec votre compte Google (celui de Gmail suffit)", icon: "🌐", color: "from-blue-500 to-cyan-500" },
                  { step: "2", title: "Générez votre clé API", desc: "Cliquez sur 'Get API Key' en haut à gauche → 'Create API Key' → Copiez la clé qui commence par 'AIza...'", icon: "🔑", color: "from-indigo-500 to-blue-500" },
                  { step: "3", title: "Collez dans EbookStudio", desc: "Collez votre clé dans le champ ci-dessous et cliquez Valider. Le badge passe au vert = vous êtes prêt !", icon: "✅", color: "from-green-500 to-emerald-500" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 bg-card border border-border rounded-xl hover:border-blue-500/30 transition-colors">
                    <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                      {item.step}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{item.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="gap-2 border-blue-500/30 text-blue-600 hover:bg-blue-500/10">
                  <ExternalLink className="h-4 w-4" />
                  Ouvrir Google AI Studio →
                </Button>
              </a>
            </CardContent>
          </Card>

          {/* Champ Gemini */}
          <OpenAIConfigPanel 
            title="🔑 Clé API Gemini 3 Flash"
            description="Entrez votre clé API Gemini pour utiliser toutes les fonctionnalités IA (rédaction, analyse, réécriture, couvertures…)"
            showModelSelection={true}
          />

          {/* ═══ GUIDE 2 : AZURE SPEECH ═══ */}
          <Card className="border-emerald-500/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Mic className="h-5 w-5 text-emerald-500" />
                  Guide : Obtenir votre clé Azure Speech (optionnelle)
                </CardTitle>
                <Badge variant="outline" className="text-muted-foreground">Audiobooks uniquement</Badge>
              </div>
              <CardDescription>
                Nécessaire uniquement si vous souhaitez transformer vos ebooks en livres audio avec des voix françaises naturelles.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { step: "1", title: "Créez un compte Azure", desc: "Rendez-vous sur portal.azure.com et créez un compte gratuit (Microsoft offre 200$ de crédits le premier mois)", icon: "☁️", color: "from-emerald-500 to-teal-500" },
                  { step: "2", title: "Créez une ressource Speech", desc: "Cherchez 'Speech' dans la barre de recherche → Créer → Choisissez la région 'France Central' → Tarif gratuit (F0) ou Standard", icon: "🎙️", color: "from-teal-500 to-cyan-500" },
                  { step: "3", title: "Copiez la clé et la région", desc: "Dans votre ressource Speech → 'Keys and Endpoint' → Copiez Key 1 et la région (ex: francecentral). Collez ci-dessous.", icon: "📋", color: "from-cyan-500 to-blue-500" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 bg-card border border-border rounded-xl hover:border-primary/20 transition-colors">
                    <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                      {item.step}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{item.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">💡 Bon à savoir :</strong> Azure offre un tier gratuit (F0) avec 500 000 caractères/mois — 
                  soit environ <strong className="text-foreground">5 audiobooks complets gratuits par mois</strong>. 
                  Au-delà, le tarif Standard coûte ~0,01€ par minute d'audio.
                </p>
              </div>

              <div className="flex gap-2">
                <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesSpeechServices" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="gap-2 border-primary/20 text-emerald-600 hover:bg-emerald-500/10">
                    <ExternalLink className="h-4 w-4" />
                    Créer une ressource Azure Speech →
                  </Button>
                </a>
              </div>

              {/* Azure Key Input */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <Label htmlFor="azureKey" className="flex items-center gap-2">
                    <Key className="h-3.5 w-3.5 text-emerald-500" />
                    Clé Azure Speech
                  </Label>
                  <Input 
                    id="azureKey" 
                    type="password" 
                    placeholder="Collez votre clé Azure Speech ici..."
                    defaultValue={localStorage.getItem('azure_speech_key') || ''}
                    onChange={(e) => localStorage.setItem('azure_speech_key', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="azureRegion" className="flex items-center gap-2">
                    <Globe className="h-3.5 w-3.5 text-emerald-500" />
                    Région Azure
                  </Label>
                  <Input 
                    id="azureRegion" 
                    placeholder="ex: francecentral"
                    defaultValue={localStorage.getItem('azure_speech_region') || 'francecentral'}
                    onChange={(e) => localStorage.setItem('azure_speech_region', e.target.value)}
                  />
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="gap-2"
                onClick={() => {
                  const key = (document.getElementById('azureKey') as HTMLInputElement)?.value;
                  const region = (document.getElementById('azureRegion') as HTMLInputElement)?.value;
                  if (key) {
                    localStorage.setItem('azure_speech_key', key);
                    localStorage.setItem('azure_speech_region', region || 'francecentral');
                    alert('✅ Clé Azure Speech enregistrée avec succès !');
                  } else {
                    alert('⚠️ Veuillez entrer votre clé Azure Speech.');
                  }
                }}
              >
                <Save className="h-4 w-4" />
                Enregistrer la clé Azure
              </Button>
            </CardContent>
          </Card>

          {/* Voix disponibles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Headphones className="h-5 w-5 text-primary" />
                🗣️ Voix Azure disponibles par thématique
              </CardTitle>
              <CardDescription>
                EbookStudio sélectionne automatiquement la meilleure voix selon votre genre littéraire, mais vous pouvez aussi la choisir manuellement.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {[
                  { voice: "Eloise", genre: "Enfants 3-6 ans", emoji: "🧸" },
                  { voice: "Brigitte", genre: "Enfants 6-12 ans", emoji: "📚" },
                  { voice: "Henri", genre: "Thriller / Policier", emoji: "🔍" },
                  { voice: "Denise", genre: "Romance", emoji: "💕" },
                  { voice: "Alain", genre: "Spiritualité", emoji: "🧘" },
                  { voice: "Jérôme", genre: "Marketing / Business", emoji: "💼" },
                  { voice: "Celeste", genre: "Histoire", emoji: "🏛️" },
                ].map((v, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                    <span className="text-xl">{v.emoji}</span>
                    <div>
                      <p className="font-semibold text-sm">{v.voice}</p>
                      <p className="text-xs text-muted-foreground">{v.genre}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SaasSettings;
