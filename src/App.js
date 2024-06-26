import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home'
import Navbar from './components/common/Navbar';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import OpenRoute from './components/core/Auth/OpenRoute';
import SignUp from './pages/Signup';
import Footer from './components/common/Footer';


function App() {
  return (
    <div className="App w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path="signup" element={
                            <OpenRoute>
                              <SignUp />
                            </OpenRoute>
                          }/>
        <Route path="login" element={
                            <OpenRoute>
                              <Login/>
                            </OpenRoute>
                          }/>
        <Route path='forgot-password' element={<ForgotPassword/>}/>
      </Routes>
      <Footer/>
    </div>
  );
}

export default App;
