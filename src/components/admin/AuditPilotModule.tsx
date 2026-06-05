import React from 'react';
import { KdpAmazonResearch } from '@/components/ebook/KdpAmazonResearch';

/**
 * Module cockpit V3 — Cockpit Audit Pilot.
 * Réutilise l'outil de recherche/audit KDP existant, ouvert sur l'onglet "pilot".
 */
const AuditPilotModule: React.FC = () => <KdpAmazonResearch defaultTab="pilot" />;

export default AuditPilotModule;
