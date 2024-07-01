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
import MyProfile from './components/core/Dashboard/MyProfile';
import PrivateRoute from './components/core/Auth/PrivateRoute';
import Dashboard from './pages/Dashboard';
import Error from "./pages/Error"
import EnrolledCourses from './components/core/Dashboard/EnrolledCourses';
import Cart from './components/core/Dashboard/Cart';
import { useSelector } from 'react-redux';
import { ACCOUNT_TYPE } from './utils/constant';
import AddCourse from './components/core/Dashboard/AddCourse';

function App() {
  const {user} = useSelector((state)=> state.profile)
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
        <Route path="/contact" element={<Contact />} />c
        <Route element={
          <PrivateRoute>
            <Dashboard/>
          </PrivateRoute>
        }>
          <Route path='dashboard/my-profile' element={<MyProfile/>}/>
          <Route path='dashboard/Settings' element={<Settings/>}/>
          
          {
            user?.accountType === ACCOUNT_TYPE.STUDENT && (
              <>
                <Route path='dashboard/enrolled-courses' element={<EnrolledCourses/>}/>
                <Route path='dashboard/cart' element={<Cart/>}/>
              </>
            )
          }

          {
            user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
              <>
                <Route path='dashboard/add-course' element={<AddCourse/>}/>
                
              </>
            )
          }
        </Route>

        

        <Route path='*' element={<Error/>}/>
      </Routes>
      <Footer/>
    </div>
  );
}

export default App;
