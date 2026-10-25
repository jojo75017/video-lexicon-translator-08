import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import AdsProfitSimulator from './AdsProfitSimulator';

describe('Ads simulation entered assumptions', () => {
  it('updates the theoretical net after entering real user assumptions', () => {
    render(<AdsProfitSimulator daily={15} />);
    fireEvent.change(screen.getByLabelText('Coût par clic supposé (€)'), { target: { value: '0.3' } });
    fireEvent.change(screen.getByLabelText('Achats par clic supposés (%)'), { target: { value: '5' } });
    fireEvent.change(screen.getByLabelText('Gain KDP par exemplaire (€)'), { target: { value: '5.21' } });
    expect(screen.getByText(/-59,25/)).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Gain KDP par exemplaire (€)'), { target: { value: '6' } });
    expect(screen.queryByText(/-59,25/)).not.toBeInTheDocument();
    expect(screen.getByText('450,00 €')).toBeInTheDocument();
  });
});