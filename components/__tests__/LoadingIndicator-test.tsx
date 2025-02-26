import React from 'react';
import { render } from '@testing-library/react-native';
import { LoadingIndicator } from '../LoadingIndicator';
import { COLORS } from '@/constants/Colors';

describe('<LoadingIndicator />', () => {
  test('renders correctly', () => {
    const { getByTestId } = render(<LoadingIndicator />);
    
    // Check if ActivityIndicator is present
    const activityIndicator = getByTestId('loading-indicator');
    expect(activityIndicator).toBeTruthy();
  });

  test('matches snapshot', () => {
    const tree = render(<LoadingIndicator />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('has correct styling', () => {
    const { getByTestId } = render(<LoadingIndicator />);
    
    // Get the container view
    const container = getByTestId('loading-container');
    
    // Check if the container has the correct styles
    expect(container.props.style).toMatchObject({
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      zIndex: 100,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.25)',
    });
  });

  test('ActivityIndicator has correct props', () => {
    const { getByTestId } = render(<LoadingIndicator />);
    
    // Get the ActivityIndicator
    const activityIndicator = getByTestId('loading-indicator');
    
    // Check if it has the correct size and color
    expect(activityIndicator.props.size).toBe('large');
    expect(activityIndicator.props.color).toBe(COLORS.primary);
  });
});