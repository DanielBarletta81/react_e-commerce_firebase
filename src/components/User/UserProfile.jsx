import React, { useState, useEffect } from 'react';
import { getCurrentUser } from '../../services/authService';
import { getUserData, updateUserData, deleteUserAccount } from '../../services/userService';
import { useNavigate } from 'react-router-dom';
import '../../styles/profile.css';
import '../../styles/toasts.css';

const UserProfile = () => {
  const [userData, setUserData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const user = getCurrentUser();
    if (!user) {
      navigate('/login');
      return;
    }

    const result = await getUserData(user.uid);
    if (result.success) {
      console.log('👤 User data loaded:', result.data);
      setUserData(result.data);
      setFormData(result.data);
    } else {
      console.error('❌ Failed to load user data:', result.error);
      setError(result.error);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError('');
    setSuccess('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(userData);
    setError('');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const user = getCurrentUser();
    const result = await updateUserData(user.uid, formData);
    
    if (result.success) {
      setUserData(formData);
      setIsEditing(false);
      setSuccess('Profile updated successfully!');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );
    
    if (!confirmDelete) return;

    const user = getCurrentUser();
    const result = await deleteUserAccount(user.uid);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="user-profile">
      <div className="profile-container">
        <div className="profile-header">
          <h2>User Profile</h2>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        {!isEditing ? (
          <div className="profile-view">
            <div className="profile-info">
              <div className="profile-field">
                <strong>Name:</strong>
                <span>{userData.displayName || `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || 'Not provided'}</span>
              </div>
              <div className="profile-field">
                <strong>Email:</strong>
                <span>{userData.email || 'Not provided'}</span>
              </div>
              <div className="profile-field">
                <strong>First Name:</strong>
                <span>{userData.firstName || 'Not provided'}</span>
              </div>
              <div className="profile-field">
                <strong>Last Name:</strong>
                <span>{userData.lastName || 'Not provided'}</span>
              </div>
              <div className="profile-field">
                <strong>Phone:</strong>
                <span>{userData.phone || 'Not provided'}</span>
              </div>
              <div className="profile-field">
                <strong>Member since:</strong>
                <span>{userData.createdAt?.toDate?.()?.toLocaleDateString() || 'Unknown'}</span>
              </div>
            </div>
            
            <div className="profile-actions">
              <button onClick={handleEdit} className="edit-btn">
                Edit Profile
              </button>
              <button onClick={handleDelete} className="cancel-btn">
                Delete Account
              </button>
            </div>
          </div>
        ) : (
          <div className="profile-edit">
            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label htmlFor="firstName">First Name:</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName || ''}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="lastName">Last Name:</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName || ''}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">Phone:</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-actions">
                <button type="submit" disabled={loading}>
                  {loading ? 'Updating...' : 'Update Profile'}
                </button>
                <button type="button" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
