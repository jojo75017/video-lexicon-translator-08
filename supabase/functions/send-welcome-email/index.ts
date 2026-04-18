import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email }: WelcomeEmailRequest = await req.json();

    console.log(`Sending welcome email with KDP guide to ${email}`);

    const emailResponse = await resend.emails.send({
      from: "EbookStudio <noreply@ebookstudio.fr>",
      to: [email],
      subject: "🎁 Votre Guide KDP Gratuit - Bienvenue chez Ebook Studio AI !",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0f0f23; margin: 0; padding: 20px; color: #ffffff; }
            .container { max-width: 600px; margin: 0 auto; background: linear-gradient(145deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(139, 92, 246, 0.3); }
            .header { background: linear-gradient(135deg, #8B5CF6, #D946EF, #F59E0B); padding: 50px 30px; text-align: center; }
            .header h1 { color: white; margin: 0; font-size: 32px; text-shadow: 0 2px 10px rgba(0,0,0,0.3); }
            .header p { color: rgba(255,255,255,0.9); margin-top: 10px; font-size: 16px; }
            .content { padding: 40px 30px; }
            .gift-box { background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(217, 70, 239, 0.2)); border: 2px solid #8B5CF6; border-radius: 16px; padding: 30px; text-align: center; margin: 30px 0; }
            .gift-icon { font-size: 60px; margin-bottom: 15px; }
            .gift-title { font-size: 24px; font-weight: bold; color: #D946EF; margin-bottom: 10px; }
            .section-title { font-size: 20px; font-weight: bold; color: #F59E0B; margin: 30px 0 15px 0; display: flex; align-items: center; gap: 10px; }
            .tip-card { background: rgba(139, 92, 246, 0.1); border-left: 4px solid #8B5CF6; border-radius: 8px; padding: 20px; margin: 15px 0; }
            .tip-number { background: #8B5CF6; color: white; width: 28px; height: 28px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 10px; font-size: 14px; }
            .highlight { color: #D946EF; font-weight: bold; }
            .stat-box { display: inline-block; background: rgba(245, 158, 11, 0.2); border: 1px solid #F59E0B; border-radius: 8px; padding: 15px 20px; margin: 5px; text-align: center; }
            .stat-number { font-size: 28px; font-weight: bold; color: #F59E0B; }
            .stat-label { font-size: 12px; color: rgba(255,255,255,0.7); }
            .cta-button { display: inline-block; background: linear-gradient(135deg, #8B5CF6, #D946EF); color: white; padding: 18px 50px; border-radius: 30px; text-decoration: none; font-weight: bold; font-size: 18px; margin: 30px 0; transition: transform 0.3s; }
            .cta-button:hover { transform: scale(1.05); }
            .checklist { list-style: none; padding: 0; margin: 20px 0; }
            .checklist li { padding: 12px 0; border-bottom: 1px solid rgba(139, 92, 246, 0.2); display: flex; align-items: center; gap: 12px; }
            .checklist li:last-child { border-bottom: none; }
            .check-icon { color: #10B981; font-size: 20px; }
            .footer { background: rgba(0,0,0,0.3); padding: 25px 30px; text-align: center; font-size: 12px; color: rgba(255,255,255,0.6); }
            .social-links { margin: 15px 0; }
            .social-links a { color: #8B5CF6; text-decoration: none; margin: 0 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Bienvenue chez Ebook Studio AI !</h1>
              <p>Votre aventure d'auteur commence maintenant</p>
            </div>
            
            <div class="content">
              <p style="font-size: 18px; line-height: 1.8;">
                Félicitations ! Vous venez de faire le premier pas vers la création de votre ebook avec l'intelligence artificielle.
              </p>
              
              <div class="gift-box">
                <div class="gift-icon">🎁</div>
                <div class="gift-title">Votre Guide KDP Exclusif</div>
                <p style="margin: 0; color: rgba(255,255,255,0.8);">
                  Découvrez les secrets pour publier et vendre sur Amazon Kindle
                </p>
              </div>

              <div class="section-title">📚 Guide Complet KDP - Édition 2024</div>
              
              <div class="tip-card">
                <p><span class="tip-number">1</span> <strong>Créez votre compte KDP</strong></p>
                <p style="margin-left: 38px; color: rgba(255,255,255,0.8);">
                  Rendez-vous sur <span class="highlight">kdp.amazon.com</span> et créez votre compte auteur gratuitement. Vous aurez besoin d'un compte Amazon et de vos informations bancaires pour recevoir vos royalties.
                </p>
              </div>

              <div class="tip-card">
                <p><span class="tip-number">2</span> <strong>Optimisez votre titre et sous-titre</strong></p>
                <p style="margin-left: 38px; color: rgba(255,255,255,0.8);">
                  Votre titre doit contenir vos <span class="highlight">mots-clés principaux</span>. Le sous-titre est l'occasion d'ajouter des mots-clés secondaires et de clarifier la promesse de votre livre.
                </p>
              </div>

              <div class="tip-card">
                <p><span class="tip-number">3</span> <strong>Choisissez les bonnes catégories</strong></p>
                <p style="margin-left: 38px; color: rgba(255,255,255,0.8);">
                  Sélectionnez 2 catégories où vous pouvez vous démarquer. Visez des catégories avec un <span class="highlight">BSR (Best Seller Rank) accessible</span> entre 5 000 et 50 000.
                </p>
              </div>

              <div class="tip-card">
                <p><span class="tip-number">4</span> <strong>Utilisez les 7 mots-clés stratégiques</strong></p>
                <p style="margin-left: 38px; color: rgba(255,255,255,0.8);">
                  Amazon vous permet d'entrer 7 mots-clés. Utilisez des <span class="highlight">phrases longues (long-tail keywords)</span> que vos lecteurs recherchent réellement.
                </p>
              </div>

              <div class="tip-card">
                <p><span class="tip-number">5</span> <strong>Créez une couverture professionnelle</strong></p>
                <p style="margin-left: 38px; color: rgba(255,255,255,0.8);">
                  Votre couverture est votre <span class="highlight">premier vendeur</span>. Elle doit être lisible en miniature et respecter les codes de votre genre. Utilisez notre générateur IA pour des résultats pro !
                </p>
              </div>

              <div class="section-title">💰 Stratégie de Prix</div>
              
              <div style="text-align: center; margin: 20px 0;">
                <div class="stat-box">
                  <div class="stat-number">$2.99</div>
                  <div class="stat-label">Prix minimum 70% royalties</div>
                </div>
                <div class="stat-box">
                  <div class="stat-number">$9.99</div>
                  <div class="stat-label">Prix maximum 70% royalties</div>
                </div>
              </div>
              
              <p style="text-align: center; color: rgba(255,255,255,0.8);">
                En dessous de $2.99 ou au-dessus de $9.99, vous ne toucherez que 35% de royalties.
              </p>

              <div class="section-title">✅ Checklist Avant Publication</div>
              
              <ul class="checklist">
                <li><span class="check-icon">✓</span> Titre optimisé avec mots-clés</li>
                <li><span class="check-icon">✓</span> Description engageante (4000 caractères max)</li>
                <li><span class="check-icon">✓</span> 7 mots-clés stratégiques</li>
                <li><span class="check-icon">✓</span> 2 catégories pertinentes</li>
                <li><span class="check-icon">✓</span> Couverture professionnelle</li>
                <li><span class="check-icon">✓</span> Prix entre $2.99 et $9.99</li>
                <li><span class="check-icon">✓</span> Relecture finale du manuscrit</li>
              </ul>

              <div class="section-title">🚀 Prêt à créer votre bestseller ?</div>
              
              <p style="text-align: center; font-size: 16px; line-height: 1.8;">
                Avec <strong>Ebook Studio AI</strong>, créez des ebooks complets en quelques clics grâce à l'intelligence artificielle. Générez vos chapitres, couvertures et descriptions KDP automatiquement !
              </p>
              
              <p style="text-align: center;">
                <a href="https://ebookstudio.fr/guide-outils" class="cta-button">
                  📖 Voir le Guide des Outils (2 min)
                </a>
              </p>

              <p style="text-align: center; margin-top: 10px;">
                <a href="https://ebookstudio.fr/offres" style="color: #8B5CF6; text-decoration: underline; font-size: 14px;">
                  Ou découvrir les offres d'abonnement →
                </a>
              </p>
              
              <p style="text-align: center; color: rgba(255,255,255,0.6); font-size: 14px;">
                Des questions ? Répondez simplement à cet email, nous sommes là pour vous aider.
              </p>
            </div>
            
            <div class="footer">
              <p>© 2024 Ebook Studio AI - Créez des ebooks avec l'IA</p>
              <p>Vous recevez cet email car vous avez testé notre démo.</p>
              <p style="margin-top: 10px;">
                <a href="#" style="color: #8B5CF6;">Se désinscrire</a>
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Welcome email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending welcome email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
