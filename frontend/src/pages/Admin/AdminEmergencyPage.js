import React, { useState, useEffect } from "react";
import {
  FaExclamationTriangle,
  FaUserMd,
  FaAmbulance,
  FaCheck,
  FaTimes,
  FaSpinner,
  FaSearch,
  FaFilter,
  FaSync,
} from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip } from "react-tippy";

const AdminEmergencyPage = () => {
  const [emergencies, setEmergencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const navigate = useNavigate();

  const fetchEmergencies = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/emergency", {
        withCredentials: true,
      });
      setEmergencies(response.data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch emergencies");
      if (err.response?.status === 403) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmergencies();
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      const response = await axios.patch(
        `/api/emergency/${id}`,
        { status: newStatus },
        { withCredentials: true }
      );

      setEmergencies(
        emergencies.map((emergency) =>
          emergency._id === id ? response.data : emergency
        )
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status");
    }
  };

  const filteredEmergencies = emergencies.filter((emergency) => {
    const matchesSearch =
      emergency.petName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emergency.user?.username
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      emergency.contactNumber?.includes(searchTerm);

    const matchesStatus =
      statusFilter === "all" || emergency.status === statusFilter;

    const matchesType =
      typeFilter === "all" || emergency.emergencyType === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "responded":
        return "bg-blue-100 text-blue-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getEmergencyIcon = (type) => {
    switch (type) {
      case "medical":
        return <FaUserMd className="text-red-500" />;
      case "accident":
        return <FaAmbulance className="text-red-500" />;
      default:
        return <FaExclamationTriangle className="text-red-500" />;
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba')",
      }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      <div className="relative max-w-7xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-white/20"
        >
          {/* Header */}
          <div className="p-8 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              Emergency Response Dashboard
            </h1>
            <p className="mt-2 text-gray-600">
              Manage urgent pet care requests in real-time
            </p>
          </div>

          {/* Controls */}
          <div className="p-6 bg-gray-50/50 border-b border-gray-200">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div className="relative">
                <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search emergencies..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 bg-white/50"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2">
                <FaFilter className="text-gray-500 shrink-0" />
                <select
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 bg-white/50"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="responded">Responded</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <FaFilter className="text-gray-500 shrink-0" />
                <select
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 bg-white/50"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="medical">Medical</option>
                  <option value="accident">Accident</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <button
                onClick={fetchEmergencies}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white/50 hover:bg-white border border-gray-200 rounded-xl transition-all"
              >
                <FaSync className={`${loading ? "animate-spin" : ""}`} />
                <span>Refresh Data</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          {!loading && emergencies.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6"
            >
              <div className="bg-white/80 p-4 rounded-xl border border-gray-200 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <FaExclamationTriangle className="text-red-600 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Emergencies</p>
                    <p className="text-2xl font-bold text-red-600">
                      {emergencies.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 p-4 rounded-xl border border-gray-200 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <FaSpinner className="text-yellow-600 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {emergencies.filter((e) => e.status === "pending").length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 p-4 rounded-xl border border-gray-200 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <FaCheck className="text-green-600 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Resolved</p>
                    <p className="text-2xl font-bold text-green-600">
                      {
                        emergencies.filter((e) => e.status === "resolved")
                          .length
                      }
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Content */}
          <div className="p-6">
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-center gap-3"
                >
                  <FaTimes className="text-red-500 shrink-0" />
                  <p className="text-red-800">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {loading ? (
              <div className="flex justify-center items-center p-12">
                <FaSpinner className="animate-spin text-4xl text-red-500" />
              </div>
            ) : (
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 backdrop-blur-sm sticky top-0">
                      <tr>
                        {[
                          "Pet",
                          "Owner",
                          "Type",
                          "Details",
                          "Contact",
                          "Location",
                          "Status",
                          "Actions",
                        ].map((header) => (
                          <th
                            key={header}
                            className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <AnimatePresence>
                        {filteredEmergencies.map((emergency) => (
                          <motion.tr
                            key={emergency._id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="hover:bg-gray-50/30 transition-colors"
                          >
                            {/* Table cells with updated styling */}
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-100 rounded-lg">
                                  {getEmergencyIcon(emergency.emergencyType)}
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {emergency.petName}
                                  </p>
                                  <p className="text-sm text-gray-500 capitalize">
                                    {emergency.petType}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="px-6 py-4">
                              <div>
                                <p className="font-medium text-gray-900">
                                  {emergency.user?.username || "N/A"}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {emergency.user?.email || "N/A"}
                                </p>
                              </div>
                            </td>

                            <td className="px-6 py-4">
                              <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 capitalize">
                                {emergency.emergencyType}
                              </span>
                            </td>

                            <td className="px-6 py-4 max-w-xs">
                              <p className="text-sm text-gray-900 line-clamp-2">
                                {emergency.emergencyDetails}
                              </p>
                            </td>

                            <td className="px-6 py-4">
                              <p className="text-sm text-gray-900">
                                {emergency.contactNumber}
                              </p>
                            </td>

                            <td className="px-6 py-4">
                              <p className="text-sm text-gray-900">
                                {emergency.location}
                              </p>
                            </td>

                            <td className="px-6 py-4">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                  emergency.status
                                )}`}
                              >
                                {emergency.status}
                              </span>
                            </td>

                            <td className="px-6 py-4 space-x-2">
                              {emergency.status !== "responded" && (
                                <Tooltip
                                  title="Mark as Responded"
                                  position="top"
                                  trigger="mouseenter"
                                >
                                  <button
                                    onClick={() =>
                                      updateStatus(emergency._id, "responded")
                                    }
                                    className="p-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                                  >
                                    <FaUserMd className="text-sm" />
                                  </button>
                                </Tooltip>
                              )}
                              {emergency.status !== "resolved" && (
                                <Tooltip
                                  title="Mark as Resolved"
                                  position="top"
                                  trigger="mouseenter"
                                >
                                  <button
                                    onClick={() =>
                                      updateStatus(emergency._id, "resolved")
                                    }
                                    className="p-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                                  >
                                    <FaCheck className="text-sm" />
                                  </button>
                                </Tooltip>
                              )}
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminEmergencyPage;
