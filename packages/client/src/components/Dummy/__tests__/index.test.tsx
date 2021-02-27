import React from 'react';
import { render, screen } from '@testing-library/react';
import Dummy from '..';

test('renders learn react link', () => {
  render(<Dummy />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
