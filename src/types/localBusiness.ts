
import { z } from "zod";

export const countries = [
  { value: "FR", label: "France", code: "FR" },
  { value: "BE", label: "Belgique", code: "BE" },
  { value: "CH", label: "Suisse", code: "CH" },
  { value: "LU", label: "Luxembourg", code: "LU" },
  { value: "DE", label: "Allemagne", code: "DE" },
  { value: "ES", label: "Espagne", code: "ES" },
  { value: "IT", label: "Italie", code: "IT" },
];

export const getPhoneRegexForCountry = (country: string) => {
  switch (country) {
    case 'FR':
      return /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
    case 'BE':
      return /^(?:(?:\+|00)32|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
    case 'CH':
      return /^(?:(?:\+|00)41|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
    case 'LU':
      return /^(?:(?:\+|00)352|0)\s*[1-9](?:[\s.-]*\d{2}){3,4}$/;
    case 'DE':
      return /^(?:(?:\+|00)49|0)\s*[1-9](?:[\s.-]*\d{2}){4,5}$/;
    case 'ES':
      return /^(?:(?:\+|00)34|0)\s*[6-9](?:[\s.-]*\d{2}){4}$/;
    case 'IT':
      return /^(?:(?:\+|00)39|0)\s*[1-9](?:[\s.-]*\d{2}){4,5}$/;
    default:
      return /^(?:\+|00)[1-9]\d{1,14}$/;
  }
};

export const formSchema = z.object({
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
    // Utilisez une closure pour accéder au pays
    return (country: string) => {
      const phoneRegex = getPhoneRegexForCountry(country);
      return phoneRegex.test(val);
    };
  }, {
    message: "Veuillez entrer un numéro de téléphone valide pour ce pays",
  }),
});

export type FormValues = z.infer<typeof formSchema>;

export interface Report {
  directoryScore: number;
  reviewScore: number;
  visibilityScore: number;
  recommendations: string[];
  directories: Array<{
    name: string;
    status: 'present' | 'missing' | 'incorrect';
    url?: string;
  }>;
}
