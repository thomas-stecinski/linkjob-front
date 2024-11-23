import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from '../pages/home';
import Login from '../pages/login';
import AccordionComponent from '../components/accordion';

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/accordion" element={<AccordionComponent />} />
      </Routes>
    </Router>
  );
}