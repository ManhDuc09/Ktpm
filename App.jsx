import './App.css';
import LoginPage from './components/LoginPage';
import UserPage from './components/UserPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RedirectIfLoggedIn from './components/RedirectIfLoggedIn';

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/*"
          element={
            <RedirectIfLoggedIn>
              <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/users/:id" element={<UserPage />} />
              </Routes>
            </RedirectIfLoggedIn>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
