
import React from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import SignatureGenerator from '@/components/signature/SignatureGenerator';

const SignaturePage = () => {
  return (
    <PageLayout 
      title="Générateur de Signature Email" 
      description="Créez une signature email professionnelle et personnalisée"
      currentTab="signature"
    >
      <div data-section="signature" className="py-6">
        <SignatureGenerator />
      </div>
    </PageLayout>
  );
};

export default SignaturePage;
