import { render, screen } from '@testing-library/react';
import App from './App';

test('renders hi!', () => {
  render(<App />);
  const textElement = screen.getByText(/hi!/i);
  expect(textElement).toBeInTheDocument();
});
