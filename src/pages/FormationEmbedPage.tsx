import React from 'react';
import FormationModuleTabs from '@/components/formation/FormationModuleTabs';

const FormationEmbedPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <FormationModuleTabs />
      </div>
    </div>
  );
};

export default FormationEmbedPage;
