
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SeoChecklistItem from './SeoChecklistItem';
import { useTranslation } from 'react-i18next';
import { SeoAnalysis } from '@/types/seo';

interface SeoChecklistProps {
  seoAnalysis: SeoAnalysis;
}

const SeoChecklist: React.FC<SeoChecklistProps> = ({ seoAnalysis }) => {
  const { t } = useTranslation();
  
  const getMetaStatus = () => {
    if (!seoAnalysis.title || seoAnalysis.title.length < 10) {
      return {
        status: 'error' as const,
        advice: t('seo.checklist.titleMissing', 'Ajoutez un titre à votre page qui contient vos mots-clés principaux.')
      };
    } else if (seoAnalysis.title.length > 60) {
      return {
        status: 'warning' as const,
        advice: t('seo.checklist.titleTooLong', 'Votre titre est trop long. Limitez-le à 60 caractères maximum.')
      };
    }
    return {
      status: 'success' as const,
      advice: ''
    };
  };
  
  const getDescriptionStatus = () => {
    if (!seoAnalysis.description || seoAnalysis.description.length < 50) {
      return {
        status: 'error' as const,
        advice: t('seo.checklist.descriptionMissing', 'Ajoutez une meta description qui résume votre page en 150-160 caractères.')
      };
    } else if (seoAnalysis.description.length > 160) {
      return {
        status: 'warning' as const,
        advice: t('seo.checklist.descriptionTooLong', 'Votre meta description est trop longue. Limitez-la à 160 caractères maximum.')
      };
    }
    return {
      status: 'success' as const,
      advice: ''
    };
  };
  
  const getHeadingStatus = () => {
    if (seoAnalysis.h1Count === 0) {
      return {
        status: 'error' as const,
        advice: t('seo.checklist.h1Missing', 'Ajoutez un titre H1 à votre page contenant le mot-clé principal.')
      };
    } else if (seoAnalysis.h1Count > 1) {
      return {
        status: 'warning' as const,
        advice: t('seo.checklist.multipleH1', 'Votre page contient plusieurs H1. Limitez-vous à un seul H1 par page.')
      };
    } else if (seoAnalysis.h2Count === 0) {
      return {
        status: 'warning' as const,
        advice: t('seo.checklist.h2Missing', 'Ajoutez des titres H2 pour structurer votre contenu.')
      };
    }
    return {
      status: 'success' as const,
      advice: ''
    };
  };
  
  const getContentStatus = () => {
    if (!seoAnalysis.wordCount || seoAnalysis.wordCount < 300) {
      return {
        status: 'warning' as const,
        advice: t('seo.checklist.contentTooShort', 'Votre contenu est court. Visez au moins 300-500 mots pour un bon référencement.')
      };
    }
    return {
      status: 'success' as const,
      advice: ''
    };
  };
  
  const getImageStatus = () => {
    if (seoAnalysis.imgWithoutAlt && seoAnalysis.imgWithoutAlt > 0) {
      return {
        status: 'warning' as const,
        advice: t('seo.checklist.missingAltText', "Ajoutez du texte alternatif (alt) à toutes vos images pour l'accessibilité et le SEO.")
      };
    } else if (!seoAnalysis.imgCount || seoAnalysis.imgCount === 0) {
      return {
        status: 'info' as const,
        advice: t('seo.checklist.noImages', "Envisagez d'ajouter des images pertinentes pour améliorer votre contenu.")
      };
    }
    return {
      status: 'success' as const,
      advice: ''
    };
  };

  const getInternalLinksStatus = () => {
    if (!seoAnalysis.internalLinks || seoAnalysis.internalLinks === 0) {
      return {
        status: 'warning' as const,
        advice: t('seo.checklist.noInternalLinks', "Ajoutez des liens internes vers d'autres pages de votre site pour améliorer la navigation.")
      };
    }
    return {
      status: 'success' as const,
      advice: ''
    };
  };
  
  const metaStatus = getMetaStatus();
  const descriptionStatus = getDescriptionStatus();
  const headingStatus = getHeadingStatus();
  const contentStatus = getContentStatus();
  const imageStatus = getImageStatus();
  const internalLinksStatus = getInternalLinksStatus();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">
          {t('seo.checklist.title', 'Checklist SEO')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          <SeoChecklistItem
            title={t('seo.title', 'Titre')}
            status={metaStatus.status}
            value={seoAnalysis.title ? `${seoAnalysis.title.length} ${t('seo.characters', 'caractères')}` : t('seo.notDefined', 'Non défini')}
            description={seoAnalysis.title || t('seo.checklist.noTitle', 'Aucun titre défini')}
            advice={metaStatus.advice}
          />
          
          <SeoChecklistItem
            title={t('seo.description', 'Description')}
            status={descriptionStatus.status}
            value={seoAnalysis.description ? `${seoAnalysis.description.length} ${t('seo.characters', 'caractères')}` : t('seo.notDefined_female', 'Non définie')}
            description={seoAnalysis.description || t('seo.checklist.noDescription', 'Aucune meta description définie')}
            advice={descriptionStatus.advice}
          />
          
          <SeoChecklistItem
            title={t('seo.checklist.headings', 'Structure des titres')}
            status={headingStatus.status}
            description={`H1: ${seoAnalysis.h1Count || 0}, H2: ${seoAnalysis.h2Count || 0}, H3: ${seoAnalysis.h3Count || 0}`}
            advice={headingStatus.advice}
          />
          
          <SeoChecklistItem
            title={t('seo.content', 'Contenu')}
            status={contentStatus.status}
            value={`${seoAnalysis.wordCount || 0} ${t('seo.words', 'mots')}`}
            advice={contentStatus.advice}
          />
          
          <SeoChecklistItem
            title={t('seo.images', 'Images')}
            status={imageStatus.status}
            description={`${seoAnalysis.imgCount || 0} ${t('seo.totalImages', 'images au total')}, ${seoAnalysis.imgWithoutAlt || 0} ${t('seo.imagesWithoutAlt', 'sans texte alt')}`}
            advice={imageStatus.advice}
          />
          
          <SeoChecklistItem
            title={t('seo.links', 'Liens')}
            status={internalLinksStatus.status}
            description={`${t('seo.internalLinks', 'Liens internes')}: ${seoAnalysis.internalLinks || 0}, ${t('seo.externalLinks', 'Liens externes')}: ${seoAnalysis.externalLinks || 0}`}
            advice={internalLinksStatus.advice}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default SeoChecklist;
