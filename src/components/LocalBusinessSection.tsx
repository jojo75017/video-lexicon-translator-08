
import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Building2, MapPin, Phone, Search, FileText, TrendingUp } from 'lucide-react';
import { toast } from "sonner";
import Flag from 'react-world-flags';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const countries = [
  { value: "FR", label: "France", code: "FR" },
  { value: "BE", label: "Belgique", code: "BE" },
  { value: "CH", label: "Suisse", code: "CH" },
  { value: "LU", label: "Luxembourg", code: "LU" },
  { value: "DE", label: "Allemagne", code: "DE" },
  { value: "ES", label: "Espagne", code: "ES" },
  { value: "IT", label: "Italie", code: "IT" },
];

const formSchema = z.object({
  country: z.string({
    required_error: "Veuillez sélectionner un pays",
  }),
  businessName: z.string().min(2, {
    message: "Le nom de l'entreprise doit contenir au moins 2 caractères",
  }),
  street: z.string().min(5, {
    message: "L'adresse doit contenir au moins 5 caractères",
  }),
  postalCode: z.string().refine((val) => {
    const postalCodeRegex = /^\d{4,5}$/;
    return postalCodeRegex.test(val);
  }, {
    message: "Le code postal doit contenir 4 ou 5 chiffres",
  }),
  phone: z.string().refine((val) => {
    // Accepte les formats: +33 1 23 45 67 89, 01 23 45 67 89, +33123456789
    const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
    return phoneRegex.test(val);
  }, {
    message: "Veuillez entrer un numéro de téléphone français valide",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const LocalBusinessSection = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      country: "",
      businessName: "",
      street: "",
      postalCode: "",
      phone: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      console.log("Form data:", data);
      toast.success("Vérification des répertoires locaux en cours...");
      // Ici, vous pourriez ajouter une requête API réelle
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success("Analyse terminée ! Consultez votre rapport.");
    } catch (error) {
      toast.error("Une erreur est survenue lors de l'analyse.");
    }
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pays</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white/80">
                          <SelectValue placeholder="Sélectionnez un pays" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country.value} value={country.value} className="flex items-center gap-2">
                            <span className="w-6 h-4 overflow-hidden inline-flex items-center">
                              <Flag 
                                code={country.code}
                                className="h-full w-auto object-cover"
                              />
                            </span>
                            {country.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="businessName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom de l'entreprise</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          {...field}
                          placeholder="Votre entreprise"
                          className="bg-white/80 pl-10"
                        />
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="street"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rue</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          {...field}
                          placeholder="par ex. 47 rue de la Paix"
                          className="bg-white/80 pl-10"
                        />
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code postal</FormLabel>
                    <FormControl>
                      <Input 
                        {...field}
                        placeholder="75000"
                        className="bg-white/80"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Numéro de téléphone</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          {...field}
                          placeholder="+33 1 23 45 67 89"
                          className="bg-white/80 pl-10"
                        />
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
        </Form>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          <div className="bg-purple-900 p-6 rounded-xl text-white hover:bg-purple-800 transition-colors duration-200 cursor-pointer hover:shadow-lg">
            <div className="flex flex-col items-start gap-4 h-full">
              <div className="w-16 h-16 bg-purple-800 rounded-full flex items-center justify-center">
                <Search className="h-8 w-8" />
              </div>
              <div>
                <h3 className="font-semibold text-xl mb-2">Saisir le nom de l'entreprise</h3>
                <p className="text-sm opacity-90">
                  Effectuez une analyse de la visibilité de votre entreprise locale en quelques secondes
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-900 p-6 rounded-xl text-white hover:bg-purple-800 transition-colors duration-200 cursor-pointer hover:shadow-lg">
            <div className="flex flex-col items-start gap-4 h-full">
              <div className="w-16 h-16 bg-purple-800 rounded-full flex items-center justify-center">
                <FileText className="h-8 w-8" />
              </div>
              <div>
                <h3 className="font-semibold text-xl mb-2">Obtenir un rapport gratuit</h3>
                <p className="text-sm opacity-90">
                  Découvrez les répertoires dans lesquels votre entreprise doit être inscrite ou corrigée + les notes attribuées dans les avis
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-900 p-6 rounded-xl text-white hover:bg-purple-800 transition-colors duration-200 cursor-pointer hover:shadow-lg">
            <div className="flex flex-col items-start gap-4 h-full">
              <div className="w-16 h-16 bg-purple-800 rounded-full flex items-center justify-center">
                <TrendingUp className="h-8 w-8" />
              </div>
              <div>
                <h3 className="font-semibold text-xl mb-2">Dopez vos classements locaux</h3>
                <p className="text-sm opacity-90">
                  Découvrez les améliorations que vous pouvez apporter pour occuper la première place dans la recherche locale
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocalBusinessSection;
