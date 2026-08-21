interface Props {
  src: string;
  alt: string;
  caption?: string;
}

/** Cadre « navigateur » pour présenter une capture réelle de l'application. */
export default function V3ScreenFrame({ src, alt, caption }: Props) {
  return (
    <figure className="m-0">
      <div
        className="overflow-hidden rounded-2xl"
        style={{
          border: '1px solid var(--v3-line)',
          background: '#fff',
          boxShadow: '0 30px 60px -35px rgba(6,78,59,0.35)',
        }}
      >
        <div
          className="flex items-center gap-1.5 px-4 py-2.5"
          style={{ background: 'var(--v3-cream)', borderBottom: '1px solid var(--v3-line)' }}
        >
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#d9c58a' }} />
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#bcd6cc' }} />
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: 'var(--v3-line)' }} />
          <span className="ml-3 text-[10.5px] font-semibold tracking-wide" style={{ color: 'var(--v3-muted)' }}>
            ebookstudio.fr · V3
          </span>
        </div>
        <img src={src} alt={alt} loading="lazy" decoding="async" className="block w-full" />
      </div>
      {caption ? (
        <figcaption className="mt-2 text-[12px]" style={{ color: 'var(--v3-muted)' }}>
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
