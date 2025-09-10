import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import Navbar from './components/site/Navbar';
import ProtectedRoute from './components/common/ProtectedRoute';

 // Pages
 import Home from './pages/Home';
 import Login from './pages/Login';
 import AuthCallback from './pages/AuthCallback';
 import ServerDetails from './pages/ServerDetails';
 import Servers from './pages/Servers';
 
 // Import actual components
 import Shop from './pages/Shop';
 import Credits from './pages/Credits';
 import Games from './pages/Games';
 
 // Server detail pages
 import ServerSettings from './pages/ServerSettings';
 import ServerPlayers from './pages/ServerPlayers';
 import ServerDinos from './pages/ServerDinos';
 import ServerItems from './pages/ServerItems';
 import ServerRules from './pages/ServerRules';

// Placeholder components for remaining pages
const Profile = () => <div className="p-8"><h1 className="text-2xl font-bold">Profile Page</h1><p>Coming soon...</p></div>;
const Payments = () => <div className="p-8"><h1 className="text-2xl font-bold">Payments Page</h1><p>Coming soon...</p></div>;
const Transactions = () => <div className="p-8"><h1 className="text-2xl font-bold">Transactions Page</h1><p>Coming soon...</p></div>;

const GlobalNavbar = () => {
  const location = useLocation();
  // Show Navbar on Home page; extend this check to other routes if needed
  return location.pathname === '/' ? <Navbar /> : null;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <GlobalNavbar />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/servers" element={<Servers />} />
          <Route path="/servers/:serverId" element={<ServerDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* Protected routes with layout */}

          {/* Server details moved to public route above */}

          <Route path="/shop" element={
            <Layout>
              <Shop />
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

          {/* Server Detail Routes */}
          <Route path="/servers/:serverId/settings" element={
            <ProtectedRoute>
              <Layout>
                <ServerSettings />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/servers/:serverId/players" element={
            <ProtectedRoute>
              <Layout>
                <ServerPlayers />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/servers/:serverId/dinos" element={
            <ProtectedRoute>
              <Layout>
                <ServerDinos />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/servers/:serverId/items" element={
            <ProtectedRoute>
              <Layout>
                <ServerItems />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/servers/:serverId/rules" element={
            <ProtectedRoute>
              <Layout>
                <ServerRules />
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
