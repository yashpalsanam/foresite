import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import FormInput from '../components/forms/FormInput';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';

const Settings = () => {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await updateProfile(profileData);
    
    if (result.success) {
      toast.success('Profile updated successfully');
    }
    
    setLoading(false);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage your account settings
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 max-w-2xl">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Profile Information
        </h2>

        <form onSubmit={handleSubmit}>
          <FormInput
            label="Name"
            name="name"
            value={profileData.name}
            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
          />

          <FormInput
            label="Email"
            name="email"
            type="email"
            value={profileData.email}
            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
            disabled
          />

          <FormInput
            label="Phone"
            name="phone"
            value={profileData.phone}
            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
          />

          <Button type="submit" variant="primary" loading={loading}>
            Update Profile
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
