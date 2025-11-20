import './App.css';
import LoginPage from './components/LoginPage';
import UserPage from './components/UserPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RedirectIfLoggedIn from './components/RedirectIfLoggedIn';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>

        <Route
          path="/"
          element={
            <RedirectIfLoggedIn>
              <LoginPage />
            </RedirectIfLoggedIn>
          }
        />

        <Route
          path="/users/:id"
          element={
            <PrivateRoute>
              <UserPage />
            </PrivateRoute>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;
