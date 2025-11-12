import './App.css';
import LoginPage from './components/LoginPage';
import UserPage from './components/UserPage'; // your user page
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        {/* Default login page */}
        <Route path="/" element={<LoginPage />} />

        {/* Example user page */}
        <Route path="/users/:id" element={<UserPage />} />
      </Routes>
    </Router>
  );
}

export default App;
