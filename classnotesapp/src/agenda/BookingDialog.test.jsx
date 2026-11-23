import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within, waitFor } from '@testing-library/react';
import BookingDialog from './BookingDialog';

const slot = { id: '2026-11-25_15-00', date: '2026-11-25', start: '15:00', end: '15:30', modalities: ['presencial', 'virtual'] };
const me = { uid: 'yo', email: 'yo@u.icesi.edu.co' };
const groupOptions = [
  { group: { id: 'g1', name: 'Equipo 1 · Órbita', members: ['Ana Gómez'] }, booking: { bookedBy: { uid: 'otra' }, slotId: 'x' } },
  { group: { id: 'g2', name: 'Equipo 2 · Faro', members: ['Mateo Díaz', 'Valeria Cruz'] }, booking: null },
];

const mount = (props = {}) =>
  render(
    <BookingDialog
      open
      slot={slot}
      courseName="Aplicaciones Móviles"
      groupOptions={groupOptions}
      user={me}
      onClose={() => {}}
      onConfirm={vi.fn()}
      {...props}
    />,
  );

const pick = (label, option) => {
  fireEvent.mouseDown(screen.getByRole('combobox', { name: label }));
  fireEvent.click(within(screen.getByRole('listbox')).getByText(option));
};

const fillForm = () => {
  pick('¿Qué grupo son?', 'Equipo 2 · Faro');
  pick('¿Quién eres?', 'Valeria Cruz');
  fireEvent.click(screen.getByLabelText('Virtual'));
};

describe('BookingDialog', () => {
  it('deshabilita los grupos que ya reservó otra persona', () => {
    mount();
    fireEvent.mouseDown(screen.getByRole('combobox', { name: '¿Qué grupo son?' }));
    const taken = within(screen.getByRole('listbox')).getByText(/Órbita/).closest('li');
    expect(taken.getAttribute('aria-disabled')).toBe('true');
    expect(taken.textContent).toContain('ya tiene fecha');
  });

  it('con una reserva propia, solo deja escoger ese mismo grupo', () => {
    mount({ lockedGroupId: 'g1', groupOptions: [
      { group: groupOptions[0].group, booking: { bookedBy: { uid: 'yo' }, slotId: 'x' } },
      groupOptions[1],
    ] });
    fireEvent.mouseDown(screen.getByRole('combobox', { name: '¿Qué grupo son?' }));
    const list = within(screen.getByRole('listbox'));
    const other = list.getByText(/Faro/).closest('li');
    expect(other.getAttribute('aria-disabled')).toBe('true');
    expect(other.textContent).toContain('ya reservaste para otro grupo');
    expect(list.getByText(/Órbita/).closest('li').getAttribute('aria-disabled')).not.toBe('true');
  });

  it('solo deja revisar con grupo, persona y modalidad', () => {
    mount();
    const review = screen.getByRole('button', { name: 'Revisar' });
    expect(review.disabled).toBe(true);
    pick('¿Qué grupo son?', 'Equipo 2 · Faro');
    pick('¿Quién eres?', 'Valeria Cruz');
    expect(review.disabled).toBe(true);
    fireEvent.click(screen.getByLabelText('Virtual'));
    expect(review.disabled).toBe(false);
  });

  it('muestra el resumen y confirma con lo escogido', async () => {
    const onConfirm = vi.fn().mockResolvedValue(undefined);
    mount({ onConfirm });
    fillForm();
    fireEvent.click(screen.getByRole('button', { name: 'Revisar' }));

    expect(screen.getByText('Resumen de la reserva')).toBeTruthy();
    expect(screen.getByText('Aplicaciones Móviles')).toBeTruthy();
    expect(screen.getByText('Mateo Díaz')).toBeTruthy();
    expect(screen.getByText('15:00 – 15:30')).toBeTruthy();
    expect(screen.getByText('Virtual')).toBeTruthy();
    expect(screen.getByText('yo@u.icesi.edu.co')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Confirmar reserva' }));
    await waitFor(() => expect(onConfirm).toHaveBeenCalledTimes(1));
    expect(onConfirm.mock.calls[0][0]).toMatchObject({
      group: { id: 'g2' },
      bookerName: 'Valeria Cruz',
      modality: 'virtual',
    });
  });

  it('muestra el error si la reserva falla y deja volver a intentar', async () => {
    const onConfirm = vi.fn().mockRejectedValue(Object.assign(new Error('x'), { friendly: 'Otra persona acaba de tomar esa franja.' }));
    mount({ onConfirm });
    fillForm();
    fireEvent.click(screen.getByRole('button', { name: 'Revisar' }));
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar reserva' }));
    expect(await screen.findByText('Otra persona acaba de tomar esa franja.')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Confirmar reserva' }).disabled).toBe(false);
  });
});
