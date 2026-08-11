UPDATE public.ebook_projects
SET chapters = (
  replace(
  replace(
  replace(
  replace(
  replace(
  replace(
  replace(chapters::text,
    'Pactum in cruore Falconis scriptum, nunquam delendum. Le pacte écrit dans le sang du Faucon ne sera jamais effacé.',
    'Le pacte écrit dans le sang du Faucon ne sera jamais effacé.'),
    'Que renferme ce maudit Pactum?', 'Que renferme ce maudit pacte?'),
    '« Sanguis meus super vos et super filios vestros. Pactum in aeternum non delendum. »— Mon sang soit sur vous et sur vos enfants, traduisit-elle à voix basse, la gorge nouée. Un pacte éternel qui ne saurait être effacé.',
    '« Mon sang soit sur vous et sur vos enfants. Un pacte éternel qui ne saurait être effacé. »— Elle lut la phrase à voix basse, la gorge nouée.'),
    'Le Pactum Sanguinis de 1693', 'Le Pacte de Sang de 1693'),
    'Pactum Sanguinis — 1642Au-dessous du texte latin,', 'Pacte de Sang — 1642Au-dessous de l''inscription,'),
    '— Pactum intra cruorem, matrimonium intra cineres... murmura-t-elle, les lèvres engourdies. Le latin était corrompu par un dialecte archaïque, du sicilien baroquisé du milieu du XVIIe siècle. Un pacte dans le sang, un mariage dans les cendres.',
    '— Un pacte dans le sang, un mariage dans les cendres... murmura-t-elle, les lèvres engourdies. La formule était corrompue par un dialecte archaïque, du sicilien baroquisé du milieu du XVIIe siècle.'),
    'Un pactum sanguinis.', 'Un pacte de sang.')
)::jsonb
WHERE id = 'd1bad0b0-6ced-4459-9658-9fd2f16a62d0';