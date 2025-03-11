
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
  textColor: string;
  iconColor: string;
  separatorColor: string;
  logo?: string | null;
}

const SignaturePreview = ({ 
  formData,
  style,
  nameIcon,
  companyIcon,
  titleEmoji,
  emailEmoji,
  phoneEmoji,
  websiteEmoji,
  textColor,
  iconColor,
  separatorColor,
  logo
}: SignaturePreviewProps) => {
  const renderNamePrefix = () => {
    switch (nameIcon) {
      case 'user':
        return <User className="h-5 w-5 inline mr-2" style={{ color: iconColor }} />;
      case 'userRound':
        return <UserRound className="h-5 w-5 inline mr-2" style={{ color: iconColor }} />;
      case 'emoji':
        return <span className="mr-2">👤</span>;
      default:
        return null;
    }
  };

  const renderCompanyPrefix = () => {
    switch (companyIcon) {
      case 'building':
        return <Building className="h-5 w-5 inline mr-2" style={{ color: iconColor }} />;
      case 'emoji':
        return <span className="mr-2">🏢</span>;
      default:
        return null;
    }
  };

  const renderWithLinks = (content: string) => {
    return <span dangerouslySetInnerHTML={{ __html: content }} />;
  };

  return (
    <div className="flex gap-4">
      {logo && (
        <div className="flex-shrink-0">
          <img 
            src={logo} 
            alt="Logo entreprise" 
            className="w-16 h-16 object-contain"
          />
        </div>
      )}
      <div className={`space-y-2 ${style}`} style={{ color: textColor }}>
        <p className="text-xl font-bold flex items-center">
          {renderNamePrefix()}
          {renderWithLinks(formData.name || "Votre Nom")}
        </p>
        <p>
          {titleEmoji} {renderWithLinks(formData.title || "Votre Titre")}
        </p>
        <p className="font-semibold flex items-center">
          {renderCompanyPrefix()}
          {renderWithLinks(formData.company || "Votre Entreprise")}
        </p>
        <Separator className="my-2" style={{ backgroundColor: separatorColor }} />
        <div className="space-y-1 text-sm">
          {formData.email && <p>{emailEmoji} {renderWithLinks(formData.email)}</p>}
          {formData.phone && <p>{phoneEmoji} {renderWithLinks(formData.phone)}</p>}
          {formData.website && <p>{websiteEmoji} {renderWithLinks(formData.website)}</p>}
        </div>
      </div>
    </div>
  );
};

export default SignaturePreview;
