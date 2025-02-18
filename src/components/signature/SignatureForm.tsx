
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import IconSelector from './IconSelector';
import EmojiSelector from './EmojiSelector';

interface SignatureFormProps {
  formData: {
    name: string;
    title: string;
    company: string;
    email: string;
    phone: string;
    website: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  nameIcon: string;
  setNameIcon: (value: string) => void;
  companyIcon: string;
  setCompanyIcon: (value: string) => void;
  titleEmoji: string;
  setTitleEmoji: (emoji: string) => void;
  emailEmoji: string;
  setEmailEmoji: (emoji: string) => void;
  phoneEmoji: string;
  setPhoneEmoji: (emoji: string) => void;
  websiteEmoji: string;
  setWebsiteEmoji: (emoji: string) => void;
  isItalic: boolean;
  setIsItalic: (value: boolean) => void;
  useStyleFont: boolean;
  setUseStyleFont: (value: boolean) => void;
  emojiOptions: {
    title: string[];
    email: string[];
    phone: string[];
    website: string[];
  };
}

const SignatureForm = ({
  formData,
  handleInputChange,
  nameIcon,
  setNameIcon,
  companyIcon,
  setCompanyIcon,
  titleEmoji,
  setTitleEmoji,
  emailEmoji,
  setEmailEmoji,
  phoneEmoji,
  setPhoneEmoji,
  websiteEmoji,
  setWebsiteEmoji,
  isItalic,
  setIsItalic,
  useStyleFont,
  setUseStyleFont,
  emojiOptions
}: SignatureFormProps) => {
  return (
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
        <IconSelector
          type="name"
          selected={nameIcon}
          onChange={setNameIcon}
        />
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
        <EmojiSelector
          emojis={emojiOptions.title}
          selectedEmoji={titleEmoji}
          onSelect={setTitleEmoji}
          label="Emoji"
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
        <IconSelector
          type="company"
          selected={companyIcon}
          onChange={setCompanyIcon}
        />
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
        <EmojiSelector
          emojis={emojiOptions.email}
          selectedEmoji={emailEmoji}
          onSelect={setEmailEmoji}
          label="Emoji"
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
        <EmojiSelector
          emojis={emojiOptions.phone}
          selectedEmoji={phoneEmoji}
          onSelect={setPhoneEmoji}
          label="Emoji"
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
        <EmojiSelector
          emojis={emojiOptions.website}
          selectedEmoji={websiteEmoji}
          onSelect={setWebsiteEmoji}
          label="Emoji"
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
  );
};

export default SignatureForm;
