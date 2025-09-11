import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import Navbar from './components/site/Navbar';
import ProtectedRoute from './components/common/ProtectedRoute';

 // Pages
 import Home from './pages/Home';
 import AuthCallback from './pages/AuthCallback';
 import ServerDetails from './pages/ServerDetails';
 // Import actual components
 import Shop from './pages/Shop';
 import ItemDetails from './pages/ItemDetails';
 import Credits from './pages/Credits';
 import Games from './pages/Games';
 import Transactions from './pages/Transactions';
 

// Placeholder components for remaining pages
const Profile = () => <div className="p-8"><h1 className="text-2xl font-bold">Profile Page</h1><p>Coming soon...</p></div>;
const Payments = () => <div className="p-8"><h1 className="text-2xl font-bold">Payments Page</h1><p>Coming soon...</p></div>;

const GlobalNavbar = () => {
  const location = useLocation();
  // Show Navbar on specific routes that don't use Layout component
  const showNavbarRoutes = ['/', '/auth/callback'];
  const showNavbar = showNavbarRoutes.some(route =>
    location.pathname === route || location.pathname.startsWith('/servers/')
  );
  return showNavbar ? <Navbar /> : null;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <GlobalNavbar />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/servers/:serverId" element={<ServerDetails />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* Protected routes with layout */}

          {/* Server details moved to public route above */}

          <Route path="/shop" element={
            <Layout>
              <Shop />
            </Layout>
          } />

          <Route path="/shop/items/:itemId" element={
            <Layout>
              <ItemDetails />
            </Layout>
          } />

          <Route path="/games" element={
            <Layout>
              <Games />
            </Layout>
          } />


          <Route path="/profile" element={
            <ProtectedRoute>
              <Layout>
                <Profile />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/account/credits" element={
            <ProtectedRoute>
              <Layout>
                <Credits />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/account/payments" element={
            <ProtectedRoute>
              <Layout>
                <Payments />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/account/transactions" element={
            <ProtectedRoute>
              <Layout>
                <Transactions />
              </Layout>
            </ProtectedRoute>
          } />


          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
