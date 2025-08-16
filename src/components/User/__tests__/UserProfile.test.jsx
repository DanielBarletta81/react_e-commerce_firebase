import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import UserProfile from '../UserProfile';
import * as authService from '../../../services/authService';
import * as userService from '../../../services/userService';

// Mock the services
vi.mock('../../../services/authService');
vi.mock('../../../services/userService');

// Mock CSS imports
vi.mock('../../../styles/profile.css', () => ({}));
vi.mock('../../../styles/toasts.css', () => ({}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate
}));

describe('UserProfile Component', () => {
  const mockUser = {
    uid: 'test-user-123',
    email: 'test@example.com'
  };

  const mockUserData = {
    uid: 'test-user-123',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    displayName: 'John Doe',
    phone: '555-0123',
    createdAt: {
      toDate: () => new Date('2023-01-01')
    }
  };

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
    
    // Mock getCurrentUser to return a user
    authService.getCurrentUser.mockReturnValue(mockUser);
  });

  test('redirects to login when no user is authenticated', async () => {
    // Mock no authenticated user
    authService.getCurrentUser.mockReturnValue(null);

    render(<UserProfile />);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  test('renders user profile data when loaded successfully', async () => {
    // Mock successful user data loading
    userService.getUserData.mockResolvedValue({
      success: true,
      data: mockUserData
    });

    render(<UserProfile />);

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('User Profile')).toBeInTheDocument();
    });

    // Check if user data is displayed
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('Doe')).toBeInTheDocument();
    expect(screen.getByText('555-0123')).toBeInTheDocument();
    expect(screen.getByText('12/31/2022')).toBeInTheDocument(); // Actual date shown
  });

  test('renders error message when user data loading fails', async () => {
    // Mock failed user data loading
    userService.getUserData.mockResolvedValue({
      success: false,
      error: 'Failed to load user data'
    });

    render(<UserProfile />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load user data')).toBeInTheDocument();
    });
  });

  test('enters edit mode when Edit Profile button is clicked', async () => {
    // Mock successful user data loading
    userService.getUserData.mockResolvedValue({
      success: true,
      data: mockUserData
    });

    render(<UserProfile />);

    // Wait for component to load
    await waitFor(() => {
      expect(screen.getByText('Edit Profile')).toBeInTheDocument();
    });

    // Click Edit Profile button
    fireEvent.click(screen.getByText('Edit Profile'));

    // Check if edit form is displayed
    await waitFor(() => {
      expect(screen.getByText('Update Profile')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    // Check if form fields are present
    expect(screen.getByDisplayValue('John')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('555-0123')).toBeInTheDocument();
  });

  test('updates user data when save button is clicked', async () => {
    // Mock successful user data loading
    userService.getUserData.mockResolvedValue({
      success: true,
      data: mockUserData
    });

    // Mock successful user data update
    userService.updateUserData.mockResolvedValue({
      success: true
    });

    render(<UserProfile />);

    // Wait for component to load and click Edit
    await waitFor(() => {
      expect(screen.getByText('Edit Profile')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Edit Profile'));

    // Wait for edit form to appear
    await waitFor(() => {
      expect(screen.getByText('Update Profile')).toBeInTheDocument();
    });

    // Update first name
    const firstNameInput = screen.getByDisplayValue('John');
    fireEvent.change(firstNameInput, { target: { value: 'Johnny' } });

    // Click Update Profile
    fireEvent.click(screen.getByText('Update Profile'));

    // Check if updateUserData was called
    await waitFor(() => {
      expect(userService.updateUserData).toHaveBeenCalledWith(
        'test-user-123',
        expect.objectContaining({
          firstName: 'Johnny'
        })
      );
    });
  });

  test('cancels edit mode when Cancel button is clicked', async () => {
    // Mock successful user data loading
    userService.getUserData.mockResolvedValue({
      success: true,
      data: mockUserData
    });

    render(<UserProfile />);

    // Enter edit mode
    await waitFor(() => {
      expect(screen.getByText('Edit Profile')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Edit Profile'));

    // Wait for edit form
    await waitFor(() => {
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    // Click Cancel
    fireEvent.click(screen.getByText('Cancel'));

    // Check if we're back to view mode
    await waitFor(() => {
      expect(screen.getByText('Edit Profile')).toBeInTheDocument();
      expect(screen.queryByText('Save Changes')).not.toBeInTheDocument();
    });
  });

  test('shows fallback values for missing user data', async () => {
    // Mock user data with missing fields
    const incompleteUserData = {
      uid: 'test-user-123',
      email: 'test@example.com'
      // firstName, lastName, phone, etc. are missing
    };

    userService.getUserData.mockResolvedValue({
      success: true,
      data: incompleteUserData
    });

    render(<UserProfile />);

    await waitFor(() => {
      expect(screen.getByText('User Profile')).toBeInTheDocument();
    });

    // Check if fallback values are displayed (multiple instances)
    expect(screen.getAllByText('Not provided')).toHaveLength(4); // firstName, lastName, name, phone
    expect(screen.getByText('Unknown')).toBeInTheDocument();
  });
});
