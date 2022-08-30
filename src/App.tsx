import './App.scss';
import WalletLoginPage from './pages/WalletLoginPage';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import TenantHomePage from './pages/TenantHomePage';
import TenantRoute from './components/TenantRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TenantRoute><TenantHomePage /></TenantRoute>} />
        <Route path="/walletAuth" element={<WalletLoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
