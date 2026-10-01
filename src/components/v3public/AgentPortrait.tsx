import camille from '@/assets/agents/camille.webp';
import victor from '@/assets/agents/victor.webp';
import noemie from '@/assets/agents/noemie.webp';
import leonie from '@/assets/agents/leonie.webp';
import basile from '@/assets/agents/basile.webp';
import margaux from '@/assets/agents/margaux.webp';
import leandre from '@/assets/agents/leandre.webp';
import prune from '@/assets/agents/prune.webp';
import gaspard from '@/assets/agents/gaspard.webp';
import iris from '@/assets/agents/iris.webp';
import aurele from '@/assets/agents/aurele.webp';
import solene from '@/assets/agents/solene.webp';
import timothee from '@/assets/agents/timothee.webp';
import hugo from '@/assets/agents/hugo.webp';
import ariane from '@/assets/agents/ariane.webp';
import felix from '@/assets/agents/felix.webp';
import clemence from '@/assets/agents/clemence.webp';
import oscar from '@/assets/agents/oscar.webp';
import thea from '@/assets/agents/thea.webp';
import nathan from '@/assets/agents/nathan.webp';
import zoe from '@/assets/agents/zoe.webp';
import louise from '@/assets/agents/louise.webp';
import romain from '@/assets/agents/romain.webp';
import agathe from '@/assets/agents/agathe.webp';
import martin from '@/assets/agents/martin.webp';
import lucie from '@/assets/agents/lucie.webp';

const PORTRAITS: Record<string, string> = {
  camille, victor, noemie, leonie, basile, margaux, leandre, prune, gaspard,
  iris, aurele, solene, timothee, hugo, ariane, felix, clemence, oscar, thea,
  nathan, zoe, louise, romain, agathe, martin, lucie,
};

interface AgentPortraitProps {
  id: string;
  name: string;
}

export default function AgentPortrait({ id, name }: AgentPortraitProps) {
  const portrait = PORTRAITS[id];

  if (!portrait) return null;

  return (
    <img
      src={portrait}
      alt={`Portrait de ${name}, spécialiste EbookStudio`}
      loading="lazy"
      width={480}
      height={480}
      className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
    />
  );
}