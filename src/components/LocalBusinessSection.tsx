
import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Building2, MapPin, Phone } from 'lucide-react';
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const countries = [
  { value: "france", label: "France" },
  { value: "belgique", label: "Belgique" },
  { value: "suisse", label: "Suisse" },
  { value: "luxembourg", label: "Luxembourg" },
  { value: "allemagne", label: "Allemagne" },
  { value: "espagne", label: "Espagne" },
  { value: "italie", label: "Italie" },
];

const LocalBusinessSection = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Vérification des répertoires locaux en cours...");
  };

  return (
    <Card className="mb-8 bg-gradient-to-br from-blue-50 to-indigo-50">
      <CardHeader className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-900">
          Développez votre entreprise locale
        </h2>
        <p className="text-gray-600 text-lg">
          Fiches, données et avis assistés par IA, le tout sur une seule et même plateforme.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="country">Pays</Label>
              <Select>
                <SelectTrigger id="country" className="bg-white/80">
                  <SelectValue placeholder="Sélectionnez un pays" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.value} value={country.value}>
                      {country.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="business-name">Nom de l'entreprise</Label>
              <div className="relative">
                <Input 
                  id="business-name"
                  placeholder="Votre entreprise"
                  className="bg-white/80 pl-10"
                />
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="street">Rue</Label>
              <div className="relative">
                <Input 
                  id="street"
                  placeholder="par ex. 47 rue de la Paix"
                  className="bg-white/80 pl-10"
                />
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="postal-code">Code postal</Label>
              <Input 
                id="postal-code"
                placeholder="75000"
                className="bg-white/80"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="phone">Numéro de téléphone</Label>
              <div className="relative">
                <Input 
                  id="phone"
                  placeholder="+33 1 23 45 67 89"
                  className="bg-white/80 pl-10"
                />
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              </div>
            </div>
          </div>
          <div className="text-center pt-4">
            <Button 
              type="submit"
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Vérifiez vos répertoires locaux gratuitement
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default LocalBusinessSection;

