import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Mail, User, Copy, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { createSafeHtml } from '@/utils/security/htmlSanitizer';

const SignaturePage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    company: '',
    email: '',
    phone: '',
    website: '',
    address: '',
    linkedin: '',
    twitter: ''
  });
  const [generatedSignature, setGeneratedSignature] = useState('');
  const [signatureType, setSignatureType] = useState('professional');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateSignature = () => {
    if (!formData.name || !formData.email) {
      toast.error('Nom et email sont obligatoires');
      return;
    }

    let signature = '';

    if (signatureType === 'professional') {
      signature = `
<div style="font-family: Arial, sans-serif; font-size: 14px; color: #333;">
  <table cellpadding="0" cellspacing="0" style="margin: 0; padding: 0;">
    <tr>
      <td style="vertical-align: top; padding-right: 20px;">
        <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; font-weight: bold;">
          ${formData.name.charAt(0).toUpperCase()}
        </div>
      </td>
      <td style="vertical-align: top;">
        <h3 style="margin: 0; color: #2c3e50; font-size: 18px;">${formData.name}</h3>
        ${formData.title ? `<p style="margin: 5px 0; color: #7f8c8d; font-style: italic;">${formData.title}</p>` : ''}
        ${formData.company ? `<p style="margin: 5px 0; color: #34495e; font-weight: bold;">${formData.company}</p>` : ''}
        <div style="margin-top: 10px;">
          <p style="margin: 2px 0;"><strong>📧</strong> <a href="mailto:${formData.email}" style="color: #3498db; text-decoration: none;">${formData.email}</a></p>
          ${formData.phone ? `<p style="margin: 2px 0;"><strong>📞</strong> ${formData.phone}</p>` : ''}
          ${formData.website ? `<p style="margin: 2px 0;"><strong>🌐</strong> <a href="${formData.website}" style="color: #3498db; text-decoration: none;">${formData.website}</a></p>` : ''}
          ${formData.address ? `<p style="margin: 2px 0;"><strong>📍</strong> ${formData.address}</p>` : ''}
        </div>
        ${(formData.linkedin || formData.twitter) ? `
        <div style="margin-top: 15px;">
          ${formData.linkedin ? `<a href="${formData.linkedin}" style="margin-right: 10px; text-decoration: none;"><img src="https://img.shields.io/badge/LinkedIn-0077B5?style=flat&logo=linkedin&logoColor=white" alt="LinkedIn"></a>` : ''}
          ${formData.twitter ? `<a href="${formData.twitter}" style="text-decoration: none;"><img src="https://img.shields.io/badge/Twitter-1DA1F2?style=flat&logo=twitter&logoColor=white" alt="Twitter"></a>` : ''}
        </div>
        ` : ''}
      </td>
    </tr>
  </table>
</div>`;
    } else if (signatureType === 'minimal') {
      signature = `
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 13px; color: #555; line-height: 1.4;">
  <p style="margin: 0; font-weight: bold; color: #2c3e50;">${formData.name}</p>
  ${formData.title ? `<p style="margin: 2px 0; color: #7f8c8d;">${formData.title}</p>` : ''}
  ${formData.company ? `<p style="margin: 2px 0; color: #34495e;">${formData.company}</p>` : ''}
  <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #e0e0e0;">
    <a href="mailto:${formData.email}" style="color: #3498db; text-decoration: none;">${formData.email}</a>
    ${formData.phone ? ` • ${formData.phone}` : ''}
    ${formData.website ? ` • <a href="${formData.website}" style="color: #3498db; text-decoration: none;">${formData.website.replace(/^https?:\/\//, '')}</a>` : ''}
  </div>
</div>`;
    } else if (signatureType === 'creative') {
      signature = `
<div style="font-family: 'Arial', sans-serif; max-width: 400px;">
  <div style="background: linear-gradient(90deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px 10px 0 0; color: white;">
    <h2 style="margin: 0; font-size: 20px;">${formData.name}</h2>
    ${formData.title ? `<p style="margin: 5px 0 0 0; opacity: 0.9; font-size: 14px;">${formData.title}</p>` : ''}
  </div>
  <div style="background: #f8f9fa; padding: 15px; border: 1px solid #e9ecef; border-top: none; border-radius: 0 0 10px 10px;">
    ${formData.company ? `<p style="margin: 0 0 10px 0; font-weight: bold; color: #495057;">${formData.company}</p>` : ''}
    <div style="font-size: 13px; color: #6c757d;">
      <div style="margin: 5px 0;">📧 <a href="mailto:${formData.email}" style="color: #007bff; text-decoration: none;">${formData.email}</a></div>
      ${formData.phone ? `<div style="margin: 5px 0;">📱 ${formData.phone}</div>` : ''}
      ${formData.website ? `<div style="margin: 5px 0;">🌐 <a href="${formData.website}" style="color: #007bff; text-decoration: none;">${formData.website}</a></div>` : ''}
      ${formData.address ? `<div style="margin: 5px 0;">📍 ${formData.address}</div>` : ''}
    </div>
    ${(formData.linkedin || formData.twitter) ? `
    <div style="margin-top: 15px; text-align: center;">
      ${formData.linkedin ? `<a href="${formData.linkedin}" style="margin: 0 5px; text-decoration: none; color: #0077b5;">LinkedIn</a>` : ''}
      ${formData.twitter ? `<a href="${formData.twitter}" style="margin: 0 5px; text-decoration: none; color: #1da1f2;">Twitter</a>` : ''}
    </div>
    ` : ''}
  </div>
</div>`;
    }

    setGeneratedSignature(signature);
    toast.success('Signature générée !');
  };

  const copySignature = () => {
    navigator.clipboard.writeText(generatedSignature);
    toast.success('Signature copiée !');
  };

  const downloadSignature = () => {
    const blob = new Blob([generatedSignature], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `signature-${formData.name.replace(/\s+/g, '-')}.html`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Signature téléchargée !');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50/30 to-blue-50/30 p-6">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
            ✍️ Générateur de Signature
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informations personnelles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Nom complet *</label>
                  <Input
                    placeholder="Jean Dupont"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Poste</label>
                  <Input
                    placeholder="Directeur Marketing"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Entreprise</label>
                <Input
                  placeholder="Mon Entreprise SAS"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Email *</label>
                  <Input
                    type="email"
                    placeholder="jean@entreprise.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Téléphone</label>
                  <Input
                    placeholder="+33 1 23 45 67 89"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Site web</label>
                <Input
                  placeholder="https://monentreprise.com"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Adresse</label>
                <Input
                  placeholder="123 Rue de la Paix, 75001 Paris"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">LinkedIn</label>
                  <Input
                    placeholder="https://linkedin.com/in/jean-dupont"
                    value={formData.linkedin}
                    onChange={(e) => handleInputChange('linkedin', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Twitter</label>
                  <Input
                    placeholder="https://twitter.com/jeandupont"
                    value={formData.twitter}
                    onChange={(e) => handleInputChange('twitter', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Style de signature</label>
                <div className="flex gap-2">
                  <Button
                    variant={signatureType === 'professional' ? 'default' : 'outline'}
                    onClick={() => setSignatureType('professional')}
                  >
                    Professionnel
                  </Button>
                  <Button
                    variant={signatureType === 'minimal' ? 'default' : 'outline'}
                    onClick={() => setSignatureType('minimal')}
                  >
                    Minimal
                  </Button>
                  <Button
                    variant={signatureType === 'creative' ? 'default' : 'outline'}
                    onClick={() => setSignatureType('creative')}
                  >
                    Créatif
                  </Button>
                </div>
              </div>

              <Button onClick={generateSignature} className="w-full">
                Générer la signature
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Aperçu de la signature
              </CardTitle>
            </CardHeader>
            <CardContent>
              {generatedSignature ? (
                <div className="space-y-4">
                  <div className="border rounded-lg p-4 bg-white">
                    <div dangerouslySetInnerHTML={createSafeHtml(generatedSignature)} />
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={copySignature} className="flex-1">
                      <Copy className="h-4 w-4 mr-2" />
                      Copier HTML
                    </Button>
                    <Button onClick={downloadSignature} variant="outline" className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger
                    </Button>
                  </div>

                  <div className="text-sm text-gray-600 space-y-2">
                    <p><strong>Instructions d'installation :</strong></p>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Copiez le code HTML de la signature</li>
                      <li>Ouvrez les paramètres de votre client email</li>
                      <li>Trouvez la section "Signature"</li>
                      <li>Collez le code en mode HTML</li>
                      <li>Testez en envoyant un email</li>
                    </ol>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-12">
                  Remplissez les informations à gauche et cliquez sur "Générer la signature" pour voir l'aperçu
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SignaturePage;