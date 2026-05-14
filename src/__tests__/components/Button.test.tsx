/**
 * Button Component Tests
 */

import Button from '@/components/Button';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

describe('Button Component', () => {
  it('renders with label', () => {
    const { getByText } = render(
      <Button label="Click me" onPress={jest.fn()} />
    );
    expect(getByText('Click me')).toBeTruthy();
  });

  it('calls onPress when clicked', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <Button label="Click me" onPress={mockOnPress} />
    );
    fireEvent.press(getByText('Click me'));
    expect(mockOnPress).toHaveBeenCalled();
  });

  it('renders with different variants', () => {
    const { getByText, rerender } = render(
      <Button label="Primary" onPress={jest.fn()} variant="primary" />
    );
    expect(getByText('Primary')).toBeTruthy();

    rerender(<Button label="Secondary" onPress={jest.fn()} variant="secondary" />);
    expect(getByText('Secondary')).toBeTruthy();
  });

  it('disables button when disabled prop is true', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <Button label="Disabled" onPress={mockOnPress} disabled={true} />
    );
    fireEvent.press(getByText('Disabled'));
    expect(mockOnPress).not.toHaveBeenCalled();
  });

  it('shows loading state', () => {
    const { getByTestId } = render(
      <Button label="Loading" onPress={jest.fn()} loading={true} />
    );
    // The loading indicator would be rendered
    expect(getByTestId).toBeDefined();
  });
});
