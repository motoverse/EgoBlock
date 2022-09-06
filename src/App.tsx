import './App.scss';
import WalletLoginPage from './pages/WalletLoginPage';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import TenantHomePage from './pages/TenantHomePage';
import TenantRoute from './components/tenant/TenantRoute';
import AuthProvider from './contexts/AuthContext';
import ApplicationProvider from './contexts/ApplicationContext';
import { PAGES } from './constants.ts/navigation';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<TenantRoute><TenantHomePage /></TenantRoute>} />
          <Route path={`/:applicationSlug/*`} element={<TenantApp />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

const TenantApp = () => {
  return <ApplicationProvider>
    <Routes>
      <Route path={`${PAGES.walletAuth}`} element={<WalletLoginPage />} />
    </Routes>
  </ApplicationProvider>
}
export default App;
