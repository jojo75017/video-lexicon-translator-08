import Niches10Offer from "@/components/marketing/Niches10Offer";

/**
 * Bloc cadeau « 10 niches KDP ».
 * Le lien externe a été supprimé : le pack est désormais livré immédiatement
 * dans l'application, sur /10-niches-offertes, sans quitter EbookStudio.
 */
const Guide10NichesBlock = () => (
  <section id="guide-10-niches" className="py-14 px-4 bg-joy-cream">
    <div className="max-w-4xl mx-auto">
      <Niches10Offer surface="inline" hook="default" variant="hero" />
    </div>
  </section>
);

export default Guide10NichesBlock;
