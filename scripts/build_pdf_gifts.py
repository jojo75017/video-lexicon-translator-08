"""
Génération des 3 PDF cadeaux jovaux pour Ebookstudio.
Style : Amazon KDP + énergie joyeuse (couleurs vives, icônes, emojis, badges).
"""
import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.colors import HexColor, white, black
from reportlab.lib.units import cm, mm
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle,
    KeepTogether, Flowable
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

# Polices
DEJA = "/nix/store/xhanp47490n743s7zd27d8i9s1khg6c0-dejavu-fonts-minimal-2.37/share/fonts/truetype/DejaVuSans.ttf"
pdfmetrics.registerFont(TTFont("DejaVu", DEJA))

# Mapping emojis modernes -> symboles DejaVu compatibles (sinon carrés vides)
EMOJI_MAP = {
    "💎":"◆","🎧":"◉","🎙️":"♪","🎙":"♪","📘":"❦","📖":"❦","✨":"✦","🎯":"◉",
    "📝":"✎","💡":"☀","🚀":"▲","🎉":"✦","🔑":"⚷","🎨":"✿","📦":"◆","🎬":"▶",
    "📊":"▦","✍️":"✎","✍":"✎","🎵":"♪","❌":"✗","✅":"✓","⚠️":"⚠","⚠":"⚠",
    "💰":"$","📚":"❦","👨‍👩‍👧":"♥","🌱":"✿","👤":"◉","📋":"▦","📐":"△","🖼️":"▣","🖼":"▣",
    "📄":"❦","📧":"✉","🌐":"◉","🎁":"❦","🤝":"♥","👋":"♥","🛡️":"⚖","🛡":"⚖",
    "🍽️":"◉","🍽":"◉","🧠":"◆","✂️":"✂","⭐":"★","🔥":"⚡","⏰":"◉","📈":"▲",
    "️":"",  # variation selector seul (U+FE0F restant)
}
def fix_emoji(s):
    for k, v in EMOJI_MAP.items():
        s = s.replace(k, v)
    return s

# Patch Paragraph & Table inputs by wrapping in a helper used below
import builtins
_orig_Paragraph = Paragraph
def Paragraph(text, *a, **kw):
    if isinstance(text, str):
        text = fix_emoji(text)
    return _orig_Paragraph(text, *a, **kw)
# Override CoverPage texts via fix_emoji on construct


# Charte couleurs (Amazon KDP + joy)
TEAL = HexColor("#008296")
ORANGE = HexColor("#FF9E2D")
INK = HexColor("#232F3E")
CREAM = HexColor("#FAFAFA")
PEACH = HexColor("#FFD8B5")
SUN = HexColor("#FFE066")
BUBBLE = HexColor("#FF6B9D")
MINT = HexColor("#7ED9B0")
SKY = HexColor("#A0D8F1")
LAVENDER = HexColor("#C9A0DC")
SOFT_GREY = HexColor("#E8ECEF")

OUTPUT_DIR = "public/lead-magnets"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# ===== Styles partagés =====
def make_styles():
    return {
        "title": ParagraphStyle("title", fontName="DejaVu", fontSize=32, textColor=white,
                                alignment=TA_CENTER, leading=38, spaceAfter=12),
        "subtitle": ParagraphStyle("subtitle", fontName="DejaVu", fontSize=14, textColor=white,
                                   alignment=TA_CENTER, leading=20, spaceAfter=8),
        "h1": ParagraphStyle("h1", fontName="DejaVu", fontSize=22, textColor=TEAL,
                             alignment=TA_LEFT, leading=28, spaceBefore=18, spaceAfter=10),
        "h2": ParagraphStyle("h2", fontName="DejaVu", fontSize=16, textColor=ORANGE,
                             alignment=TA_LEFT, leading=20, spaceBefore=12, spaceAfter=6),
        "body": ParagraphStyle("body", fontName="DejaVu", fontSize=11, textColor=INK,
                               alignment=TA_JUSTIFY, leading=16, spaceAfter=6),
        "bullet": ParagraphStyle("bullet", fontName="DejaVu", fontSize=11, textColor=INK,
                                 leftIndent=18, leading=16, spaceAfter=4),
        "small": ParagraphStyle("small", fontName="DejaVu", fontSize=9, textColor=HexColor("#666"),
                                alignment=TA_CENTER, leading=12),
        "callout": ParagraphStyle("callout", fontName="DejaVu", fontSize=12, textColor=INK,
                                  alignment=TA_LEFT, leading=18),
        "badge": ParagraphStyle("badge", fontName="DejaVu", fontSize=10, textColor=white,
                                alignment=TA_CENTER, leading=12),
    }

# ===== Flowables custom =====
class ColorBand(Flowable):
    """Bande colorée pleine largeur (header/cover)."""
    def __init__(self, height, color, width=None):
        super().__init__()
        self.height = height
        self.color = color
        self.width = width

    def wrap(self, aW, aH):
        self.width = self.width or aW
        return (self.width, self.height)

    def draw(self):
        self.canv.setFillColor(self.color)
        self.canv.rect(0, 0, self.width, self.height, fill=1, stroke=0)


class CoverPage(Flowable):
    """Cover joyeuse pleine page."""
    def __init__(self, title, subtitle, emoji_big, accent_color, gradient_to):
        super().__init__()
        self.title = fix_emoji(title)
        self.subtitle = fix_emoji(subtitle)
        self.emoji = fix_emoji(emoji_big)
        self.accent = accent_color
        self.grad = gradient_to

    def wrap(self, aW, aH):
        self._w = aW
        self._h = aH
        return (aW, aH)

    def draw(self):
        c = self.canv
        W, H = self._w, self._h
        # fond dégradé simulé via 30 bandes
        steps = 40
        for i in range(steps):
            t = i / (steps - 1)
            r = (1 - t) * self.accent.red + t * self.grad.red
            g = (1 - t) * self.accent.green + t * self.grad.green
            b = (1 - t) * self.accent.blue + t * self.grad.blue
            c.setFillColorRGB(r, g, b)
            c.rect(0, H * i / steps, W, H / steps + 1, fill=1, stroke=0)

        # cercles décoratifs
        c.setFillColor(white)
        c.setFillAlpha(0.08)
        c.circle(W * 0.85, H * 0.85, 80, fill=1, stroke=0)
        c.circle(W * 0.15, H * 0.2, 120, fill=1, stroke=0)
        c.circle(W * 0.9, H * 0.3, 40, fill=1, stroke=0)
        c.setFillAlpha(1)

        # Badge "GRATUIT"
        c.setFillColor(SUN)
        c.roundRect(W/2 - 60, H * 0.78, 120, 28, 14, fill=1, stroke=0)
        c.setFillColor(INK)
        c.setFont("DejaVu", 12)
        c.drawCentredString(W/2, H * 0.785, "★  100% GRATUIT  ★")

        # Emoji géant
        c.setFillColor(white)
        c.setFont("DejaVu", 120)
        c.drawCentredString(W/2, H * 0.55, self.emoji)

        # Titre
        c.setFillColor(white)
        c.setFont("DejaVu", 36)
        # split title sur plusieurs lignes si long
        lines = self.title.split("|")
        y = H * 0.42
        for line in lines:
            c.drawCentredString(W/2, y, line.strip())
            y -= 44

        # Sous-titre
        c.setFillColor(white)
        c.setFont("DejaVu", 14)
        sub_lines = self.subtitle.split("|")
        y = H * 0.25
        for line in sub_lines:
            c.drawCentredString(W/2, y, line.strip())
            y -= 18

        # Footer brand
        c.setFillColor(white)
        c.setFillAlpha(0.85)
        c.setFont("DejaVu", 11)
        c.drawCentredString(W/2, 40, "ebookstudio.fr  ·  Cadeau offert par Georges Boubet")
        c.setFillAlpha(1)


def colored_callout(text, bg_color, icon="★"):
    """Boîte d'appel colorée avec icône."""
    styles = make_styles()
    data = [[Paragraph(f'<font size="20" color="{bg_color.hexval()}">{icon}</font>', styles["callout"]),
             Paragraph(text, styles["callout"])]]
    t = Table(data, colWidths=[1.2*cm, 14*cm])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,-1), HexColor(bg_color.hexval()[:7] + "20") if False else SOFT_GREY),
        ("VALIGN", (0,0), (-1,-1), "MIDDLE"),
        ("LEFTPADDING", (0,0), (-1,-1), 12),
        ("RIGHTPADDING", (0,0), (-1,-1), 12),
        ("TOPPADDING", (0,0), (-1,-1), 10),
        ("BOTTOMPADDING", (0,0), (-1,-1), 10),
        ("LINEBEFORE", (0,0), (0,-1), 4, bg_color),
        ("ROUNDEDCORNERS", [6,6,6,6]),
    ]))
    return t


def colored_box(title, body, color, emoji=""):
    """Carte colorée pour mettre en valeur une section."""
    styles = make_styles()
    title_para = Paragraph(f'<font color="white" size="14"><b>{emoji}  {title}</b></font>', styles["body"])
    body_para = Paragraph(f'<font color="#232F3E">{body}</font>', styles["body"])
    data = [[title_para], [body_para]]
    t = Table(data, colWidths=[15.5*cm])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (0,0), color),
        ("BACKGROUND", (0,1), (0,1), HexColor("#FFFFFF")),
        ("BOX", (0,0), (-1,-1), 1.5, color),
        ("LEFTPADDING", (0,0), (-1,-1), 14),
        ("RIGHTPADDING", (0,0), (-1,-1), 14),
        ("TOPPADDING", (0,0), (-1,-1), 10),
        ("BOTTOMPADDING", (0,0), (-1,-1), 10),
    ]))
    return t


def divider(color=ORANGE):
    return colored_callout("", color)


def footer_canvas(canvas, doc):
    """Footer + pagination sur chaque page (sauf cover)."""
    if doc.page == 1:
        return
    canvas.saveState()
    canvas.setFillColor(TEAL)
    canvas.rect(0, 0, A4[0], 18, fill=1, stroke=0)
    canvas.setFillColor(white)
    canvas.setFont("DejaVu", 9)
    canvas.drawString(2*cm, 6, "ebookstudio.fr · Cadeau offert")
    canvas.drawRightString(A4[0] - 2*cm, 6, f"Page {doc.page}")
    canvas.restoreState()


# ===== PDF 1 : 50 NICHES RENTABLES KDP 2026 =====
def build_50_niches():
    path = f"{OUTPUT_DIR}/50-niches-rentables-kdp-2026.pdf"
    doc = SimpleDocTemplate(path, pagesize=A4,
                            leftMargin=2*cm, rightMargin=2*cm,
                            topMargin=1.5*cm, bottomMargin=1.5*cm,
                            title="50 Niches Rentables KDP 2026",
                            author="Ebookstudio")
    styles = make_styles()
    story = []

    # COVER
    story.append(CoverPage(
        title="50 NICHES KDP|RENTABLES 2026",
        subtitle="Le guide des opportunités à saisir|sur Amazon KDP cette année",
        emoji_big="💎",
        accent_color=TEAL,
        gradient_to=BUBBLE,
    ))
    story.append(PageBreak())

    # INTRO
    story.append(Paragraph("🎯  Bienvenue dans ton guide cadeau !", styles["h1"]))
    story.append(Paragraph(
        "Tu tiens entre les mains <b>50 niches Amazon KDP</b> que j'ai sélectionnées "
        "pour leur potentiel en 2026 : <b>demande réelle</b>, <b>concurrence accessible</b> "
        "et <b>marge confortable</b>.<br/><br/>"
        "Pour chaque niche tu trouveras : son angle gagnant, le type de livre à publier, "
        "les mots-clés à viser, et un exemple de titre qui cartonne déjà. "
        "Pioche celle qui te parle et lance-toi !", styles["body"]))
    story.append(Spacer(1, 10))

    story.append(colored_box(
        "★  Le secret",
        "Ne cherche pas LA niche parfaite. Choisis-en une qui te plaît, publie 3 livres dessus, "
        "et tu verras : 80% du succès vient de la régularité, pas du choix de la niche.",
        ORANGE, emoji="💡"
    ))
    story.append(PageBreak())

    # 50 niches — 6 catégories x ~8 niches
    categories = [
        ("📚  Développement Personnel", MINT, [
            ("Journal de gratitude guidé 90 jours", "Carnet ligné/guidé, prompts quotidiens", "gratitude, journal, mindfulness", "Le Pouvoir de la Gratitude Quotidienne"),
            ("Bullet journal débutant", "Guide + pages pratiques", "bullet journal, organisation, productivité", "Mon Premier Bullet Journal"),
            ("Routine matinale gagnante", "Méthode + tracker 30 jours", "morning routine, miracle morning", "Miracle Morning à la Française"),
            ("Habitudes atomiques version FR", "Livre court 80 pages", "habitudes, atomic habits, james clear", "Petites Habitudes, Grands Résultats"),
            ("Confiance en soi pour femmes", "Guide pratique + exercices", "confiance en soi, estime, femme", "Femme Forte, Femme Libre"),
            ("Stoïcisme moderne", "Méditations quotidiennes", "stoïcisme, marc-aurèle, philosophie pratique", "Le Stoïcien Moderne"),
            ("Détox digitale 21 jours", "Programme + carnet de suivi", "détox digital, addiction écrans", "21 Jours Sans Écrans"),
            ("Méditation pour débutants", "Guide + exercices guidés", "méditation, pleine conscience, débutant", "Méditer en 5 Minutes par Jour"),
        ]),
        ("💰  Finance & Business", SKY, [
            ("Investir en bourse pour débutants", "Guide simple actions/ETF", "bourse, investissement, etf", "Bourse pour les Nuls Confirmés"),
            ("Immobilier locatif zéro apport", "Stratégies + cas pratiques", "immobilier locatif, sci, lmnp", "Investir sans Apport"),
            ("Dropshipping 2026", "Guide à jour TikTok Shop", "dropshipping, ecommerce, shopify", "Dropshipping Nouvelle Génération"),
            ("Freelance Upwork & Malt", "Trouver ses 5 premiers clients", "freelance, upwork, malt, missions", "De Salarié à Freelance Rentable"),
            ("Print on Demand", "Guide Redbubble/Etsy", "pod, print on demand, redbubble", "Vivre du Print on Demand"),
            ("Auto-entrepreneur 2026", "Démarches + optimisation", "auto entrepreneur, micro entreprise", "Auto-Entrepreneur Sans Erreur"),
            ("Budget familial intelligent", "Méthode enveloppes + Excel", "budget famille, finances perso", "Reprendre le Contrôle de son Argent"),
            ("Crypto pour les prudents", "Bitcoin/ETH expliqués", "crypto, bitcoin, débutant", "Crypto Sans Risquer Sa Chemise"),
        ]),
        ("🎨  Loisirs Créatifs", LAVENDER, [
            ("Cahier de coloriage adultes anti-stress", "50 mandalas haute déf", "coloriage adulte, mandala, anti stress", "Mandala Zen Édition Luxe"),
            ("Coloriage enfants animaux", "30 dessins simples", "coloriage enfant, animaux", "Le Grand Livre des Animaux à Colorier"),
            ("Tricot débutant", "10 modèles faciles", "tricot débutant, point mousse", "Mon Premier Tricot"),
            ("Aquarelle débutant", "Techniques + 20 sujets", "aquarelle, peinture débutant", "Aquarelle Sans Stress"),
            ("Calligraphie moderne", "Lettrage main + exercices", "calligraphie, lettering, brush", "Calligraphie Moderne pour Tous"),
            ("Photographie smartphone", "Composition + retouche", "photo smartphone, iphone photo", "Pro avec ton Téléphone"),
            ("Origami enfants", "30 modèles progressifs", "origami enfant, pliage papier", "Origami Magique"),
            ("Scrapbooking digital", "Templates + tutos Canva", "scrapbooking, album photo, canva", "Scrapbooking 2.0"),
        ]),
        ("🍽️  Cuisine & Bien-être", PEACH, [
            ("Recettes Airfryer 30 minutes", "100 recettes testées", "airfryer, friteuse air, recettes", "Airfryer Magique 100 Recettes"),
            ("Batch cooking semaine", "4 semaines de menus", "batch cooking, meal prep, planning", "Batch Cooking Sans Stress"),
            ("Régime cétogène débutant", "Plan + recettes simples", "keto, cétogène, perte de poids", "Keto en Famille"),
            ("Jeûne intermittent femmes", "Protocole adapté hormones", "jeûne intermittent, femme", "Jeûne Intermittent au Féminin"),
            ("Smoothies détox", "60 recettes santé", "smoothie, détox, jus", "Bowl & Smoothie Énergie"),
            ("Plantes médicinales", "Guide herboristerie maison", "plantes médicinales, tisane", "Mon Herboristerie Maison"),
            ("Pain maison sans machine", "Recettes faciles", "pain maison, boulange", "Le Pain de Tous les Jours"),
            ("Cuisine méditerranéenne", "Régime crétois", "régime méditerranéen, crétois", "Manger Comme un Centenaire"),
        ]),
        ("👨‍👩‍👧  Famille & Enfants", SUN, [
            ("Cahier d'écriture maternelle", "Tracé lettres + chiffres", "écriture maternelle, lettres", "J'Apprends à Écrire en M'Amusant"),
            ("Devoirs CP CE1", "Cahier vacances", "cahier vacances, cp ce1", "Vacances Studieuses CP"),
            ("Histoires du soir 5 minutes", "30 contes apaisants", "histoire soir, conte enfant", "30 Histoires pour S'Endormir"),
            ("Parentalité positive", "Guide pratique", "parentalité positive, éducation", "Élever Sans Crier"),
            ("Activités enfants 3-6 ans", "100 idées intérieur", "activité enfant, jeux maison", "100 Activités Anti-Ennui"),
            ("Premiers gestes bébé", "Guide jeunes parents", "bébé, jeune parent, soins", "Mon Premier Bébé Sans Paniquer"),
            ("Anniversaire à thème", "10 fêtes clé en main", "anniversaire enfant, fête", "Anniversaires Magiques"),
            ("Quiz famille", "500 questions tous âges", "quiz famille, jeux apéro", "Le Grand Quiz des Familles"),
        ]),
        ("🌱  Niches Spécialisées", BUBBLE, [
            ("Permaculture balcon", "Cultiver en ville", "permaculture, jardin balcon", "Mon Potager sur Balcon"),
            ("Voyage solo femme", "30 destinations sûres", "voyage solo femme, backpack", "Voyager Seule en Toute Sécurité"),
            ("Apprendre l'anglais 30 jours", "Méthode immersion", "anglais débutant, méthode", "Anglais en 30 Jours Chrono"),
            ("Sommeil profond", "Techniques + rituel", "insomnie, sommeil, mélatonine", "Dormir Comme un Bébé"),
            ("Yoga pour le dos", "20 postures ciblées", "yoga dos, mal de dos", "Yoga Anti Mal de Dos"),
            ("Course à pied 5km en 6 semaines", "Programme progressif", "course à pied, running débutant", "Du Canapé au 5km"),
            ("Minimalisme et désencombrement", "Méthode KonMari adaptée", "minimalisme, rangement, konmari", "Désencombrer pour Respirer"),
            ("ChatGPT pour seniors", "Guide pas-à-pas", "chatgpt débutant, ia senior", "ChatGPT Expliqué à Mamie"),
            ("Reconversion à 40 ans", "Bilan + plan d'action", "reconversion professionnelle, 40 ans", "Changer de Vie à 40 Ans"),
            ("Vivre avec une chronique", "Témoignages + conseils", "maladie chronique, douleur", "Vivre Pleinement Malgré Tout"),
        ]),
    ]

    # Page sommaire
    story.append(Paragraph("📖  Sommaire", styles["h1"]))
    for cat_name, cat_color, items in categories:
        story.append(colored_box(cat_name, f"{len(items)} niches détaillées dans cette catégorie", cat_color, emoji="▸"))
        story.append(Spacer(1, 6))
    story.append(PageBreak())

    # Détail par catégorie
    for cat_name, cat_color, items in categories:
        story.append(Paragraph(cat_name, styles["h1"]))
        story.append(Spacer(1, 6))
        for niche, format_, kw, exemple in items:
            data = [
                [Paragraph(f'<font size="13" color="white"><b>✦  {niche}</b></font>', styles["body"])],
                [Paragraph(f'<b>📝 Format :</b> {format_}', styles["body"])],
                [Paragraph(f'<b>🔑 Mots-clés :</b> <font color="#008296">{kw}</font>', styles["body"])],
                [Paragraph(f'<b>💡 Exemple de titre qui vend :</b> <i>"{exemple}"</i>', styles["body"])],
            ]
            t = Table(data, colWidths=[16*cm])
            t.setStyle(TableStyle([
                ("BACKGROUND", (0,0), (0,0), cat_color),
                ("BACKGROUND", (0,1), (0,-1), HexColor("#FFFFFF")),
                ("BOX", (0,0), (-1,-1), 1, cat_color),
                ("LEFTPADDING", (0,0), (-1,-1), 12),
                ("RIGHTPADDING", (0,0), (-1,-1), 12),
                ("TOPPADDING", (0,0), (-1,-1), 8),
                ("BOTTOMPADDING", (0,0), (-1,-1), 8),
            ]))
            story.append(KeepTogether([t, Spacer(1, 10)]))
        story.append(PageBreak())

    # CTA final
    story.append(CoverPage(
        title="PASSE À|L'ACTION 🚀",
        subtitle="Avec Ebookstudio Pro V2, génère ton premier ebook|sur l'une de ces 50 niches en 2 heures.|→ ebookstudio.fr",
        emoji_big="🎉",
        accent_color=ORANGE,
        gradient_to=BUBBLE,
    ))

    doc.build(story, onFirstPage=lambda c,d: None, onLaterPages=footer_canvas)
    print(f"✓ {path}")


# ===== PDF 2 : GUIDE EBOOK AUDIO =====
def build_ebook_audio():
    path = f"{OUTPUT_DIR}/guide-ebook-audio-fonctionnement.pdf"
    doc = SimpleDocTemplate(path, pagesize=A4,
                            leftMargin=2*cm, rightMargin=2*cm,
                            topMargin=1.5*cm, bottomMargin=1.5*cm,
                            title="Guide Ebook Audio - Ebookstudio",
                            author="Ebookstudio")
    styles = make_styles()
    story = []

    story.append(CoverPage(
        title="EBOOK AUDIO|MODE D'EMPLOI 🎧",
        subtitle="Comment transformer ton ebook en livre audio professionnel|en moins de 30 minutes avec Ebookstudio",
        emoji_big="🎙️",
        accent_color=BUBBLE,
        gradient_to=ORANGE,
    ))
    story.append(PageBreak())

    story.append(Paragraph("🎉  Bienvenue dans l'univers du livre audio !", styles["h1"]))
    story.append(Paragraph(
        "Le marché du livre audio explose : <b>+25%/an en France</b>. Audible, Storytel, Kobo... "
        "tes lecteurs veulent t'écouter, pas seulement te lire.<br/><br/>"
        "Bonne nouvelle : avec <b>Ebookstudio Pro V2</b>, tu transformes ton ebook en livre audio "
        "professionnel <b>sans micro, sans studio, sans compétences techniques</b>. "
        "Voici comment ça marche.", styles["body"]))
    story.append(Spacer(1, 12))

    story.append(colored_box(
        "Le résultat en chiffres",
        "✓  Voix neuronale niveau humain (OpenAI TTS HD)<br/>"
        "✓  Découpage automatique en chapitres MP3<br/>"
        "✓  Intro professionnelle générée (titre + auteur)<br/>"
        "✓  Hébergement gratuit + page de vente publique<br/>"
        "✓  Coût : ~3€ pour 10h d'audio (vs 500-2000€ studio)",
        TEAL, emoji="📊"
    ))
    story.append(PageBreak())

    # Étapes
    etapes = [
        ("1", "📝", "Tu pars de ton manuscrit", TEAL,
         "Soit tu utilises un ebook généré dans Ebookstudio (workflow 15 agents), soit tu colles ton texte. "
         "L'outil <b>nettoie automatiquement</b> les artefacts Markdown (## ** etc.) qui sinon seraient lus à voix haute."),
        ("2", "🧠", "Choix de la voix neuronale", ORANGE,
         "6 voix françaises disponibles (Alloy, Nova, Shimmer, Onyx, Echo, Fable). "
         "Écoute un échantillon de 30 secondes avant de lancer la conversion complète. "
         "Conseil : <b>Nova</b> pour le développement personnel, <b>Onyx</b> pour la fiction sombre, <b>Shimmer</b> pour les enfants."),
        ("3", "✂️", "Segmentation automatique", BUBBLE,
         "OpenAI TTS a une limite de 4096 caractères par requête. Ebookstudio découpe ton texte "
         "intelligemment en segments de <b>~2000 caractères</b> en coupant aux phrases, "
         "pour éviter les ruptures de ton."),
        ("4", "🎵", "Génération de l'intro pro", MINT,
         "Une intro audio est créée automatiquement : <i>« Vous écoutez [Titre], écrit par [Auteur]. »</i> "
         "<b>Pas de jingle, pas de musique parasite</b> — du pro, du sobre. C'est cette intro qui donne immédiatement "
         "le ton 'livre audio sérieux' vs 'TTS de site web'."),
        ("5", "⚡", "Fusion FFmpeg dans ton navigateur", LAVENDER,
         "Tous les segments audio sont fusionnés <b>directement dans ton navigateur</b> via FFmpeg.wasm. "
         "Aucun serveur n'a accès à ton contenu. Si la fusion plante (livre très long), "
         "les segments bruts sont sauvegardés en backup → tu ne perds jamais rien."),
        ("6", "🌐", "Hébergement + page publique", SKY,
         "Ton audiobook est uploadé sur ton espace privé Supabase. Une <b>page de vente publique</b> "
         "est générée avec slug personnalisé : <i>ebookstudio.fr/audio/ton-titre</i>. "
         "Bouton PayPal intégré, teasers gratuits sur la page publique, accès complet sur la page de remerciement."),
        ("7", "📧", "Livraison post-achat automatique", SUN,
         "Quand un client achète, il reçoit un <b>email Resend automatique</b> avec lien sécurisé. "
         "Redirection automatique vers la page d'écoute. Tu ne touches à rien."),
    ]

    for num, emoji, titre, color, body in etapes:
        # Numéro géant + titre
        header_data = [[
            Paragraph(f'<font size="36" color="white"><b>{num}</b></font>', styles["body"]),
            Paragraph(f'<font size="16" color="white"><b>{emoji}  {titre}</b></font>', styles["body"]),
        ]]
        h = Table(header_data, colWidths=[2*cm, 14*cm])
        h.setStyle(TableStyle([
            ("BACKGROUND", (0,0), (-1,-1), color),
            ("VALIGN", (0,0), (-1,-1), "MIDDLE"),
            ("LEFTPADDING", (0,0), (-1,-1), 14),
            ("RIGHTPADDING", (0,0), (-1,-1), 14),
            ("TOPPADDING", (0,0), (-1,-1), 12),
            ("BOTTOMPADDING", (0,0), (-1,-1), 12),
        ]))
        body_data = [[Paragraph(body, styles["body"])]]
        b = Table(body_data, colWidths=[16*cm])
        b.setStyle(TableStyle([
            ("BACKGROUND", (0,0), (-1,-1), HexColor("#FFFFFF")),
            ("BOX", (0,0), (-1,-1), 1, color),
            ("LEFTPADDING", (0,0), (-1,-1), 14),
            ("RIGHTPADDING", (0,0), (-1,-1), 14),
            ("TOPPADDING", (0,0), (-1,-1), 12),
            ("BOTTOMPADDING", (0,0), (-1,-1), 12),
        ]))
        story.append(KeepTogether([h, b, Spacer(1, 14)]))

    story.append(PageBreak())

    story.append(Paragraph("💡  3 erreurs à éviter absolument", styles["h1"]))
    erreurs = [
        ("❌  Coller du texte avec Markdown", "Les ** et ## seront lus à voix haute. → Toujours utiliser le bouton 'Nettoyer texte' avant TTS."),
        ("❌  Vouloir tout fusionner en 1 seul MP3 de 10h", "Risque de crash navigateur. → Garder le découpage par chapitres (Audible préfère)."),
        ("❌  Oublier l'intro", "Sans intro, ça sonne 'amateur'. → Toujours activer 'Intro automatique titre + auteur'."),
    ]
    for err, fix in erreurs:
        story.append(colored_box(err, fix, ORANGE, emoji="⚠"))
        story.append(Spacer(1, 8))

    story.append(PageBreak())

    story.append(Paragraph("🎯  Et maintenant ?", styles["h1"]))
    story.append(Paragraph(
        "Tu as toutes les clés. Le marché du livre audio cherche du contenu francophone — "
        "et toi tu peux en produire <b>10x plus vite</b> que la concurrence.<br/><br/>"
        "<b>Action immédiate :</b><br/>"
        "1. Connecte-toi à ton espace Ebookstudio<br/>"
        "2. Ouvre un ebook déjà publié<br/>"
        "3. Onglet 'Audio' → Lance la conversion<br/>"
        "4. Dans 30 minutes, ton premier livre audio est en ligne 🎉",
        styles["body"]))

    story.append(Spacer(1, 20))
    story.append(CoverPage(
        title="À TOI DE JOUER 🎙️",
        subtitle="ebookstudio.fr",
        emoji_big="🎧",
        accent_color=TEAL,
        gradient_to=BUBBLE,
    ))

    doc.build(story, onFirstPage=lambda c,d: None, onLaterPages=footer_canvas)
    print(f"✓ {path}")


# ===== PDF 3 : MANUEL PRINCIPAL EBOOKSTUDIO =====
def build_manuel_principal():
    path = f"{OUTPUT_DIR}/guide-generateur-ebookstudio-principal.pdf"
    doc = SimpleDocTemplate(path, pagesize=A4,
                            leftMargin=2*cm, rightMargin=2*cm,
                            topMargin=1.5*cm, bottomMargin=1.5*cm,
                            title="Guide Générateur Ebookstudio - Manuel Principal",
                            author="Ebookstudio")
    styles = make_styles()
    story = []

    story.append(CoverPage(
        title="EBOOKSTUDIO|MANUEL OFFICIEL 📘",
        subtitle="Le guide complet du générateur d'ebooks IA|qui publie sur Amazon KDP en 2 heures",
        emoji_big="✨",
        accent_color=TEAL,
        gradient_to=ORANGE,
    ))
    story.append(PageBreak())

    # SOMMAIRE
    story.append(Paragraph("📖  Au sommaire", styles["h1"]))
    toc = [
        ("1", "🎬", "Vue d'ensemble : qu'est-ce qu'Ebookstudio ?", TEAL),
        ("2", "🔑", "Configurer ta clé API Gemini (5 min)", ORANGE),
        ("3", "🚀", "Le workflow 15 agents (P1 → P15)", BUBBLE),
        ("4", "📝", "Brief projet : poser les bonnes fondations", MINT),
        ("5", "✍️", "Génération chapitres : les bonnes pratiques", LAVENDER),
        ("6", "🎨", "Couverture KDP : Studio Imagen 3", SKY),
        ("7", "📦", "Export KDP : PDF + ZIP prêts à uploader", SUN),
        ("8", "🎧", "Bonus : transformer en livre audio"  , PEACH),
        ("9", "🎯", "Plan d'action 7 jours", ORANGE),
    ]
    for num, emoji, titre, color in toc:
        story.append(colored_box(f"{emoji}  {titre}", f"Chapitre {num}", color, emoji=""))
        story.append(Spacer(1, 6))
    story.append(PageBreak())

    # CHAPITRE 1
    story.append(Paragraph("1  🎬  Qu'est-ce qu'Ebookstudio ?", styles["h1"]))
    story.append(Paragraph(
        "<b>Ebookstudio Pro V2</b> est une suite IA tout-en-un pour <b>écrire, illustrer, "
        "couvrir et publier</b> des ebooks sur Amazon KDP — sans compétences techniques.<br/><br/>"
        "Contrairement à ChatGPT ou Gemini bruts, Ebookstudio orchestre <b>15 agents spécialisés</b> "
        "qui travaillent ensemble : un agent fait le plan, un autre rédige, un autre vérifie la cohérence, "
        "un autre corrige le style, etc.<br/><br/>"
        "Résultat : un manuscrit <b>cohérent, sans répétitions, prêt KDP</b>, en 2-4 heures.",
        styles["body"]))
    story.append(Spacer(1, 8))
    story.append(colored_box(
        "Ce qui distingue Ebookstudio",
        "✓  Workflow 15 agents (vs prompts isolés)<br/>"
        "✓  Mémoire 'manuscrit bible' : les agents se souviennent des chapitres précédents<br/>"
        "✓  Validation KDP automatique (marges, polices, ISBN, Modulo 10)<br/>"
        "✓  Couvertures Imagen 3 + Cover Studio (front + back + spine)<br/>"
        "✓  Export PDF KDP + EPUB + ZIP métadonnées<br/>"
        "✓  Bonus : livre audio (OpenAI TTS) + page de vente publique",
        TEAL, emoji="💎"
    ))
    story.append(PageBreak())

    # CHAPITRE 2
    story.append(Paragraph("2  🔑  Configurer ta clé API Gemini", styles["h1"]))
    story.append(Paragraph(
        "Ebookstudio utilise Google Gemini en mode <b>BYOK</b> (Bring Your Own Key). "
        "C'est <b>GRATUIT</b> jusqu'à 1500 requêtes/jour — largement assez pour publier 5 ebooks/mois.",
        styles["body"]))
    story.append(Spacer(1, 8))
    steps = [
        ("Va sur aistudio.google.com", "Connecte-toi avec ton compte Google"),
        ("Clique 'Get API Key' → 'Create API Key'", "Sélectionne 'Free tier'"),
        ("Copie la clé (commence par AIza...)", "Garde-la précieusement, ne la partage jamais"),
        ("Colle dans Ebookstudio → Réglages → Clé Gemini", "Tu es prêt à générer ton premier ebook"),
    ]
    for i, (titre, desc) in enumerate(steps, 1):
        data = [[
            Paragraph(f'<font size="20" color="white"><b>{i}</b></font>', styles["body"]),
            Paragraph(f'<b>{titre}</b><br/><font color="#666">{desc}</font>', styles["body"]),
        ]]
        t = Table(data, colWidths=[1.5*cm, 14.5*cm])
        t.setStyle(TableStyle([
            ("BACKGROUND", (0,0), (0,0), ORANGE),
            ("BACKGROUND", (1,0), (1,0), HexColor("#FFF8E7")),
            ("VALIGN", (0,0), (-1,-1), "MIDDLE"),
            ("LEFTPADDING", (0,0), (-1,-1), 12),
            ("RIGHTPADDING", (0,0), (-1,-1), 12),
            ("TOPPADDING", (0,0), (-1,-1), 10),
            ("BOTTOMPADDING", (0,0), (-1,-1), 10),
        ]))
        story.append(t)
        story.append(Spacer(1, 6))
    story.append(PageBreak())

    # CHAPITRE 3 — 15 AGENTS
    story.append(Paragraph("3  🚀  Le workflow 15 agents", styles["h1"]))
    story.append(Paragraph(
        "Voici les 15 agents qui travaillent pour toi, dans l'ordre :",
        styles["body"]))
    story.append(Spacer(1, 8))

    agents = [
        ("P1", "Stratège niche", "Valide ta niche + positionnement", TEAL),
        ("P2", "Architecte plan", "Crée le plan détaillé du livre", TEAL),
        ("P3", "Persona lecteur", "Définit ton lecteur cible idéal", TEAL),
        ("P4", "Bible cohérence", "Mémorise ton univers et style", ORANGE),
        ("P5", "Rédacteur chapitres", "Écrit chaque chapitre 1500-2500 mots", ORANGE),
        ("P6", "Anti-répétition", "Détecte les redites entre chapitres", ORANGE),
        ("P7", "Enrichissement", "Ajoute exemples, citations, anecdotes", ORANGE),
        ("P8", "Style polish", "Rend le ton fluide et engageant", BUBBLE),
        ("P9", "Correcteur FR", "Orthographe, grammaire, typographie", BUBBLE),
        ("P10", "Titre & sous-titres", "Optimise pour Amazon SEO", BUBBLE),
        ("P11", "Intro & conclusion", "Hook puissant + CTA final", MINT),
        ("P12", "Mots-clés KDP", "Recherche 7 mots-clés rentables", MINT),
        ("P13", "Description Amazon", "Pitch produit qui convertit", MINT),
        ("P14", "Couverture brief", "Prompt Imagen 3 optimisé", LAVENDER),
        ("P15", "Validation KDP", "Vérifie marges, polices, Modulo 10", LAVENDER),
    ]
    for code, nom, role, color in agents:
        data = [[
            Paragraph(f'<font size="14" color="white"><b>{code}</b></font>', styles["body"]),
            Paragraph(f'<b>{nom}</b> — <font color="#666">{role}</font>', styles["body"]),
        ]]
        t = Table(data, colWidths=[1.5*cm, 14.5*cm])
        t.setStyle(TableStyle([
            ("BACKGROUND", (0,0), (0,0), color),
            ("BACKGROUND", (1,0), (1,0), HexColor("#FFFFFF")),
            ("BOX", (0,0), (-1,-1), 0.5, color),
            ("VALIGN", (0,0), (-1,-1), "MIDDLE"),
            ("LEFTPADDING", (0,0), (-1,-1), 12),
            ("RIGHTPADDING", (0,0), (-1,-1), 12),
            ("TOPPADDING", (0,0), (-1,-1), 8),
            ("BOTTOMPADDING", (0,0), (-1,-1), 8),
        ]))
        story.append(t)
        story.append(Spacer(1, 3))
    story.append(PageBreak())

    # CHAPITRE 4
    story.append(Paragraph("4  📝  Brief projet : les fondations", styles["h1"]))
    story.append(colored_box(
        "Règle d'or",
        "80% du succès d'un ebook IA se joue dans le BRIEF. Plus tu donnes de contexte (niche, "
        "lecteur cible, angle, ton, exemples), plus le résultat sera unique et vendable. "
        "Un brief de 3 lignes = ebook générique. Un brief de 30 lignes = ebook qui se démarque.",
        ORANGE, emoji="⭐"
    ))
    story.append(Spacer(1, 10))
    story.append(Paragraph("<b>Les 7 champs critiques du brief :</b>", styles["body"]))
    champs = [
        "🎯  <b>Niche précise</b> — pas 'développement personnel' mais 'gestion du stress pour mamans solo'",
        "👤  <b>Persona lecteur</b> — âge, situation, douleur principale, espoir",
        "💎  <b>Promesse unique</b> — ce que TON livre apporte que les autres n'ont pas",
        "📊  <b>Volume</b> — nombre de pages (max 40 chapitres, ~250 mots/page)",
        "🎨  <b>Ton</b> — chaleureux / expert / drôle / intime / motivant",
        "📚  <b>Concurrents</b> — 2-3 livres existants qui marchent dans la niche",
        "✨  <b>Angle unique</b> — l'histoire ou expérience perso qui rend ton livre légitime",
    ]
    for c in champs:
        story.append(Paragraph(f"•  {c}", styles["bullet"]))
        story.append(Spacer(1, 3))
    story.append(PageBreak())

    # CHAPITRE 5
    story.append(Paragraph("5  ✍️  Génération chapitres : bonnes pratiques", styles["h1"]))
    bonnes = [
        ("✅  Génère 3 chapitres puis VÉRIFIE", "Ne lance pas les 40 chapitres d'un coup. Vérifie la qualité après 3, ajuste le brief si besoin.", MINT),
        ("✅  Active la 'Bible cohérence' (P4)", "Sans elle, les agents oublient ce qui a été dit aux chapitres précédents → répétitions.", MINT),
        ("✅  Respecte 30 chapitres MAX recommandés", "Au-delà, Gemini peut perdre le fil. 40 = plafond technique absolu.", ORANGE),
        ("❌  Ne mélange pas plusieurs ebooks", "Un projet = un ebook. Sinon la Bible se contamine.", BUBBLE),
        ("❌  Ne supprime pas un chapitre en cours de génération", "Attends qu'il soit terminé, puis supprime. Sinon Supabase peut désynchroniser.", BUBBLE),
    ]
    for titre, body, color in bonnes:
        story.append(colored_box(titre, body, color))
        story.append(Spacer(1, 8))
    story.append(PageBreak())

    # CHAPITRE 6
    story.append(Paragraph("6  🎨  Couverture KDP : Studio Imagen 3", styles["h1"]))
    story.append(Paragraph(
        "L'agent <b>P14</b> rédige automatiquement un prompt optimisé pour <b>Google Imagen 3</b>. "
        "Tu obtiens 3 propositions de couverture avant. Ensuite, le <b>Cover Studio</b> calcule "
        "automatiquement les dimensions exactes KDP :",
        styles["body"]))
    story.append(Spacer(1, 8))
    story.append(colored_box(
        "Calculs automatiques Cover Studio",
        "✓  Largeur dos (spine) selon nombre de pages × 0.0572 mm<br/>"
        "✓  Bleed 3.175 mm sur tous les côtés<br/>"
        "✓  Code-barres ISBN intégré (zone blanche réservée)<br/>"
        "✓  Export PDF/X-1a:2001 — format exigé par KDP<br/>"
        "✓  Aperçu 3D du livre fini",
        TEAL, emoji="📐"
    ))
    story.append(PageBreak())

    # CHAPITRE 7
    story.append(Paragraph("7  📦  Export KDP : Pack ZIP prêt", styles["h1"]))
    story.append(Paragraph(
        "Quand ton ebook est validé par P15, clique <b>'Pack KDP'</b>. Tu reçois un ZIP contenant :",
        styles["body"]))
    story.append(Spacer(1, 8))
    pack = [
        ("📄  manuscrit.pdf", "PDF intérieur formaté KDP (6×9 inch par défaut)"),
        ("🖼️  couverture.pdf", "Couverture complète front+spine+back en PDF/X-1a"),
        ("📝  metadonnees.txt", "Titre, sous-titre, description, 7 mots-clés, catégories"),
        ("📋  checklist.pdf", "25 points à vérifier avant de cliquer 'Publier' sur KDP"),
    ]
    for nom, desc in pack:
        story.append(colored_box(nom, desc, ORANGE))
        story.append(Spacer(1, 4))
    story.append(PageBreak())

    # CHAPITRE 8
    story.append(Paragraph("8  🎧  Bonus : livre audio", styles["h1"]))
    story.append(Paragraph(
        "Voir le guide dédié <b>'Ebook Audio Mode d'Emploi'</b>. En résumé : OpenAI TTS HD, "
        "6 voix françaises, fusion FFmpeg navigateur, page de vente publique générée, "
        "PayPal intégré, livraison Resend automatique.",
        styles["body"]))
    story.append(PageBreak())

    # CHAPITRE 9 — PLAN ACTION
    story.append(Paragraph("9  🎯  Plan d'action 7 jours", styles["h1"]))
    plan = [
        ("Jour 1", "🔑  Configure ta clé Gemini + choisis ta niche dans le guide '50 niches'", TEAL),
        ("Jour 2", "📝  Rédige un brief béton (30 lignes minimum) + lance P1→P4", ORANGE),
        ("Jour 3", "✍️  Génère les 20-30 chapitres (P5→P11)", BUBBLE),
        ("Jour 4", "🎨  Couverture Imagen 3 + Cover Studio + relecture finale", MINT),
        ("Jour 5", "📦  Export Pack KDP + upload sur Amazon KDP", LAVENDER),
        ("Jour 6", "🎧  Bonus : génère la version audio (30 min de boulot)", SKY),
        ("Jour 7", "🎉  Ton ebook est en ligne sur Amazon. Bravo !", ORANGE),
    ]
    for jour, action, color in plan:
        data = [[
            Paragraph(f'<font size="12" color="white"><b>{jour}</b></font>', styles["body"]),
            Paragraph(action, styles["body"]),
        ]]
        t = Table(data, colWidths=[2.5*cm, 13.5*cm])
        t.setStyle(TableStyle([
            ("BACKGROUND", (0,0), (0,0), color),
            ("BACKGROUND", (1,0), (1,0), HexColor("#FFFFFF")),
            ("BOX", (0,0), (-1,-1), 1, color),
            ("VALIGN", (0,0), (-1,-1), "MIDDLE"),
            ("LEFTPADDING", (0,0), (-1,-1), 12),
            ("RIGHTPADDING", (0,0), (-1,-1), 12),
            ("TOPPADDING", (0,0), (-1,-1), 10),
            ("BOTTOMPADDING", (0,0), (-1,-1), 10),
        ]))
        story.append(t)
        story.append(Spacer(1, 5))

    story.append(Spacer(1, 20))
    story.append(CoverPage(
        title="ON Y VA ! 🚀",
        subtitle="Ton premier ebook publié cette semaine.|ebookstudio.fr",
        emoji_big="📘",
        accent_color=BUBBLE,
        gradient_to=TEAL,
    ))

    doc.build(story, onFirstPage=lambda c,d: None, onLaterPages=footer_canvas)
    print(f"✓ {path}")


if __name__ == "__main__":
    build_50_niches()
    build_ebook_audio()
    build_manuel_principal()
    print("\n✅ Les 3 PDF sont générés dans public/lead-magnets/")
