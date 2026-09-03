CREATE OR REPLACE FUNCTION public.validate_cover_composition()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  el jsonb;
  bg jsonb;
BEGIN
  IF NEW.fabric_json IS NULL THEN
    RETURN NEW;
  END IF;

  -- Aucune URL, URL signée ou token ne peut être persistée.
  IF NEW.fabric_json::text ~* '(https?://|token=)' THEN
    RAISE EXCEPTION 'Composition refusée : aucune URL ni token ne peut être enregistré.';
  END IF;

  -- Contrôles stricts uniquement pour le modèle version 2 (couverture complète brochée).
  IF NEW.fabric_json->>'documentType' = 'paperback_wrap' THEN
    IF (NEW.fabric_json->>'version') IS DISTINCT FROM '2' THEN
      RAISE EXCEPTION 'Composition paperback_wrap invalide : version 2 attendue.';
    END IF;

    IF jsonb_typeof(NEW.fabric_json->'elements') <> 'array' THEN
      RAISE EXCEPTION 'Composition paperback_wrap invalide : liste d''éléments manquante.';
    END IF;

    bg := NEW.fabric_json->'background';
    IF jsonb_typeof(bg) <> 'object'
       OR bg->>'fullColor' !~* '^#[0-9a-f]{3,8}$'
       OR bg->>'backColor' !~* '^#[0-9a-f]{3,8}$'
       OR bg->>'spineColor' !~* '^#[0-9a-f]{3,8}$' THEN
      RAISE EXCEPTION 'Composition paperback_wrap invalide : couleurs de fond incorrectes.';
    END IF;

    FOR el IN SELECT * FROM jsonb_array_elements(NEW.fabric_json->'elements') LOOP
      IF el->>'zone' NOT IN ('front', 'spine', 'back') THEN
        RAISE EXCEPTION 'Composition paperback_wrap invalide : zone inconnue (%).', el->>'zone';
      END IF;
      IF el->>'role' NOT IN (
        'title','subtitle','author','spine-title','spine-author',
        'back-blurb','back-about','back-extra'
      ) THEN
        RAISE EXCEPTION 'Composition paperback_wrap invalide : rôle inconnu (%).', el->>'role';
      END IF;
      IF jsonb_typeof(el->'nx') <> 'number'
         OR jsonb_typeof(el->'ny') <> 'number'
         OR jsonb_typeof(el->'nWidth') <> 'number'
         OR jsonb_typeof(el->'fontSizeIn') <> 'number' THEN
        RAISE EXCEPTION 'Composition paperback_wrap invalide : coordonnées ou taille non numériques.';
      END IF;
      IF (el->>'fontSizeIn')::numeric <= 0 THEN
        RAISE EXCEPTION 'Composition paperback_wrap invalide : taille de police nulle ou négative.';
      END IF;
      IF el->>'color' !~* '^#[0-9a-f]{3,8}$' THEN
        RAISE EXCEPTION 'Composition paperback_wrap invalide : couleur de texte incorrecte (%).', el->>'color';
      END IF;
      IF jsonb_typeof(el->'text') <> 'string' THEN
        RAISE EXCEPTION 'Composition paperback_wrap invalide : texte manquant.';
      END IF;
    END LOOP;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS validate_cover_composition_trigger ON public.cover_projects;

CREATE TRIGGER validate_cover_composition_trigger
BEFORE INSERT OR UPDATE ON public.cover_projects
FOR EACH ROW
EXECUTE FUNCTION public.validate_cover_composition();