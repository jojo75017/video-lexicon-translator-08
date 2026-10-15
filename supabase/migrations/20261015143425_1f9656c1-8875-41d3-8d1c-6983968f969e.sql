-- Arrêt des envois automatiques hérités de l'offre à 47 €.
-- Décision client du 15/10/2026 : les offres Auteur 97 €/an et Édition 497 € à vie
-- démarrent le 16/10/2026 ; les messages automatisés qui annonçaient encore 47 €
-- ne doivent plus partir. Les fonctions restent en place pour un déclenchement manuel.
SELECT cron.unschedule('relance-panier-abandonne-quotidien') WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname='relance-panier-abandonne-quotidien');
SELECT cron.unschedule('offre-lancement-sequence-9h-paris') WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname='offre-lancement-sequence-9h-paris');
SELECT cron.unschedule('offre-lancement-sequence-9h30-paris') WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname='offre-lancement-sequence-9h30-paris');
SELECT cron.unschedule('offre-lancement-sequence-10h-paris') WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname='offre-lancement-sequence-10h-paris');
