
export const analyzeSocialMetrics = () => {
  // Génération de chiffres plus réalistes pour les réseaux sociaux
  return {
    facebook: {
      shares: Math.floor(Math.random() * 30) + 5, // Entre 5-35 partages
      likes: Math.floor(Math.random() * 50) + 10, // Entre 10-60 likes
      comments: Math.floor(Math.random() * 15) + 2 // Entre 2-17 commentaires
    },
    twitter: {
      shares: Math.floor(Math.random() * 20) + 3, // Entre 3-23 partages
      likes: Math.floor(Math.random() * 40) + 5, // Entre 5-45 likes
      replies: Math.floor(Math.random() * 10) + 1 // Entre 1-11 réponses
    },
    linkedin: {
      shares: Math.floor(Math.random() * 15) + 2, // Entre 2-17 partages
      engagements: Math.floor(Math.random() * 25) + 5 // Entre 5-30 engagements
    }
  };
};
