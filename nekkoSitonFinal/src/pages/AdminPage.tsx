import React, { useState, useEffect, useMemo } from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import supabase from '../utils/supabase';
import '../styles/AdminPage.css';
import { LayoutDashboard, BookCheck, Calendar, DollarSign, Users, Clock, CheckCircle, UserCheck, ChevronLeft, ChevronRight, X } from 'lucide-react';

// Types
interface Booking {
  id: number;
  booking_date: string;
  status: string;
  message: string;
  payment_proof_url: string | null;
  created_at: string;
  service_id: number;
  user_id: string;
  services: {
    name: string;
    price?: number;
  };
  profiles: {
    full_name: string;
    email: string;
    phone_number: string;
  };
}

interface AdminRequest {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  status: string;
  created_at: string;
}

const localizer = momentLocalizer(moment);

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [adminRequests, setAdminRequests] = useState<AdminRequest[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [bookingsFilter, setBookingsFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const servicePriceMap: { [key: string]: number } = {
    "Package A": 20000,
    "Package B": 30000,
    "Package C": 45000,
    "Concept Shoot": 6000,
    "Classic Portrait": 6000,
  };


  useEffect(() => {
    const checkAdminStatusAndFetchData = async () => {
      setLoading(true);
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        setError('Error fetching session.');
        setLoading(false);
        return;
      }

      if (!session) {
        setError('You must be logged in to view this page.');
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      const user = session.user;
      if (!user) {
        setError('User not found.');
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profileError || !profile) {
        setError('Could not fetch user profile.');
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      if (profile.role !== 'admin') {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      setIsAdmin(true);

      const { data: bookingsData, error: bookingsError } = await supabase.rpc('get_all_bookings_for_admin');

      if (bookingsError) {
        console.error('Error fetching bookings:', bookingsError);
        setError('Could not load booking data.');
      } else {
        const formattedBookings: Booking[] = bookingsData.map((b: any) => {
          const price = servicePriceMap[b.service_name] || 0;

          return {
            id: b.id,
            booking_date: b.booking_date,
            status: b.status,
            message: b.message,
            payment_proof_url: b.payment_proof_url,
            created_at: b.created_at,
            service_id: b.service_id,
            user_id: b.user_id,
            services: { name: b.service_name, price: price },
            profiles: {
              full_name: b.user_full_name,
              email: b.user_email,
              phone_number: b.user_phone_number,
            },
          };
        });
        setBookings(formattedBookings);
      }

      const { data: adminRequestsData, error: adminRequestsError } = await supabase
        .from('admin_requests')
        .select('*');

      if (adminRequestsError) {
        console.error('Error fetching admin requests:', adminRequestsError);
        setError(prev => prev ? `${prev} and could not load admin requests.` : 'Could not load admin requests.');
      } else {
        setAdminRequests(adminRequestsData as AdminRequest[]);
      }

      setLoading(false);
    };

    checkAdminStatusAndFetchData();
  }, []);

  const filteredBookings = useMemo(() => {
    return bookings
      .filter(booking => {
        if (bookingsFilter === 'all') return true;
        return booking.status === bookingsFilter;
      })
      .filter(booking => {
        const searchTermLower = searchTerm.toLowerCase();
        return (
          booking.profiles.full_name.toLowerCase().includes(searchTermLower) ||
          booking.profiles.email.toLowerCase().includes(searchTermLower) ||
          booking.services.name.toLowerCase().includes(searchTermLower)
        );
      });
  }, [bookings, bookingsFilter, searchTerm]);

  const { totalEarnings, totalClients, pendingBookingsCount, confirmedBookingsCount } = useMemo(() => {
    return {
        totalEarnings: bookings.filter(b => b.status === 'completed' && b.services.price).reduce((acc, b) => acc + (b.services.price || 0), 0),
        totalClients: new Set(bookings.map(b => b.user_id)).size,
        pendingBookingsCount: bookings.filter(b => b.status === 'pending').length,
        confirmedBookingsCount: bookings.filter(b => b.status === 'approved').length,
    };
  }, [bookings]);

  const updateBookingStatus = async (id: number, status: string) => {
    const { data, error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating booking status:', error);
    } else if (data) {
      setBookings(prev => prev.map(b => (b.id === id ? { ...b, status: data.status } : b)));
      if (selectedBooking && selectedBooking.id === id) {
        setSelectedBooking({ ...selectedBooking, status: data.status });
      }
    }
  };

  const handleAdminRequestAction = async (requestId: string, newStatus: 'approved' | 'rejected') => {
    const { error } = await supabase.rpc('handle_admin_request', {
      p_request_id: requestId,
      p_new_status: newStatus,
    });

    if (error) {
      console.error(`Error handling admin request:`, error);
      alert(`Error: ${error.message}`); // Optional: show an error to the user
    } else {
      // Request was processed, remove it from the pending list in the UI
      setAdminRequests(prev => prev.filter(r => r.id !== requestId));
      alert(`Request has been ${newStatus}.`); // Optional: show success message
    }
  };

    const bookingsByDate = useMemo(() => {
        const map = new Map<string, Booking[]>();
        bookings.forEach(booking => {
            const date = moment(booking.booking_date).startOf('day').toDate().toDateString();
            if (!map.has(date)) {
                map.set(date, []);
            }
            map.get(date)!.push(booking);
        });
        return map;
    }, [bookings]);

  const renderCalendarDays = () => {
    const monthStart = moment(currentDate).startOf('month');
    const monthEnd = moment(currentDate).endOf('month');
    const startDate = moment(monthStart).startOf('week');
    const endDate = moment(monthEnd).endOf('week');
    const days = [];
    let day = startDate.clone();

    while (day.isBefore(endDate, 'day')) {
      const dateStr = day.toDate().toDateString();
      const isToday = day.isSame(new Date(), 'day');
      const isSelected = selectedDate && day.isSame(selectedDate, 'day');
      const dailyBookings = bookingsByDate.get(dateStr);
      const bookingCount = dailyBookings?.length || 0;

      days.push(
        <div
          key={day.toString()}
          className={`calendar-day ${!day.isSame(monthStart, 'month') ? 'empty' : ''} ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
          onClick={() => {
              if (day.isSame(monthStart, 'month')) {
                setSelectedDate(day.toDate());
              }
          }}
        >
          <span>{day.format('D')}</span>
          {bookingCount > 0 && <div className="booking-indicator">{bookingCount}</div>}
        </div>
      );
      day.add(1, 'day');
    }
    return days;
  };


  if (loading) {
    return (
      <div className="admin-loading-container">
        <div className="admin-loading-spinner"></div>
        <p>Loading Admin Dashboard...</p>
      </div>
    );
  }

  if (isAdmin === false) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        <p>{error || "You do not have permission to view this page."}</p>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h2>NEKKO ADMIN</h2>
        </div>
        <nav className="admin-nav">
          <a onClick={() => setActiveTab("dashboard")} className={activeTab === "dashboard" ? "active" : ""}>
            <LayoutDashboard size={20} /><span>Dashboard</span>
          </a>
          <a onClick={() => setActiveTab("bookings")} className={activeTab === "bookings" ? "active" : ""}>
            <BookCheck size={20} /><span>Bookings</span>
          </a>
          <a onClick={() => setActiveTab("calendar")} className={activeTab === "calendar" ? "active" : ""}>
            <Calendar size={20} /><span>Calendar</span>
          </a>
        </nav>
      </aside>

      <main className="admin-main-content">
        {activeTab === "dashboard" && (
          <div className="tab-content">
            <h1 className="tab-title">Dashboard</h1>
            <div className="stats-grid">
              <div className="stat-card"><DollarSign /><p>Total Earnings</p><span>₱{totalEarnings.toLocaleString()}</span></div>
              <div className="stat-card"><Users /><p>Total Clients</p><span>{totalClients}</span></div>
              <div className="stat-card"><Clock /><p>Pending Bookings</p><span>{pendingBookingsCount}</span></div>
              <div className="stat-card"><CheckCircle /><p>Confirmed Bookings</p><span>{confirmedBookingsCount}</span></div>
            </div>
            <div className="admin-requests-section">
              {/* <h2 className="section-title">Admin Registration Requests</h2> */}
              <h2 className="section-title"></h2>
              <div className="requests-list">
                {adminRequests.filter(r => r.status === 'pending').map(req => (
                  <div key={req.id} className="request-item">
                    <p><UserCheck size={16} /> {req.email}</p>
                    <div className="request-actions">
                      <button className="approve" onClick={() => handleAdminRequestAction(req.id, "approved")}>Approve</button>
                      <button className="reject" onClick={() => handleAdminRequestAction(req.id, "rejected")}>Reject</button>
                    </div>
                  </div>
                ))}
                {adminRequests.filter(r => r.status === 'pending').length === 0 && <p></p>}
                {/* {adminRequests.filter(r => r.status === 'pending').length === 0 && <p>No pending admin requests.</p>} */}
              </div>
            </div>
          </div>
        )}

        {activeTab === "bookings" && (
          <div className="tab-content">
            <h1 className="tab-title">Manage Bookings</h1>
            <div className="filters">
              {(["all", "pending", "approved", "completed", "cancelled"] as const).map(f => (
                <button key={f} onClick={() => setBookingsFilter(f)} className={bookingsFilter === f ? "active" : ""}>{f}</button>
              ))}
            </div>
            <div className="bookings-table">
              <div className="table-header">
                <span>Client</span><span>Service</span><span>Date</span><span>Status</span><span>Action</span>
              </div>
              {filteredBookings.map(b => (
                <div key={b.id} className="table-row">
                  <span>{b.profiles.full_name}</span>
                  <span>{b.services.name}</span>
                  <span>{moment(b.booking_date).format('LLL')}</span>
                  <span><span className={`status-badge ${b.status}`}>{b.status}</span></span>
                  <span><button className="details-btn" onClick={() => setSelectedBooking(b)}>View</button></span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "calendar" && (
          <div className="tab-content">
            <h1 className="tab-title">Booking Calendar</h1>
            <div className="calendar-container">
              <div className="calendar-header">
                <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}><ChevronLeft /></button>
                <h2>{currentDate.toLocaleString("default", { month: "long", year: "numeric" })}</h2>
                <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}><ChevronRight /></button>
                <button className="today-btn" onClick={() => setCurrentDate(new Date())}>Today</button>
              </div>
              <div className="calendar-grid">{renderCalendarDays()}</div>
            </div>
            {selectedDate && (
              <div className="daily-bookings">
                <h3 className="section-title">Bookings for {selectedDate.toLocaleDateString()}</h3>
                {bookingsByDate.get(selectedDate.toDateString())?.map(b => (
                  <div key={b.id} className="daily-booking-item" onClick={() => setSelectedBooking(b)}>
                    <p>{b.services.name} - {b.profiles.full_name}</p>
                    <span className={`status-badge ${b.status}`}>{b.status}</span>
                  </div>
                )) ?? <p>No bookings for this day.</p>}
              </div>
            )}
          </div>
        )}
      </main>

      {selectedBooking && (
        <div className="modal-overlay" onClick={() => setSelectedBooking(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Booking Details</h3>
              <button onClick={() => setSelectedBooking(null)} className="close-btn"><X size={24} /></button>
            </div>
            <div className="modal-body">
              <p><strong>Client:</strong> {selectedBooking.profiles.full_name}</p>
              <p><strong>Email:</strong> {selectedBooking.profiles.email}</p>
              <p><strong>Service:</strong> {selectedBooking.services.name}</p>
              <p><strong>Date:</strong> {moment(selectedBooking.booking_date).format('LLL')}</p>
              <p><strong>Amount:</strong> ₱{(selectedBooking.services.price || 0).toLocaleString()}</p>
              <p><strong>Status:</strong> <span className={`status-badge ${selectedBooking.status}`}>{selectedBooking.status}</span></p>
              {selectedBooking.payment_proof_url &&
                <div className="payment-proof">
                  <strong>Payment Proof:</strong>
                  <img src={selectedBooking.payment_proof_url} alt="Payment Proof" />
                </div>
              }
            </div>
            <div className="modal-footer">
              {selectedBooking.status === "pending" && (
                <button className="action-btn confirm" onClick={() => updateBookingStatus(selectedBooking.id, "approved")}>Confirm Booking</button>
              )}
              {selectedBooking.status === "approved" && (
                <button className="action-btn complete" onClick={() => updateBookingStatus(selectedBooking.id, "completed")}>Mark as Completed</button>
              )}
              <button className="action-btn cancel" onClick={() => updateBookingStatus(selectedBooking.id, "cancelled")}>Cancel Booking</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;