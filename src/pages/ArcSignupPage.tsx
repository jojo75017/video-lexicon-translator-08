import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { BookOpen, Star, Gift, CheckCircle2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";

const ArcSignupPage = () => {
  const [searchParams] = useSearchParams();
  const authorName = searchParams.get("author") || "L'auteur";
  const bookTitle = searchParams.get("book") || "Mon prochain livre";
  const genre = searchParams.get("genre") || "Fiction";

  const [formData, setFormData] = useState({
    firstName: "",
    email: "",
    readingFormat: "",
    reviewPlatform: "",
    favoriteGenres: "",
    whyInterested: "",
    acceptTerms: false
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName.trim() || !formData.email.trim()) {
      toast.error("Veuillez remplir les champs obligatoires");
      return;
    }

    if (!formData.acceptTerms) {
      toast.error("Veuillez accepter les conditions");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate submission - in production, this would save to database
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitted(true);
    toast.success("Inscription réussie ! Vous recevrez bientôt votre copie.");
    setIsSubmitting(false);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex items-center justify-center p-4">
        <Card className="max-w-lg w-full text-center border-2 border-amber-200 shadow-xl">
          <CardContent className="pt-12 pb-8 space-y-6">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mx-auto flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Merci {formData.firstName} ! 🎉</h2>
            <p className="text-gray-600">
              Votre inscription à l'équipe ARC de <span className="font-semibold">{authorName}</span> est confirmée.
            </p>
            <div className="bg-amber-50 rounded-lg p-4 text-left space-y-2">
              <p className="text-sm text-amber-800">
                <strong>Prochaines étapes :</strong>
              </p>
              <ul className="text-sm text-amber-700 space-y-1">
                <li>📧 Vous recevrez un email avec votre copie ARC</li>
                <li>📖 Lisez le livre à votre rythme</li>
                <li>⭐ Laissez un avis honnête le jour du lancement</li>
              </ul>
            </div>
            <p className="text-xs text-gray-500">
              Vérifiez votre dossier spam si vous ne recevez rien sous 24h.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-500 text-white py-12 px-4">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <div className="flex justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-6 w-6 fill-yellow-300 text-yellow-300" />
            ))}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">
            Rejoignez l'équipe de lecteurs ARC
          </h1>
          <p className="text-amber-100 text-lg">
            Recevez <span className="font-semibold text-white">"{bookTitle}"</span> en avant-première !
          </p>
          <p className="text-amber-200">
            Par {authorName} • {genre}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 grid md:grid-cols-5 gap-8">
        {/* Benefits */}
        <div className="md:col-span-2 space-y-6">
          <Card className="border-amber-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-700">
                <Gift className="h-5 w-5" />
                Avantages exclusifs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <BookOpen className="h-4 w-4 text-amber-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">Livre gratuit</p>
                  <p className="text-sm text-gray-600">Recevez le livre complet avant tout le monde</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-4 w-4 text-amber-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">Accès prioritaire</p>
                  <p className="text-sm text-gray-600">Découvrez mes futures œuvres en premier</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Star className="h-4 w-4 text-amber-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">Votre avis compte</p>
                  <p className="text-sm text-gray-600">Influencez le succès du livre</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="pt-6">
              <p className="text-sm text-orange-800">
                <strong>Qu'est-ce qu'un lecteur ARC ?</strong><br />
                Un lecteur ARC (Advance Review Copy) reçoit le livre gratuitement en échange d'un avis honnête publié le jour du lancement sur Amazon ou d'autres plateformes.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Form */}
        <Card className="md:col-span-3 border-2 border-amber-200 shadow-lg">
          <CardHeader>
            <CardTitle>📚 Inscription gratuite</CardTitle>
            <CardDescription>
              Remplissez ce formulaire pour rejoindre l'équipe ARC
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="Votre prénom"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="votre@email.com"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Format préféré</Label>
                  <Select
                    value={formData.readingFormat}
                    onValueChange={(value) => setFormData({ ...formData, readingFormat: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kindle">Kindle (MOBI)</SelectItem>
                      <SelectItem value="epub">EPUB</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="any">Peu importe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Où posterez-vous l'avis ?</Label>
                  <Select
                    value={formData.reviewPlatform}
                    onValueChange={(value) => setFormData({ ...formData, reviewPlatform: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="amazon">Amazon</SelectItem>
                      <SelectItem value="babelio">Babelio</SelectItem>
                      <SelectItem value="goodreads">Goodreads</SelectItem>
                      <SelectItem value="booknode">Booknode</SelectItem>
                      <SelectItem value="multiple">Plusieurs plateformes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="genres">Genres préférés</Label>
                <Input
                  id="genres"
                  value={formData.favoriteGenres}
                  onChange={(e) => setFormData({ ...formData, favoriteGenres: e.target.value })}
                  placeholder="Romance, Thriller, Fantasy..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="why">Pourquoi souhaitez-vous rejoindre ? (optionnel)</Label>
                <Textarea
                  id="why"
                  value={formData.whyInterested}
                  onChange={(e) => setFormData({ ...formData, whyInterested: e.target.value })}
                  placeholder="Ce qui vous attire dans ce livre..."
                  rows={3}
                />
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.acceptTerms}
                  onCheckedChange={(checked) => 
                    setFormData({ ...formData, acceptTerms: checked as boolean })
                  }
                />
                <label htmlFor="terms" className="text-sm text-gray-600 leading-tight">
                  J'accepte de laisser un avis honnête sur la plateforme de mon choix dans les 7 jours suivant le lancement officiel du livre.
                </label>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-6"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Inscription en cours..." : "🎁 Recevoir ma copie gratuite"}
              </Button>

              <p className="text-xs text-center text-gray-500">
                Vos données sont protégées et ne seront jamais partagées.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ArcSignupPage;
