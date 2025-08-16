import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Mail, Download, CheckCircle, Star, Gift, Zap, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const PromptsCapturePage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error("Veuillez saisir une adresse email valide");
      return;
    }

    setIsSubmitting(true);
    
    // Simulation d'envoi
    setTimeout(() => {
      setIsSubmitted(true);
      setIsSubmitting(false);
      toast.success("Parfait ! Vérifiez votre boîte email dans quelques minutes.");
    }, 1500);
  };

  const benefits = [
    {
      icon: <Zap className="w-5 h-5 text-yellow-500" />,
      title: "100+ Prompts Professionnels",
      description: "Collection complète de prompts testés et optimisés"
    },
    {
      icon: <Target className="w-5 h-5 text-blue-500" />,
      title: "Résultats Garantis",
      description: "Prompts créés par des experts pour des résultats maximaux"
    },
    {
      icon: <Gift className="w-5 h-5 text-green-500" />,
      title: "Bonus Exclusifs",
      description: "Accès à des prompts premium et des templates avancés"
    }
  ];

  const testimonials = [
    {
      name: "Marie D.",
      role: "Consultante Marketing",
      content: "Ces prompts ont transformé ma productivité ! Je génère maintenant du contenu 10x plus rapidement.",
      rating: 5
    },
    {
      name: "Thomas L.",
      role: "Entrepreneur",
      content: "La qualité des prompts est exceptionnelle. Mes campagnes marketing ont un taux de conversion 3x supérieur.",
      rating: 5
    },
    {
      name: "Sophie R.",
      role: "Rédactrice Web",
      content: "Indispensable pour mon travail quotidien. Je recommande à tous les professionnels du contenu !",
      rating: 5
    }
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl text-center">
          <CardContent className="pt-8 pb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              🎉 Parfait ! C'est dans la boîte !
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Votre pack de prompts professionnels arrive dans votre boîte email sous peu.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-800 font-medium">
                📧 Email envoyé à : <span className="font-mono">{email}</span>
              </p>
              <p className="text-blue-600 text-sm mt-2">
                Pensez à vérifier vos spams si vous ne recevez rien dans les 10 prochaines minutes !
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                onClick={() => navigate('/prompts-generator')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour au générateur
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.open('https://wa.me/your-number', '_blank')}
              >
                💬 Rejoindre notre communauté WhatsApp
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/prompts-generator')}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              🎁 Offre Limitée
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            🚀 Obtenez <span className="text-blue-600">100+ Prompts</span>
            <br />
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Professionnels GRATUITS
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Téléchargez instantanément notre collection exclusive de prompts optimisés pour 
            <strong> booster votre productivité et multiplier vos résultats</strong> avec l'IA.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Badge className="bg-blue-100 text-blue-800 px-4 py-2">
              ✨ 100+ Prompts Prêts à l'emploi
            </Badge>
            <Badge className="bg-green-100 text-green-800 px-4 py-2">
              🎯 Testés & Optimisés
            </Badge>
            <Badge className="bg-purple-100 text-purple-800 px-4 py-2">
              💎 Valeur 197€ - GRATUIT
            </Badge>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {benefits.map((benefit, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-12 h-12 mx-auto mb-4 bg-gray-50 rounded-full flex items-center justify-center">
                  {benefit.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Email Capture Form */}
        <Card className="max-w-2xl mx-auto mb-12 shadow-xl border-2 border-blue-100">
          <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <Mail className="w-6 h-6" />
              Accès Immédiat & Gratuit
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  📧 Votre adresse email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  className="text-lg py-3 border-2 border-gray-300 focus:border-blue-500"
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 text-lg shadow-lg transition-all duration-300 hover:shadow-xl"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Envoi en cours...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    TÉLÉCHARGER MAINTENANT (100% GRATUIT)
                  </div>
                )}
              </Button>
            </form>
            
            <p className="text-xs text-gray-500 text-center mt-4">
              🔒 Vos données sont sécurisées. Pas de spam, désinscription en 1 clic.
            </p>
          </CardContent>
        </Card>

        {/* Testimonials */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            💬 Ce que disent nos utilisateurs
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* What's Included */}
        <Card className="mb-12 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-gray-900">
              🎁 Ce que vous recevez (Valeur 197€)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>25 Prompts Business & Entrepreneuriat</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>25 Prompts Marketing & Copywriting</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>25 Prompts Développement Personnel</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>25 Prompts Voyage & Aventure</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Templates prêts à copier-coller</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Guide d'utilisation avancée</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Final CTA */}
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-6">
            ⏰ <strong>Offre limitée :</strong> Téléchargement gratuit pendant encore quelques jours seulement !
          </p>
          <Button 
            onClick={() => document.getElementById('email')?.focus()}
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold px-8 py-4 text-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Download className="w-6 h-6 mr-2" />
            JE VEUX MES PROMPTS GRATUITS !
          </Button>
        </div>

      </main>
    </div>
  );
};

export default PromptsCapturePage;