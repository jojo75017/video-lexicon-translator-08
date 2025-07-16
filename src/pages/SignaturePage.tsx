
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileSignature } from 'lucide-react';
import SignatureGenerator from '@/components/signature/SignatureGenerator';

const SignaturePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <header className="bg-white border-b p-4 mb-6">
        <div className="container mx-auto flex items-center">
          <Link to="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Retour au tableau de bord
            </Button>
          </Link>
          <h1 className="ml-4 text-xl font-bold flex items-center">
            <FileSignature className="h-5 w-5 mr-2 text-blue-600" />
            Générateur de Signature Email
          </h1>
        </div>
      </header>

      <div className="container mx-auto">
        <SignatureGenerator />
      </div>
    </div>
  );
};

export default SignaturePage;
