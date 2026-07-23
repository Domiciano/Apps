import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, useThemeMode } from './ThemeContext';

const Consumer = () => {
  const { mode, toggleTheme, theme } = useThemeMode();
  return (
    <div>
      <span data-testid="mode">{mode}</span>
      <span data-testid="bg">{theme.background}</span>
      <button onClick={toggleTheme}>toggle</button>
    </div>
  );
};

const renderWithProvider = () =>
  render(<ThemeProvider><Consumer /></ThemeProvider>);

describe('ThemeContext', () => {
  it('starts in dark mode by default', () => {
    renderWithProvider();
    expect(screen.getByTestId('mode').textContent).toBe('dark');
  });

  it('provides the dark background token in dark mode', () => {
    renderWithProvider();
    expect(screen.getByTestId('bg').textContent).toBe('#181C23');
  });

  it('toggleTheme switches from dark to light', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('toggle'));
    expect(screen.getByTestId('mode').textContent).toBe('light');
  });

  it('provides the light background token after toggle', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('toggle'));
    expect(screen.getByTestId('bg').textContent).toBe('#F5F7FA');
  });

  it('toggleTheme switches back to dark on second click', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('toggle'));
    fireEvent.click(screen.getByText('toggle'));
    expect(screen.getByTestId('mode').textContent).toBe('dark');
  });

  it('adds the current mode as a class on document.body', () => {
    renderWithProvider();
    expect(document.body.classList.contains('dark')).toBe(true);
  });

  it('updates body class to light after toggle', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('toggle'));
    expect(document.body.classList.contains('light')).toBe(true);
    expect(document.body.classList.contains('dark')).toBe(false);
  });
});
