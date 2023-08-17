import { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Layout from './components/Layout/Layout';
import UserProfile from './components/Profile/UserProfile';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import AuthContext from './store/auth-context';

function ProfileRedirect() {
  const authCtx = useContext(AuthContext);

  if (authCtx.isLoggedIn) {
    return <UserProfile />;
  } else {
    return <Navigate to="/auth" />;
  }
}

function App() {
  const authCtx = useContext(AuthContext);

  return (
    <Layout>
      <Routes>
        <Route path='/' element={<HomePage />} />
        {!authCtx.isLoggedIn && <Route path='/auth' element={<AuthPage />} />}
        <Route path='/profile' element={<ProfileRedirect />} />
        <Route path='*' element={<Navigate to='/' />} />
      </Routes>
    </Layout>
  );
}

export default App;
