import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  fr: {
    translation: {
      "seo": {
        "title": "Titre",
        "description": "Description",
        "keywords": "Mots-clés",
        "structure": "Structure",
        "content": "Contenu",
        "wordCount": "Nombre de mots",
        "internalLinks": "Liens internes",
        "externalLinks": "Liens externes",
        "noKeywords": "Aucun mot-clé défini",
        "mainTags": "Balises principales",
        "notDefined": "Non défini",
        "notDefined_female": "Non définie",
        "imageCount": "Nombre d'images"
      }
    }
  },
  en: {
    translation: {
      "seo": {
        "title": "Title",
        "description": "Description",
        "keywords": "Keywords",
        "structure": "Structure",
        "content": "Content",
        "wordCount": "Word count",
        "internalLinks": "Internal links",
        "externalLinks": "External links",
        "noKeywords": "No keywords defined",
        "mainTags": "Main tags",
        "notDefined": "Not defined",
        "notDefined_female": "Not defined",
        "imageCount": "Image count"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "fr",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;