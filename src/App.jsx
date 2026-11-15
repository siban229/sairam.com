import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CafeProvider } from './context/CafeContext';
import { AuthProvider } from './context/AuthContext';

// Admin Layout & Pages
import AdminLayout from './components/admin/AdminLayout';
import DashboardPage from './pages/admin/DashboardPage';
import TablesPage from './pages/admin/TablesPage';
import PosPage from './pages/admin/PosPage';
import KitchenPage from './pages/admin/KitchenPage';
import MenuPage from './pages/admin/MenuPage';
import CustomersPage from './pages/admin/CustomersPage';
import LoyaltyPage from './pages/admin/LoyaltyPage';
import ReportsPage from './pages/admin/ReportsPage';
import SettingsPage from './pages/admin/SettingsPage';
import BillingPage from './pages/admin/BillingPage';
import LoginPage from './pages/admin/LoginPage';

// Customer Pages
import CustomerMenuPage from './pages/customer/CustomerMenuPage';
import CustomerOrderTrackingPage from './pages/customer/CustomerOrderTrackingPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CafeProvider>
          <Routes>
            {/* Root redirects to Admin Dashboard */}
            <Route path="/" element={<Navigate to="/admin" replace />} />

            {/* Authentication */}
            <Route path="/admin/login" element={<LoginPage />} />

            {/* Standalone Fullscreen Kitchen Screen (optimized for iPads/wall tablets) */}
            <Route path="/kitchen" element={<KitchenPage isFullscreen={true} />} />

            {/* Customer QR Self-Ordering Flows */}
            <Route path="/menu" element={<CustomerMenuPage />} />
            <Route path="/menu/tracking/:orderId" element={<CustomerOrderTrackingPage />} />

            {/* Admin Management System (Protected) */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="pos" element={<PosPage />} />
              <Route path="billing" element={<BillingPage />} />
              <Route path="tables" element={<TablesPage />} />
              <Route path="kitchen" element={<KitchenPage isFullscreen={false} />} />
              <Route path="menu" element={<MenuPage />} />
              <Route path="customers" element={<CustomersPage />} />
              <Route path="loyalty" element={<LoyaltyPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </CafeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
