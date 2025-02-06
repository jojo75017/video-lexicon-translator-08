
export const analyzeSocialMetrics = () => {
  return {
    facebook: {
      shares: Math.floor(Math.random() * 1000),
      likes: Math.floor(Math.random() * 2000),
      comments: Math.floor(Math.random() * 500)
    },
    twitter: {
      shares: Math.floor(Math.random() * 800),
      likes: Math.floor(Math.random() * 1500),
      replies: Math.floor(Math.random() * 300)
    },
    linkedin: {
      shares: Math.floor(Math.random() * 500),
      engagements: Math.floor(Math.random() * 1000)
    }
  };
};
