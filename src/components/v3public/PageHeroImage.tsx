export default function PageHeroImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="max-w-6xl mx-auto px-4 pt-6">
      <img src={src} alt={alt} width={1600} height={560} className="w-full h-48 md:h-64 object-cover rounded-2xl" />
    </div>
  );
}
