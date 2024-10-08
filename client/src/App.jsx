import { useState } from 'react'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard';
import Adminboard from './pages/Adminboard';
import Teacherboard from './pages/Teacherboard';
import Unauthorized from './pages/Unauthorized';
import Profile from './pages/Profile';
import EventCard from './pages/EventCard';
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const userDetails = JSON.parse(localStorage.getItem('userDetails') || '{}');
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  if (!allowedRoles.includes(userDetails.role)) {
    console.log(userDetails)
    return <Navigate to="/unauthorized" replace />;
  }
  
  return children;
};
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login/>}/>
          <Route 
            path='/dashboard/*' 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <Dashboard/>
              </ProtectedRoute>
            }
          />
           <Route 
            path='/teacher/*' 
            element={
              <ProtectedRoute allowedRoles={[ 'teacher']}>
                <Teacherboard/>
              </ProtectedRoute>
            }
          />

          <Route 
            path='/admin' 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Adminboard/>
              </ProtectedRoute>
            }
          />
          <Route 
            path='/profile' 
            element={
              <ProtectedRoute allowedRoles={['student', 'teacher']}>
                <Profile/>
              </ProtectedRoute>
            }
          />
          <Route 
            path='/event/:eventName' 
            element={
              <ProtectedRoute allowedRoles={['student', 'teacher']}>
                <EventCard/>
              </ProtectedRoute>
            }
          />
          <Route path='/unauthorized' element={<Unauthorized />} />

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
