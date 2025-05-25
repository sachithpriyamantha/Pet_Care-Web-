import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalEmergencyRequest: 0,
    totalClients: 0,
    totalCaregiverBookings: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        const [bookingsRes, emergenciesRes, caregiverBookingsRes] =
          await Promise.all([
            axios.get("http://localhost:5000/api/bookings", {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get("/api/emergency", {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get("/api/caregiver-bookings/admin", {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);

        setStats({
          totalBookings: bookingsRes.data.length,
          totalEmergencyRequest: emergenciesRes.data.length,
          totalPayment: 0,
          totalCaregiverBookings: caregiverBookingsRes.data.length,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setStats({
          totalBookings: 0,
          totalEmergencyRequest: 0,
          totalPayment: 0,
          totalCaregiverBookings: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 font-sans">
      {/* Header */}
      {/* <header className="bg-tranparent shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-white font-medium">
              Welcome, {user?.username || "Admin"}
            </span>
            <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center">
              <span className="text-blue-600 font-semibold text-lg">
                {user?.username?.charAt(0).toUpperCase() || "A"}
              </span>
            </div>
          </div>
        </div>
      </header> */}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <StatCard
            title="Total Bookings"
            value={stats.totalBookings}
            icon={
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            }
            color="indigo"
          />
          <StatCard
            title="Caregiver Bookings"
            value={stats.totalCaregiverBookings}
            icon={
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            }
            color="blue"
          />
          <StatCard
            title="Emergency Requests"
            value={stats.totalEmergencyRequest}
            icon={
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            }
            color="red"
          />
        </div>

        {/* Quick Actions */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <ActionCard
            title="Grooming Bookings"
            description="View and manage all client bookings"
            link="/admin/bookings"
            icon={
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            }
            color="indigo"
          />
          <ActionCard
            title="Emergency Requests"
            description="View and manage emergency requests from clients"
            link="/admin/emergencies"
            icon={
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            }
            color="red"
          />
          <ActionCard
            title="Add Caregiver"
            description="Add a new caregiver to the system"
            link="/admin/caregiverform"
            icon={
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
            }
            color="green"
          />
          <ActionCard
            title="Caregiver Bookings"
            description="View caregiver bookings"
            link="/admin/caregivebooking"
            icon={
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            }
            color="blue"
          />
          <ActionCard
            title="Add Trainers"
            description="Add a new trainer to the system"
            link="/admin/trainingadmin"
            icon={
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            }
            color="purple"
          />
          <ActionCard
            title="Add Pregnant Pets"
            description="Add a new pregnant pet to the system"
            link="/admin/pregnancyadmin"
            icon={
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            }
            color="pink"
          />
          <ActionCard
            title="Products"
            description="View and add products"
            link="/products"
            icon={
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            }
            color="yellow"
          />
          <ActionCard
            title="Payments"
            description="View payments"
            link="/admin/payment"
            icon={
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
            color="teal"
          />
        </div>
      </main>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon, color }) => {
  const colorClasses = {
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    red: "bg-red-50 text-red-600 border-red-100",
    green: "bg-green-50 text-green-600 border-green-100",
  };

  return (
    <div className="bg-white shadow-lg rounded-xl border border-gray-100 overflow-hidden transform hover:scale-105 transition-transform duration-200">
      <div className="p-6 flex items-center">
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>{icon}</div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
};

const ActionCard = ({ title, description, link, icon, color }) => {
  const colorClasses = {
    indigo: "text-indigo-600 hover:bg-indigo-50",
    red: "text-red-600 hover:bg-red-50",
    green: "text-green-600 hover:bg-green-50",
    blue: "text-blue-600 hover:bg-blue-50",
    purple: "text-purple-600 hover:bg-purple-50",
    pink: "text-pink-600 hover:bg-pink-50",
    yellow: "text-yellow-600 hover:bg-yellow-50",
    teal: "text-teal-600 hover:bg-teal-50",
  };

  return (
    <Link to={link} className="group">
      <div className="bg-white shadow-lg rounded-xl border border-gray-100 h-full hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
        <div className="p-6 flex items-center">
          <div className={`p-3 rounded-full ${colorClasses[color]}`}>
            {icon}
          </div>
          <div className="ml-4">
            <h3
              className={`text-lg font-semibold text-gray-900 group-hover:${
                colorClasses[color].split(" ")[0]
              } transition-colors`}
            >
              {title}
            </h3>
            <p className="mt-1 text-sm text-gray-600">{description}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default AdminDashboard;
