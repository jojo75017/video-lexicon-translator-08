
import React, { useState, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Signature, Download } from "lucide-react";
import { toast } from "sonner";
import html2canvas from 'html2canvas';
import SignatureForm from './SignatureForm';
import SignaturePreview from './SignaturePreview';
import StyleSelector from './StyleSelector';
import type { StyleTemplate } from './StyleSelector';

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
  const [titleEmoji, setTitleEmoji] = useState('💼');
  const [emailEmoji, setEmailEmoji] = useState('📧');
  const [phoneEmoji, setPhoneEmoji] = useState('📱');
  const [websiteEmoji, setWebsiteEmoji] = useState('🌐');
  
  // Nouvelles options de style
  const [textColor, setTextColor] = useState('#1e293b');
  const [iconColor, setIconColor] = useState('#2563eb');
  const [separatorColor, setSeparatorColor] = useState('#e2e8f0');

  const signatureRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTemplateSelect = (template: StyleTemplate) => {
    setTextColor(template.textColor);
    setIconColor(template.iconColor);
    setSeparatorColor(template.separatorColor);
    setUseStyleFont(template.font === 'font-playfair');
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

  const emojiOptions = {
    title: ['💼', '👔', '🎯', '⭐️', '📊', '🎩', '🚀'],
    email: ['📧', '✉️', '📨', '📬', '📫', '📪'],
    phone: ['📱', '☎️', '📞', '📲', '💻', '🤙'],
    website: ['🌐', '💻', '🔗', '🎯', '🌍', '💡']
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-2xl font-bold text-primary">
          <Signature className="h-6 w-6" />
          <h2>Générateur de Signature Email</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <SignatureForm
              formData={formData}
              handleInputChange={handleInputChange}
              nameIcon={nameIcon}
              setNameIcon={setNameIcon}
              companyIcon={companyIcon}
              setCompanyIcon={setCompanyIcon}
              titleEmoji={titleEmoji}
              setTitleEmoji={setTitleEmoji}
              emailEmoji={emailEmoji}
              setEmailEmoji={setEmailEmoji}
              phoneEmoji={phoneEmoji}
              setPhoneEmoji={setPhoneEmoji}
              websiteEmoji={websiteEmoji}
              setWebsiteEmoji={setWebsiteEmoji}
              isItalic={isItalic}
              setIsItalic={setIsItalic}
              useStyleFont={useStyleFont}
              setUseStyleFont={setUseStyleFont}
              emojiOptions={emojiOptions}
            />

            <StyleSelector
              textColor={textColor}
              setTextColor={setTextColor}
              iconColor={iconColor}
              setIconColor={setIconColor}
              separatorColor={separatorColor}
              setSeparatorColor={setSeparatorColor}
              onSelectTemplate={handleTemplateSelect}
            />
          </div>

          <div className="space-y-4">
            <Label>Aperçu de la signature</Label>
            <div 
              ref={signatureRef}
              className="p-6 bg-white rounded-lg border"
            >
              <SignaturePreview 
                formData={formData}
                style={getSignatureStyle()}
                nameIcon={nameIcon}
                companyIcon={companyIcon}
                titleEmoji={titleEmoji}
                emailEmoji={emailEmoji}
                phoneEmoji={phoneEmoji}
                websiteEmoji={websiteEmoji}
                textColor={textColor}
                iconColor={iconColor}
                separatorColor={separatorColor}
              />
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
