import React from 'react';
import { render } from '@testing-library/react-native';
import App from '../../App';

test('renders navigation root', () => {
  const { getByText } = render(<App />);
  expect(getByText('Home')).toBeTruthy();
});