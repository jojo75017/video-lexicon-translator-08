import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: "Marie D.",
    role: "Consultante Marketing",
    content: "Ces prompts ont transformé ma productivité ! Je génère maintenant du contenu 10x plus rapidement.",
    rating: 5
  },
  {
    name: "Thomas L.",
    role: "Entrepreneur",
    content: "La qualité des prompts est exceptionnelle. Mes campagnes marketing ont un taux de conversion 3x supérieur.",
    rating: 5
  },
  {
    name: "Sophie R.",
    role: "Rédactrice Web",
    content: "Indispensable pour mon travail quotidien. Je recommande à tous les professionnels du contenu !",
    rating: 5
  }
];

export const TestimonialsSection: React.FC = () => {
  return (
    <div className="mb-12">
      <h2 className="text-3xl font-bold text-center text-foreground mb-8">
        💬 Ce que disent nos utilisateurs
      </h2>
      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <Card key={index} className="glow-effect border-border/50">
            <CardContent className="pt-6">
              <div className="flex mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-muted-foreground mb-4 italic">"{testimonial.content}"</p>
              <div>
                <p className="font-semibold text-foreground">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};