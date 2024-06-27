import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home'
import Navbar from './components/common/Navbar';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import OpenRoute from './components/core/Auth/OpenRoute';
import SignUp from './pages/Signup';
import Footer from './components/common/Footer';
import UpdatePassword from './pages/UpdatePassword';
import VerifyEmail from './pages/VerifyEmail';
import About from './pages/About';


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
        <Route path='forgot-password' element={
                                    <OpenRoute>
                                      <ForgotPassword/>
                                    </OpenRoute>}/>

        <Route path='update-password/:id' element={
                                    <OpenRoute>
                                      <UpdatePassword/>
                                    </OpenRoute>}/>
        <Route path='verify-email' element={
                                    <OpenRoute>
                                      <VerifyEmail/>
                                    </OpenRoute>}/>
        <Route path='about' element={<About/>}/>
      </Routes>
      <Footer/>
    </div>
  );
}

export default App;
