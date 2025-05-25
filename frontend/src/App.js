import React from 'react';
import { Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import AdminEmergencyPage from './pages/Admin/AdminEmergencyPage';
import Navbar from './components/Navbar';
import AdminNavbar from './components/AdminNavbar';
import { AdminRoute, PrivateRoute } from './components/PrivateRoute';
import PetList from './components/profile/PetList';
import PetProfile from './components/profile/PetProfile';
import PetRegistrationForm from './components/profile/PetRegistrationForm';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import AdminBookingsPage from './pages/Admin/AdminBookingsPage';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminPayments from './pages/Admin/AdminPayments';
import AdminBookings from './pages/Admin/CaregiveBooking';
import PetPregnantAdmin from './pages/Admin/PetPregnantAdmin';
import PetTrainingAdmin from './pages/Admin/PetTrainingAdmin';
import PregnancyProgramForm from './pages/Admin/PregnancyProgramForm';
import TrainingProgramForm from './pages/Admin/TrainingProgramForm';
import AddProduct from './pages/Admin/shop/AddProduct';
import EditProduct from './pages/Admin/shop/EditProduct';
import ProductDetail from './pages/Admin/shop/ProductDetail';
import ProductList from './pages/Admin/shop/ProductList';
import BookNowPage from './pages/BookNowPage';
import CaregiverForm from './pages/CaregiverForm';
import CaregiverPage from './pages/CaregiverPage';
import EmergencyContactPage from './pages/EmergencyContact';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import PaymentForm from './pages/PaymentForm';
import PetTrainingPage from './pages/PetTrainingPage';
import CommunityPage from './pages/PostList';
import PregnancyProgramPage from './pages/PregnancyProgramPage';
import RegisterPage from './pages/RegisterPage';
import PostDetailPage from './pages/ReplyList';
import ClientProductList from './pages/Shop/ClientProductList';
import Clientproductdetails from './pages/Shop/Clientproductdetails';
import VaccinationPage from './pages/VaccinationPage';
import ProfilePage from './pages/ProfilePage';

function AppLayout() {
  const location = useLocation();
  const hideNavbarRoutes = ['/login', '/register'];
  const isAdminRoute = location.pathname.startsWith('/admin') || 
                      ['/products', '/add', '/edit/:id', '/product/:id','/admin/bookings'].includes(location.pathname);

  return (
    <>
      {!hideNavbarRoutes.includes(location.pathname) && !isAdminRoute && <Navbar />}
      {!hideNavbarRoutes.includes(location.pathname) && isAdminRoute && <AdminNavbar />}
      <Routes>
        {/* User Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
        <Route path="/book-now" element={<PrivateRoute><BookNowPage /></PrivateRoute>} />
        <Route path="/caregiverpage" element={<CaregiverPage />} />
        <Route path="/community" element={<PrivateRoute><CommunityPage /></PrivateRoute>} />
        <Route path="/community/:postId" element={<PrivateRoute><PostDetailPage /></PrivateRoute>} />
        <Route path="/emergencyContact" element={<EmergencyContactPage />} />
        <Route path="/Vaccination" element={<VaccinationPage />} />
        <Route path="/training" element={<PrivateRoute><PetTrainingPage /></PrivateRoute>} />
        <Route path="/pregnancy" element={<PrivateRoute><PregnancyProgramPage /></PrivateRoute>} />
        <Route path="/payment" element={<PrivateRoute><PaymentForm /></PrivateRoute>} />
        <Route path="/shop" element={<PrivateRoute><ClientProductList /></PrivateRoute>} />
        <Route path="/clientproduct/:id" element={<PrivateRoute><Clientproductdetails /></PrivateRoute>} />
        <Route path="/pets" element={<PrivateRoute><PetList /></PrivateRoute>} />
        <Route path="/pets/register" element={<PrivateRoute><PetRegistrationForm /></PrivateRoute>} />
        <Route path="/pets/:id" element={<PrivateRoute><PetProfile /></PrivateRoute>} />
        <Route path="/profile" element={<ProfilePage />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/bookings" element={<AdminRoute><AdminBookingsPage /></AdminRoute>} />
        <Route path="/admin/caregiverform" element={<AdminRoute><CaregiverForm /></AdminRoute>} />
        <Route path="/admin/emergencies" element={<AdminRoute><AdminEmergencyPage /></AdminRoute>} />
        <Route path="/admin/trainingform" element={<AdminRoute><TrainingProgramForm /></AdminRoute>} />
        <Route path="/admin/pregnancy" element={<AdminRoute><PregnancyProgramPage /></AdminRoute>} />
        <Route path="/admin/pregnancyform" element={<AdminRoute><PregnancyProgramForm /></AdminRoute>} />
        <Route path="/admin/pregnancyform/edit/:id" element={<AdminRoute><PregnancyProgramForm /></AdminRoute>} />
        <Route path="/admin/payment" element={<AdminRoute><AdminPayments /></AdminRoute>} />
        <Route path="/admin/caregivebooking" element={<AdminRoute><AdminBookings /></AdminRoute>} />
        <Route path="/admin/pets/:id" element={<AdminRoute><PetProfile /></AdminRoute>} />
        <Route path="/admin/trainingadmin" element={<AdminRoute><PetTrainingAdmin /></AdminRoute>} />
        <Route path="/admin/pregnancyadmin" element={<AdminRoute><PetPregnantAdmin /></AdminRoute>} />
        <Route path="/admin/pregnancy/:id/edit" element={<AdminRoute><PregnancyProgramForm /></AdminRoute>} />

        <Route path="/products" element={<AdminRoute><ProductList /></AdminRoute>} />
        <Route path="/add" element={<AdminRoute><AddProduct /></AdminRoute>} />
        <Route path="/edit/:id" element={<AdminRoute><EditProduct /></AdminRoute>} />
        <Route path="/product/:id" element={<AdminRoute><ProductDetail /></AdminRoute>} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <AppLayout />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;