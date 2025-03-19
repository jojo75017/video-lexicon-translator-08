
import React, { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Flag from 'react-world-flags';
import { Building2, MapPin, Phone } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { FormValues, formSchema, countries } from '@/types/localBusiness';
import { toast } from "sonner";

interface BusinessFormProps {
  onSubmit: (data: FormValues) => void;
}

export const BusinessForm = ({ onSubmit }: BusinessFormProps) => {
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

  // Debug props
  useEffect(() => {
    console.log("BusinessForm props:", { onSubmit: !!onSubmit });
  }, [onSubmit]);

  const handleFormSubmit = (data: FormValues) => {
    console.log("Business form submitted with data:", data);
    toast.success("Formulaire soumis avec succès");
    
    try {
      onSubmit(data);
    } catch (error) {
      console.error("Error in form submission:", error);
      toast.error("Erreur lors de la soumission du formulaire");
    }
  };

  const handleButtonClick = () => {
    console.log("Business form button clicked manually");
    // This will trigger the form validation and submission
    form.handleSubmit(handleFormSubmit)();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6 max-w-2xl mx-auto">
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
                        <span className="w-4 h-3 inline-flex items-center">
                          <Flag 
                            code={country.code}
                            className="h-full w-auto object-contain"
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
            type="button" // Changed from submit to button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
            onClick={handleButtonClick} // Add explicit click handler
          >
            Vérifiez vos répertoires locaux gratuitement
          </Button>
        </div>
      </form>
    </Form>
  );
};
