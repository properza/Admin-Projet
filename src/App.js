import React, { lazy, useEffect , Suspense } from 'react'
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import { themeChange } from 'theme-change'
import checkAuth from './app/auth';
import initializeApp from './app/init';
import { useSelector , useDispatch } from 'react-redux';
import {fetchCurrentUser} from './components/common/userSlice'

// Importing pages
const Layout = lazy(() => import('./containers/Layout'))
const Login = lazy(() => import('./pages/Login'))


initializeApp()

function App() {
  const dispatch = useDispatch();
  const userToken = useSelector((state) => state.user.userToken);

  // useEffect(() => {
  //   themeChange(false);
  //   if (userToken) {
  //     dispatch(fetchCurrentUser());
  //   }
  // }, [dispatch, userToken]);


  useEffect(() => {
    themeChange(false)
  }, [])

  // console.log("User Token:", userToken);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Router basename='/'>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/app/*"
            element={userToken ? <Layout /> : <Navigate to="/" replace />}
          />
          {!userToken && <Route path="*" element={<Navigate to="/" replace />} />}
        </Routes>
      </Router>
    </Suspense>
  );
}

export default App
