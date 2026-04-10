import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';
import AuthGuard from './components/AuthGuard';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Portal from './pages/Portal';
import LiveMap from './pages/LiveMap';
import Fleet from './pages/Fleet';
import Schedule from './pages/Schedule';
import Maintenance from './pages/Maintenance';
import Alerts from './pages/Alerts';
import ChatPage from './pages/ChatPage';
import Settings from './pages/Settings';
import BuyPass from './pages/BuyPass';
import AdminPortal from './pages/AdminPortal';

export default function App() {
  return (
    <Routes>
      {/* Public auth routes */}
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />

      {/* Protected dashboard */}
      <Route element={<AuthGuard><DashboardLayout /></AuthGuard>}>
        <Route path="/" element={<Portal />} />
        <Route path="/portal" element={<Portal />} />
        <Route path="/live-map" element={<LiveMap />} />
        <Route path="/fleet" element={<Fleet />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/maintenance" element={<Maintenance />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/buy-pass" element={<BuyPass />} />
        <Route path="/admin" element={<AdminPortal />} />
      </Route>

      <Route path="*" element={<Navigate to="/signin" replace />} />
    </Routes>
  );
}
