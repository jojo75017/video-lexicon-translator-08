
import React, { useState, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Download, Signature, Building, User, UserRound } from "lucide-react";
import { toast } from "sonner";
import html2canvas from 'html2canvas';

const SignatureGenerator = () => {
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    company: '',
    email: '',
    phone: '',
    website: ''
  });
  
  const [isItalic, setIsItalic] = useState(false);
  const [useStyleFont, setUseStyleFont] = useState(false);
  const [nameIcon, setNameIcon] = useState<'none' | 'user' | 'userRound' | 'emoji'>('none');
  const [companyIcon, setCompanyIcon] = useState<'none' | 'building' | 'emoji'>('none');

  const signatureRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const downloadSignature = async () => {
    if (!signatureRef.current) {
      toast.error("Erreur: Impossible de générer la signature");
      return;
    }

    toast.loading("Génération de la signature...");

    try {
      const canvas = await html2canvas(signatureRef.current, {
        backgroundColor: '#ffffff',
        scale: 2
      });

      const link = document.createElement('a');
      link.download = 'signature-email.png';
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();

      toast.dismiss();
      toast.success("Signature téléchargée avec succès!");
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error);
      toast.error("Erreur lors de la génération de la signature");
    }
  };

  const getSignatureStyle = () => {
    let style = '';
    if (useStyleFont) style += 'font-playfair ';
    if (isItalic) style += 'italic ';
    return style;
  };

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
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-2xl font-bold text-primary">
          <Signature className="h-6 w-6" />
          <h2>Générateur de Signature Email</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nom complet</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Jean Dupont"
              />
              <div className="mt-2 flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="nameIcon"
                    checked={nameIcon === 'none'}
                    onChange={() => setNameIcon('none')}
                  />
                  <span>Aucun</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="nameIcon"
                    checked={nameIcon === 'user'}
                    onChange={() => setNameIcon('user')}
                  />
                  <User className="h-4 w-4" />
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="nameIcon"
                    checked={nameIcon === 'userRound'}
                    onChange={() => setNameIcon('userRound')}
                  />
                  <UserRound className="h-4 w-4" />
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="nameIcon"
                    checked={nameIcon === 'emoji'}
                    onChange={() => setNameIcon('emoji')}
                  />
                  <span>👤</span>
                </label>
              </div>
            </div>

            <div>
              <Label htmlFor="title">Titre / Poste</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Directeur Marketing"
              />
            </div>

            <div>
              <Label htmlFor="company">Entreprise</Label>
              <Input
                id="company"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                placeholder="Ma Société"
              />
              <div className="mt-2 flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="companyIcon"
                    checked={companyIcon === 'none'}
                    onChange={() => setCompanyIcon('none')}
                  />
                  <span>Aucun</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="companyIcon"
                    checked={companyIcon === 'building'}
                    onChange={() => setCompanyIcon('building')}
                  />
                  <Building className="h-4 w-4" />
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="companyIcon"
                    checked={companyIcon === 'emoji'}
                    onChange={() => setCompanyIcon('emoji')}
                  />
                  <span>🏢</span>
                </label>
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="jean.dupont@entreprise.com"
              />
            </div>

            <div>
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+33 6 12 34 56 78"
              />
            </div>

            <div>
              <Label htmlFor="website">Site web</Label>
              <Input
                id="website"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                placeholder="www.monentreprise.com"
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isItalic}
                  onChange={(e) => setIsItalic(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <span>Italique</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useStyleFont}
                  onChange={(e) => setUseStyleFont(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <span>Police stylée</span>
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <Label>Aperçu de la signature</Label>
            <div 
              ref={signatureRef}
              className="p-6 bg-white rounded-lg border"
            >
              <div className={`space-y-2 ${getSignatureStyle()}`}>
                <p className="text-xl font-bold text-gray-800 flex items-center">
                  {renderNamePrefix()}
                  {formData.name || "Votre Nom"}
                </p>
                <p className="text-gray-600">{formData.title || "Votre Titre"}</p>
                <p className="font-semibold text-gray-700 flex items-center">
                  {renderCompanyPrefix()}
                  {formData.company || "Votre Entreprise"}
                </p>
                <Separator className="my-2" />
                <div className="space-y-1 text-sm text-gray-600">
                  {formData.email && <p>📧 {formData.email}</p>}
                  {formData.phone && <p>📱 {formData.phone}</p>}
                  {formData.website && <p>🌐 {formData.website}</p>}
                </div>
              </div>
            </div>

            <Button
              className="w-full gap-2"
              onClick={downloadSignature}
            >
              <Download className="h-4 w-4" />
              Télécharger la signature
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SignatureGenerator;
