UPDATE public.ebook_projects
SET chapters = (
  replace(
  replace(
  replace(
  replace(chapters::text,
    'SANGUIS FOEDUS NON DELETUR. VALENTI ET LODOVICI IN AETERNUM MEMORIA. Le pacte de sang ne s''efface pas. À la mémoire éternelle des Valenti et des Lodovici.',
    'Le pacte de sang ne s''efface pas. À la mémoire éternelle des Valenti et des Lodovici.'),
    'Pacto Sanguinis, Veritas in Umbra. Le pacte du sang. La vérité dans l''ombre.',
    'Le pacte du sang. La vérité dans l''ombre.'),
    'In nomine Sanguinis et Terrae. Anno Domini 1687.',
    'Au nom du Sang et de la Terre. En l''an de grâce 1687.'),
    'es caractères latins, entrecoupés de termes en dialecte sicilien archaïque,',
    'es caractères anciens, entrecoupés de termes en dialecte sicilien archaïque,')
)::jsonb
WHERE id = 'd1bad0b0-6ced-4459-9658-9fd2f16a62d0';