
import React from 'react';
import { Card } from "@/components/ui/card";
import LinkBuilding from '@/components/seo/LinkBuilding';
import OrganicSearch from '@/components/seo/OrganicSearch';
import DomainOverview from '@/components/seo/DomainOverview';

const InfoCards = () => {
  return (
    <>
      <Card className="p-8 shadow-xl bg-gradient-to-br from-purple-50 to-blue-50 border-0 mb-8">
        <LinkBuilding />
      </Card>

      <Card className="p-8 shadow-xl bg-gradient-to-br from-purple-50 to-blue-50 border-0 mb-8">
        <OrganicSearch />
      </Card>

      <Card className="p-8 shadow-xl bg-gradient-to-br from-purple-50 to-blue-50 border-0 mb-8">
        <DomainOverview />
      </Card>
    </>
  );
};

export default InfoCards;
