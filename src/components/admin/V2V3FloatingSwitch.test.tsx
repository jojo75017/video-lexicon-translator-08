import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import { V2V3FloatingSwitch } from './V2V3FloatingSwitch';

// Mock admin check → always admin
vi.mock('@/lib/adminAccess', () => ({
  getIsCurrentSessionAdmin: vi.fn().mockResolvedValue(true),
}));

function LocationProbe() {
  const loc = useLocation();
  return <div data-testid="location">{loc.pathname}</div>;
}

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <LocationProbe />
      <Routes>
        <Route path="*" element={<V2V3FloatingSwitch />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('V2V3FloatingSwitch (E2E interaction)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('affiche V2 par défaut pour un admin', async () => {
    renderAt('/');
    const btn = await screen.findByRole('button', { name: /Basculer vers la V3/i });
    expect(btn).toHaveTextContent('V2');
    expect(screen.getByTestId('location')).toHaveTextContent('/');
  });

  it('bascule V2 → V3 : route /hub-v3, label V3, état persistant', async () => {
    const user = userEvent.setup();
    renderAt('/');
    const btn = await screen.findByRole('button', { name: /Basculer vers la V3/i });

    await user.click(btn);

    expect(screen.getByTestId('location')).toHaveTextContent('/hub-v3');
    const btnV3 = screen.getByRole('button', { name: /Mode V3 actif/i });
    expect(btnV3).toHaveTextContent('V3');
    expect(localStorage.getItem('ebookstudio_v3_mode')).toBe('1');
  });

  it('bascule V3 → V2 depuis /v3/... : atterrit sur /ebook-planner (générateur V2)', async () => {
    localStorage.setItem('ebookstudio_v3_mode', '1');
    const user = userEvent.setup();
    renderAt('/v3/hub');

    const btn = await screen.findByRole('button', { name: /Mode V3 actif/i });
    await user.click(btn);

    expect(screen.getByTestId('location')).toHaveTextContent('/ebook-planner');
    expect(screen.getByRole('button', { name: /Basculer vers la V3/i })).toHaveTextContent('V2');
    expect(localStorage.getItem('ebookstudio_v3_mode')).toBeNull();
    expect(localStorage.getItem('ebook_planner_active_tab')).toBe('workflow-dashboard');
  });

  it('bascule V3 → V2 depuis /admin : redirige aussi vers /ebook-planner', async () => {
    localStorage.setItem('ebookstudio_v3_mode', '1');
    const user = userEvent.setup();
    renderAt('/admin');

    const btn = await screen.findByRole('button', { name: /Mode V3 actif/i });
    await user.click(btn);

    expect(screen.getByTestId('location')).toHaveTextContent('/ebook-planner');
    expect(screen.getByRole('button', { name: /Basculer vers la V3/i })).toHaveTextContent('V2');
    expect(localStorage.getItem('ebook_planner_active_tab')).toBe('workflow-dashboard');
  });

  it('ne rend rien pour un non-admin', async () => {
    const mod = await import('@/lib/adminAccess');
    (mod.getIsCurrentSessionAdmin as ReturnType<typeof vi.fn>).mockResolvedValueOnce(false);

    const { container } = renderAt('/');
    // Attendre le résolveur async
    await act(async () => {
      await Promise.resolve();
    });
    expect(container.querySelector('button')).toBeNull();
  });
});
