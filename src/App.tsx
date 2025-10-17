import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AnalysisResult from './pages/AnalysisResult';
import Login from './pages/Login';
import Register from './pages/Register';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import CreateEvent from './pages/CreateEvent';
import EditEvent from './pages/EditEvent';
import EditProfile from './pages/EditProfile';
import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <Router>
      <Routes>
        {/* Home page - Event parsing (no navbar) */}
        <Route path="/" element={<Home />} />
        <Route path="/analyze" element={<AnalysisResult />} />
        
        {/* Other pages with navbar */}
        <Route path="/*" element={
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/:id" element={<EventDetail />} />
              <Route path="/events/:id/edit" element={<EditEvent />} />
              <Route path="/create-event" element={<CreateEvent />} />
              <Route path="/profile/edit" element={<EditProfile />} />
              <Route path="/admin" element={<AdminPanel />} />
            </Routes>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
