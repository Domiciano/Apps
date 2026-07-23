import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { StudiedLessonsProvider, useStudiedLessons } from './StudiedLessonsContext';

// Helper component that exposes the context values through the DOM
const Consumer = () => {
  const { studiedLessons, toggleStudied } = useStudiedLessons();
  return (
    <div>
      <span data-testid="count">{studiedLessons.length}</span>
      <span data-testid="ids">{studiedLessons.join(',')}</span>
      <button onClick={() => toggleStudied('1')}>toggle 1</button>
      <button onClick={() => toggleStudied('2')}>toggle 2</button>
    </div>
  );
};

const renderWithProvider = (initialStorage = null) => {
  if (initialStorage) {
    localStorage.setItem('studiedLessons', JSON.stringify(initialStorage));
  }
  return render(
    <StudiedLessonsProvider>
      <Consumer />
    </StudiedLessonsProvider>
  );
};

describe('StudiedLessonsContext', () => {
  it('starts with an empty list when localStorage is empty', () => {
    renderWithProvider();
    expect(screen.getByTestId('count').textContent).toBe('0');
  });

  it('loads initial state from localStorage', () => {
    renderWithProvider(['3', '7']);
    expect(screen.getByTestId('ids').textContent).toBe('3,7');
  });

  it('toggleStudied adds a lesson that is not yet studied', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('toggle 1'));
    expect(screen.getByTestId('ids').textContent).toContain('1');
  });

  it('toggleStudied removes a lesson that is already studied', () => {
    renderWithProvider(['1']);
    fireEvent.click(screen.getByText('toggle 1'));
    expect(screen.getByTestId('ids').textContent).not.toContain('1');
  });

  it('can mark two different lessons independently', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('toggle 1'));
    fireEvent.click(screen.getByText('toggle 2'));
    expect(screen.getByTestId('count').textContent).toBe('2');
  });

  it('toggleStudied is idempotent: toggling twice returns to original state', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('toggle 1'));
    fireEvent.click(screen.getByText('toggle 1'));
    expect(screen.getByTestId('count').textContent).toBe('0');
  });

  it('persists changes to localStorage after toggle', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('toggle 1'));
    const stored = JSON.parse(localStorage.getItem('studiedLessons'));
    expect(stored).toContain('1');
  });

  it('handles malformed localStorage gracefully (starts empty)', () => {
    localStorage.setItem('studiedLessons', 'INVALID JSON!!!');
    renderWithProvider();
    expect(screen.getByTestId('count').textContent).toBe('0');
  });
});
