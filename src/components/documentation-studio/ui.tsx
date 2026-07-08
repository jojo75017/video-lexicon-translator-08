// Documentation Studio AI — petits composants d'UI réutilisables (palette Clair Ambre)
import React from 'react';
import { DS } from './constants';

export function Field({
  label, value, onChange, placeholder, hint,
}: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; hint?: string }) {
  return (
    <label className="block">
      <span className="text-[13px] font-semibold" style={{ color: DS.INK }}>{label}</span>
      {hint && <span className="block text-[11px] mb-1" style={{ color: DS.MUTED }}>{hint}</span>}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-[14px] outline-none transition-colors focus:border-[#E8951E]"
        style={{ borderColor: DS.BORDER, color: DS.INK }}
      />
    </label>
  );
}

export function Area({
  label, value, onChange, placeholder, hint, rows = 3,
}: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; hint?: string; rows?: number }) {
  return (
    <label className="block">
      <span className="text-[13px] font-semibold" style={{ color: DS.INK }}>{label}</span>
      {hint && <span className="block text-[11px] mb-1" style={{ color: DS.MUTED }}>{hint}</span>}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-[14px] leading-relaxed outline-none transition-colors focus:border-[#E8951E] resize-y"
        style={{ borderColor: DS.BORDER, color: DS.INK }}
      />
    </label>
  );
}

export function StepIntro({ icon, title, help }: { icon: string; title: string; help: string }) {
  return (
    <div className="mb-5">
      <h3 className="flex items-center gap-2 text-xl font-semibold" style={{ fontFamily: DS.SERIF, color: DS.INK }}>
        <span>{icon}</span> {title}
      </h3>
      <div className="mt-2 flex items-start gap-2 rounded-xl px-3 py-2 text-[12.5px] leading-snug"
        style={{ background: DS.AMBER_SOFT, color: DS.AMBER_DEEP, border: `1px solid ${DS.AMBER}44` }}>
        <span>💡</span><span>{help}</span>
      </div>
    </div>
  );
}

export function AmberButton({
  children, onClick, disabled, variant = 'solid', type = 'button', title,
}: {
  children: React.ReactNode; onClick?: () => void; disabled?: boolean;
  variant?: 'solid' | 'ghost'; type?: 'button' | 'submit'; title?: string;
}) {
  const base = 'inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2 text-[13px] font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed';
  const style: React.CSSProperties = variant === 'solid'
    ? { background: DS.AMBER, color: '#fff', boxShadow: '0 8px 20px -12px rgba(232,149,30,.7)' }
    : { background: '#fff', color: DS.AMBER_DEEP, border: `1px solid ${DS.AMBER}55` };
  return (
    <button type={type} onClick={onClick} disabled={disabled} title={title}
      className={`${base} ${!disabled && variant === 'solid' ? 'hover:brightness-105' : ''} ${!disabled && variant === 'ghost' ? 'hover:bg-[#FFF3DF]' : ''}`}
      style={style}>
      {children}
    </button>
  );
}
