# FilterMenu Component Test Suite

This test suite provides comprehensive coverage for the `FilterMenu` component, which is used to filter recipes by categories, cuisine, and number of servings.

## Test Structure

### Test Categories

1. **Rendering Tests**
   - Validates that the component renders with the correct title, filter categories, and UI elements
   - Tests custom title and button text rendering
   - Verifies all filter categories from `clearedFilters` are displayed

2. **Button Actions Tests**
   - Tests the apply button behavior for both existing recipes and new recipe creation
   - Verifies the clear button functionality for different contexts
   - Ensures proper handler functions are called based on the `newRecipe` prop

3. **Filter Toggle Functionality**
   - Tests that filter switches/toggles are rendered properly
   - Validates the presence of expected filter elements

4. **Picker Functionality**
   - Tests that cuisine and serves pickers are rendered
   - Validates the component structure for picker elements

5. **Filter Display and Formatting**
   - Tests proper capitalization and formatting of filter names
   - Verifies that spaces and special characters are handled correctly

6. **Switch Values**
   - Tests that filter settings are properly reflected in the UI
   - Validates component behavior with different filter configurations

7. **Accessibility Tests**
   - Ensures proper font scaling with `maxFontSizeMultiplier`
   - Validates accessibility features are in place

8. **Edge Cases**
   - Tests handling of null/empty cuisine options
   - Validates graceful handling of undefined optional props
   - Ensures component doesn't crash with edge case inputs

9. **Component Lifecycle**
   - Tests proper handling of async operations
   - Validates that async handlers complete correctly

## Mocking Strategy

The test suite uses simple mocks for external dependencies:

- **`react-native-vector-icons`**: Mocked as simple "Icon" string components
- **`react-native-responsive-dimensions`**: Mocked to return fixed values
- **`DualOSPicker`**: Mocked as "MockDualOSPicker" component
- **`SwitchSized`**: Mocked as "MockSwitchSized" component

## Coverage

The test suite achieves good coverage of the FilterMenu component logic:

- Component rendering with various prop combinations
- Event handling and function calls
- State management behaviors
- Error boundary conditions
- Accessibility requirements

## Running the Tests

```bash
npm test -- src/components/filterMenu/filterMenu.test.tsx
```

## Notes

- The tests focus on behavior rather than implementation details
- Mocking is kept simple to avoid Jest factory restrictions
- Tests verify that the correct handler functions are called rather than testing internal component state
- The test suite is designed to be maintainable and easy to understand
