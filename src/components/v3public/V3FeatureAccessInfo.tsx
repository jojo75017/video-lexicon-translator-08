import V3ModuleStatusBadge from './V3ModuleStatusBadge';

/** Scope labels keep broad feature presentations separate from paid extensions. */
export default function V3FeatureAccessInfo({ included, options = [] }: {
  included: string;
  options?: Array<{ title: string; route?: string; coverPro?: boolean }>;
}) {
  return (
    <div className="v3-feature-access mt-4 space-y-2" aria-label="Ce qui est inclus et les options payantes">
      <div>
        <p className="text-sm font-semibold">{included}</p>
        <V3ModuleStatusBadge />
      </div>
      {options.map(option => (
        <div key={option.title}>
          <p className="pt-2 text-sm font-semibold">{option.title}</p>
          <V3ModuleStatusBadge route={option.route} coverPro={option.coverPro} />
        </div>
      ))}
    </div>
  );
}