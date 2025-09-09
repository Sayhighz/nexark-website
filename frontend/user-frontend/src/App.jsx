import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';

 // Pages
 import Home from './pages/Home';
 import Login from './pages/Login';
 import AuthCallback from './pages/AuthCallback';
 
 // Import actual components
 import Servers from './pages/Servers';
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

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* Protected routes with layout */}

          <Route path="/servers" element={
            <ProtectedRoute>
              <Layout>
                <Servers />
              </Layout>
            </ProtectedRoute>
          } />

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
