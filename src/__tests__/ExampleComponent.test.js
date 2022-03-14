import React from 'react';
import { ExampleComponent } from '../examples/ExampleComponent';
import { render, fireEvent, screen } from '@testing-library/react';

// Test a component.

test("Test clicking ExampleComponent's buttons", () => {
  render(<ExampleComponent />);
  // Check that span with default value exists.
  expect(screen.queryByText(/Value is 100/i)).toBeInTheDocument();
  // Get buttons
  const addButton = screen.getByText('add');
  const removeButton = screen.getByText('remove');
  // Test click on add button
  fireEvent.click(addButton);
  expect(screen.queryByText(/Value is 100/i)).toBeNull();
  expect(screen.queryByText(/Value is 101/i)).toBeInTheDocument();
  // Test another click on add button
  fireEvent.click(addButton);
  expect(screen.queryByText(/Value is 100/i)).toBeNull();
  expect(screen.queryByText(/Value is 101/i)).toBeNull();
  expect(screen.queryByText(/Value is 102/i)).toBeInTheDocument();
  // Test click on remove button
  fireEvent.click(removeButton);
  fireEvent.click(removeButton);
  fireEvent.click(removeButton);
  fireEvent.click(removeButton);
  fireEvent.click(removeButton);
  expect(screen.queryByText(/Value is 97/i)).toBeInTheDocument();
});
