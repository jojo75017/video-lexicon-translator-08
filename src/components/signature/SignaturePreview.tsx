
import React from 'react';
import { User, UserRound, Building } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface SignatureData {
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
  website: string;
}

interface SignaturePreviewProps {
  formData: SignatureData;
  style: string;
  nameIcon: string;
  companyIcon: string;
  titleEmoji: string;
  emailEmoji: string;
  phoneEmoji: string;
  websiteEmoji: string;
}

const SignaturePreview = ({ 
  formData,
  style,
  nameIcon,
  companyIcon,
  titleEmoji,
  emailEmoji,
  phoneEmoji,
  websiteEmoji
}: SignaturePreviewProps) => {
  const renderNamePrefix = () => {
    switch (nameIcon) {
      case 'user':
        return <User className="h-5 w-5 inline mr-2 text-primary" />;
      case 'userRound':
        return <UserRound className="h-5 w-5 inline mr-2 text-primary" />;
      case 'emoji':
        return <span className="mr-2">👤</span>;
      default:
        return null;
    }
  };

  const renderCompanyPrefix = () => {
    switch (companyIcon) {
      case 'building':
        return <Building className="h-5 w-5 inline mr-2 text-primary" />;
      case 'emoji':
        return <span className="mr-2">🏢</span>;
      default:
        return null;
    }
  };

  return (
    <div className={`space-y-2 ${style}`}>
      <p className="text-xl font-bold text-gray-800 flex items-center">
        {renderNamePrefix()}
        {formData.name || "Votre Nom"}
      </p>
      <p className="text-gray-600">
        {titleEmoji} {formData.title || "Votre Titre"}
      </p>
      <p className="font-semibold text-gray-700 flex items-center">
        {renderCompanyPrefix()}
        {formData.company || "Votre Entreprise"}
      </p>
      <Separator className="my-2" />
      <div className="space-y-1 text-sm text-gray-600">
        {formData.email && <p>{emailEmoji} {formData.email}</p>}
        {formData.phone && <p>{phoneEmoji} {formData.phone}</p>}
        {formData.website && <p>{websiteEmoji} {formData.website}</p>}
      </div>
    </div>
  );
};

export default SignaturePreview;
