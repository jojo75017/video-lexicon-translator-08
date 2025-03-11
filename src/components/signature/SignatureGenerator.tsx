import React, { useState, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Signature, Download, Upload, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";
import html2canvas from 'html2canvas';
import SignatureForm from './SignatureForm';
import SignaturePreview from './SignaturePreview';
import StyleSelector from './StyleSelector';
import type { StyleTemplate } from './StyleSelector';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

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
  const [logo, setLogo] = useState<string | null>(null);
  
  const [textColor, setTextColor] = useState('#1e293b');
  const [iconColor, setIconColor] = useState('#2563eb');
  const [separatorColor, setSeparatorColor] = useState('#e2e8f0');
  const [selectedText, setSelectedText] = useState({ start: 0, end: 0, text: "" });
  const [showLinkPopover, setShowLinkPopover] = useState(false);
  const [linkUrl, setLinkUrl] = useState("https://");
  const [activeField, setActiveField] = useState<'name' | 'title' | 'company' | 'email' | 'phone' | 'website'>('name');

  const signatureRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const companyInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const websiteInputRef = useRef<HTMLInputElement>(null);

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

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 500000) { // 500KB max
      toast.error("Le logo est trop volumineux (max: 500KB)");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setLogo(event.target?.result as string);
      toast.success("Logo ajouté avec succès!");
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    setLogo(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast.success("Logo supprimé");
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

  const handleTextSelection = (
    field: 'name' | 'title' | 'company' | 'email' | 'phone' | 'website',
    e: React.MouseEvent<HTMLInputElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const start = target.selectionStart || 0;
    const end = target.selectionEnd || 0;
    
    if (start !== end) {
      const text = target.value.substring(start, end);
      setSelectedText({ start, end, text });
      setActiveField(field);
    }
  };

  const handleApplyLink = () => {
    let inputRef: React.RefObject<HTMLInputElement> | null = null;
    
    switch (activeField) {
      case 'name':
        inputRef = nameInputRef;
        break;
      case 'title':
        inputRef = titleInputRef;
        break;
      case 'company':
        inputRef = companyInputRef;
        break;
      case 'email':
        inputRef = emailInputRef;
        break;
      case 'phone':
        inputRef = phoneInputRef;
        break;
      case 'website':
        inputRef = websiteInputRef;
        break;
    }
    
    if (!inputRef || !inputRef.current) return;
    
    const input = inputRef.current;
    const { start, end, text } = selectedText;
    const fieldName = activeField;
    
    if (start === end) return;
    
    const before = formData[fieldName].substring(0, start);
    const after = formData[fieldName].substring(end);
    
    // Format as HTML instead of plain text
    const linkHtml = `<a href="${linkUrl}" target="_blank">${text}</a>`;
    
    setFormData(prev => ({
      ...prev,
      [fieldName]: before + linkHtml + after
    }));
    
    setShowLinkPopover(false);
    
    toast.success("Lien ajouté avec succès");
    
    // Reset linkUrl for next usage
    setLinkUrl("https://");
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
            <div className="space-y-4">
              <Label>Logo de l'entreprise</Label>
              <div className="flex gap-4 items-center">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                  id="logo-upload"
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="gap-2"
                >
                  <Upload className="h-4 w-4" />
                  {logo ? "Changer le logo" : "Ajouter un logo"}
                </Button>
                {logo && (
                  <Button
                    variant="destructive"
                    onClick={removeLogo}
                  >
                    Supprimer
                  </Button>
                )}
              </div>
              {logo && (
                <div className="mt-2">
                  <img 
                    src={logo} 
                    alt="Logo entreprise" 
                    className="max-h-16 object-contain"
                  />
                </div>
              )}
            </div>

            <div className="space-y-4">
              <Popover open={showLinkPopover} onOpenChange={setShowLinkPopover}>
                <PopoverContent className="w-80" side="right">
                  <div className="space-y-2">
                    <h4 className="font-medium">Ajouter un lien</h4>
                    <p className="text-sm text-gray-500">Texte sélectionné: {selectedText.text}</p>
                    <div className="flex space-x-2">
                      <Input 
                        placeholder="https://exemple.com" 
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                      />
                      <Button size="sm" onClick={handleApplyLink}>Appliquer</Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              <div>
                <Label htmlFor="name">Nom complet</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Jean Dupont"
                    ref={nameInputRef}
                    onMouseUp={(e) => handleTextSelection('name', e)}
                    className="flex-1"
                  />
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        if (nameInputRef.current) {
                          const start = nameInputRef.current.selectionStart || 0;
                          const end = nameInputRef.current.selectionEnd || 0;
                          const text = formData.name.substring(start, end);
                          if (start !== end) {
                            setSelectedText({ start, end, text });
                            setActiveField('name');
                            setShowLinkPopover(true);
                          } else {
                            toast.error("Veuillez sélectionner du texte d'abord");
                          }
                        }
                      }}
                    >
                      <LinkIcon className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                </div>
              </div>

              <div>
                <Label htmlFor="title">Titre / Poste</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Directeur Marketing"
                    ref={titleInputRef}
                    onMouseUp={(e) => handleTextSelection('title', e)}
                    className="flex-1"
                  />
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        if (titleInputRef.current) {
                          const start = titleInputRef.current.selectionStart || 0;
                          const end = titleInputRef.current.selectionEnd || 0;
                          const text = formData.title.substring(start, end);
                          if (start !== end) {
                            setSelectedText({ start, end, text });
                            setActiveField('title');
                            setShowLinkPopover(true);
                          } else {
                            toast.error("Veuillez sélectionner du texte d'abord");
                          }
                        }
                      }}
                    >
                      <LinkIcon className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                </div>
              </div>

              <div>
                <Label htmlFor="company">Entreprise</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="Ma Société"
                    ref={companyInputRef}
                    onMouseUp={(e) => handleTextSelection('company', e)}
                    className="flex-1"
                  />
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        if (companyInputRef.current) {
                          const start = companyInputRef.current.selectionStart || 0;
                          const end = companyInputRef.current.selectionEnd || 0;
                          const text = formData.company.substring(start, end);
                          if (start !== end) {
                            setSelectedText({ start, end, text });
                            setActiveField('company');
                            setShowLinkPopover(true);
                          } else {
                            toast.error("Veuillez sélectionner du texte d'abord");
                          }
                        }
                      }}
                    >
                      <LinkIcon className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="jean.dupont@entreprise.com"
                    ref={emailInputRef}
                    onMouseUp={(e) => handleTextSelection('email', e)}
                    className="flex-1"
                  />
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        if (emailInputRef.current) {
                          const start = emailInputRef.current.selectionStart || 0;
                          const end = emailInputRef.current.selectionEnd || 0;
                          const text = formData.email.substring(start, end);
                          if (start !== end) {
                            setSelectedText({ start, end, text });
                            setActiveField('email');
                            setShowLinkPopover(true);
                          } else {
                            toast.error("Veuillez sélectionner du texte d'abord");
                          }
                        }
                      }}
                    >
                      <LinkIcon className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                </div>
              </div>

              <div>
                <Label htmlFor="phone">Téléphone</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+33 6 12 34 56 78"
                    ref={phoneInputRef}
                    onMouseUp={(e) => handleTextSelection('phone', e)}
                    className="flex-1"
                  />
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        if (phoneInputRef.current) {
                          const start = phoneInputRef.current.selectionStart || 0;
                          const end = phoneInputRef.current.selectionEnd || 0;
                          const text = formData.phone.substring(start, end);
                          if (start !== end) {
                            setSelectedText({ start, end, text });
                            setActiveField('phone');
                            setShowLinkPopover(true);
                          } else {
                            toast.error("Veuillez sélectionner du texte d'abord");
                          }
                        }
                      }}
                    >
                      <LinkIcon className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                </div>
              </div>

              <div>
                <Label htmlFor="website">Site web</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="www.monentreprise.com"
                    ref={websiteInputRef}
                    onMouseUp={(e) => handleTextSelection('website', e)}
                    className="flex-1"
                  />
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        if (websiteInputRef.current) {
                          const start = websiteInputRef.current.selectionStart || 0;
                          const end = websiteInputRef.current.selectionEnd || 0;
                          const text = formData.website.substring(start, end);
                          if (start !== end) {
                            setSelectedText({ start, end, text });
                            setActiveField('website');
                            setShowLinkPopover(true);
                          } else {
                            toast.error("Veuillez sélectionner du texte d'abord");
                          }
                        }
                      }}
                    >
                      <LinkIcon className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                </div>
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
                logo={logo}
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
