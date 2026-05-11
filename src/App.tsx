import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AdminLayout } from './components/AdminLayout';

// Public Pages
import { Home } from './pages/Home';
import { TrackingSearch } from './pages/public/TrackingSearch';
import { TrackingDetail } from './pages/public/TrackingDetail';

// Admin Pages
import { Login } from './pages/admin/Login';
import { Dashboard } from './pages/admin/Dashboard';
import { ShipmentList } from './pages/admin/ShipmentList';
import { ShipmentCreate } from './pages/admin/ShipmentCreate';
import { ShipmentDetail } from './pages/admin/ShipmentDetail';
import { DriverList } from './pages/admin/DriverList';

// Driver Pages
import { DriverTracking } from './pages/driver/DriverTracking';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="rastrear" element={<TrackingSearch />} />
          <Route path="rastrear/:codigo" element={<TrackingDetail />} />
        </Route>

        {/* Driver Routes */}
        <Route path="/motorista/:codigo" element={<DriverTracking />} />

        {/* Admin Login */}
        <Route path="/admin/login" element={<Login />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="cargas" element={<ShipmentList />} />
          <Route path="cargas/nova" element={<ShipmentCreate />} />
          <Route path="cargas/:id" element={<ShipmentDetail />} />
          <Route path="motoristas" element={<DriverList />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
