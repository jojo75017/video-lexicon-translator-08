
export const analyzeTechnologies = () => {
  return {
    frameworks: ['React', 'Vue.js', 'Angular'].filter(() => Math.random() > 0.7),
    analytics: ['Google Analytics', 'Matomo'].filter(() => Math.random() > 0.7),
    advertising: ['Google Ads', 'Facebook Pixel'].filter(() => Math.random() > 0.7),
    cms: ['WordPress', 'Drupal'].filter(() => Math.random() > 0.7),
    server: ['Apache', 'Nginx'].filter(() => Math.random() > 0.7)
  };
};
