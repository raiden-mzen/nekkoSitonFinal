import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../utils/supabase';
import '../styles/ProfilePage.css';
import { Edit2, Save, X } from 'lucide-react';

interface Booking {
  id: number;
  booking_date: string;
  status: string;
  payment_proof_url: string | null;
  services: {
    name:string;
  };
}

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [editedProfile, setEditedProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
        } else {
          setProfile(profileData);
          setEditedProfile(profileData);
        }

        const { data: bookingsData, error: bookingsError } = await supabase
          .from('bookings')
          .select(`
            id,
            booking_date,
            status,
            payment_proof_url,
            services ( name )
          `)
          .eq('user_id', user.id);

        if (bookingsError) {
          console.error('Error fetching bookings:', bookingsError);
        } else if (bookingsData) {
          setBookings(bookingsData as any[] as Booking[]);
        }
      } else {
        navigate('/login');
      }
      setLoading(false);
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const handleAvatarUpload = async (file: File) => {
    if (!file || !user) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      console.error('Error uploading avatar:', uploadError);
      alert('Failed to upload avatar.');
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrlData.publicUrl, updated_at: new Date().toISOString() })
      .eq('id', user.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating avatar url:', updateError);
      alert('Failed to update profile with new avatar.');
    } else if (updateError === null && updateError) {
        setProfile(updateError);
        setEditedProfile(updateError);
        alert('Avatar updated successfully.');
    }
  };

  const handlePaymentUpload = async (bookingId: number, file: File) => {
    if (!file || !user) return;

    const { data, error } = await supabase.storage
      .from('payment-proofs')
      .upload(`${user.id}/${bookingId}-${file.name}`, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      console.error('Error uploading payment proof:', error);
      alert('Failed to upload payment proof.');
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from('payment-proofs')
      .getPublicUrl(data.path);

    const { error: updateError } = await supabase
      .from('bookings')
      .update({ payment_proof_url: publicUrlData.publicUrl, status: 'pending_confirmation' })
      .eq('id', bookingId);

    if (updateError) {
      console.error('Error updating booking:', updateError);
      alert('Failed to update booking with payment proof.');
    } else {
      setBookings(bookings.map(b => b.id === bookingId ? { ...b, payment_proof_url: publicUrlData.publicUrl, status: 'pending_confirmation' } : b));
      alert('Payment proof uploaded successfully. Please wait for admin confirmation.');
    }
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSave = async () => {
    if (!user) return;
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: editedProfile.full_name,
        phone_number: editedProfile.phone_number,
      })
      .eq('id', user.id);

    if (error) {
      console.error('Error updating profile:', error);
    } else {
      setProfile(editedProfile);
      setEditMode(false);
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setEditMode(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedProfile({ ...editedProfile, [name]: value });
  };

  if (loading || !profile) {
    return (
      <div className="profile-loading-container">
        <div className="profile-loading-spinner"></div>
        <p>Loading Profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <aside className="profile-sidebar">
        <div className="profile-header">
            <div className="profile-picture-container">
                <img
                    src={profile.avatar_url || `https://api.dicebear.com/6.x/initials/svg?seed=${profile.full_name}`}
                    alt="Profile"
                    className="profile-picture"
                />
                <label htmlFor="avatar-upload" className="profile-picture-edit">
                    <Edit2 size={20} />
                </label>
                <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                        handleAvatarUpload(e.target.files[0]);
                        }
                    }}
                />
            </div>
          <h2>{profile.full_name}</h2>
          <p>{profile.email}</p>
        </div>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </aside>

      <main className="profile-main-content">
        <div className="profile-section">
          <h3>
            Personal Information
            {!editMode && (
              <button onClick={handleEdit} className="edit-btn" title="Edit Profile">
                <Edit2 size={20} />
              </button>
            )}
          </h3>
          <div className="info-item">
            <strong>Name:</strong>
            {editMode ? (
              <input type="text" name="full_name" value={editedProfile.full_name || ''} onChange={handleChange} />
            ) : (
              <span>{profile.full_name}</span>
            )}
          </div>
          <div className="info-item">
            <strong>Email:</strong>
            <span>{profile.email}</span>
          </div>
          <div className="info-item">
            <strong>Contact:</strong>
            {editMode ? (
              <input type="text" name="phone_number" value={editedProfile.phone_number || ''} onChange={handleChange} />
            ) : (
              <span>{profile.phone_number}</span>
            )}
          </div>
          {editMode && (
            <div className="edit-controls">
              <button onClick={handleSave} className="save-btn"><Save size={18} /> Save</button>
              <button onClick={handleCancel} className="cancel-btn"><X size={18} /> Cancel</button>
            </div>
          )}
        </div>

        <div className="profile-section">
          <h3>Booking History</h3>
          <p>You have {bookings.length} bookings in total.</p>

          <div className="booking-list">
            {bookings.map((booking) => (
              <div key={booking.id} className={`booking-item status-${booking.status.toLowerCase()}`}>
                <div className="booking-details">
                  <h4>{booking.services?.name || 'Service not found'}</h4>
                  <p>Date: {new Date(booking.booking_date).toLocaleDateString()}</p>
                  <p>Status: <span className="booking-status">{booking.status.replace('_', ' ')}</span></p>
                </div>

                {booking.status === 'approved' && !booking.payment_proof_url && (
                  <div className="payment-upload">
                    <p>Your booking is approved! Please upload proof of payment.</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files && handlePaymentUpload(booking.id, e.target.files[0])}
                    />
                  </div>
                )}

                {booking.status === 'pending_confirmation' && <p>Waiting for payment confirmation.</p>}
                {booking.status === 'confirmed' && <p>Payment confirmed! Your booking is all set.</p>}

                {booking.payment_proof_url && (
                  <div className="payment-proof">
                    <p>Your submitted payment proof:</p>
                    <a href={booking.payment_proof_url} target="_blank" rel="noopener noreferrer">
                        <img src={booking.payment_proof_url} alt="Payment Proof" />
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;