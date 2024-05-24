import {BrowserRouter as Router, Route, Routes} from "react-router-dom"
import {ToastContainer} from "react-toastify"

import Navbar from "./components/Navbar"
import PrivateRoutes from "./components/PrivateRoutes"
import Category from "./pages/Category"
import Contact from "./pages/Contact"
import CreateListing from "./pages/CreateListing"
import EditListing from "./pages/EditListing"
import Explore from "./pages/Explore"
import ForgotPassword from "./pages/ForgotPassword"
import Listing from "./pages/Listing"
import Offers from "./pages/Offers"
import Profile from "./pages/Profile"
import SignIn from "./pages/SignIn"
import SignUp from "./pages/SignUp"

import "react-toastify/dist/ReactToastify.css"

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route
            path='/'
            element={<Explore />}
          />
          <Route
            path='/offers'
            element={<Offers />}
          />
          <Route
            path='/category/:categoryName'
            element={<Category />}
          />
          <Route
            path='/category/:categoryName/:listingId'
            element={<Listing />}
          />
          <Route
            path='/contact/:landLordId'
            element={<Contact />}
          />
          <Route
            path='/profile'
            element={<PrivateRoutes />}
          >
            <Route
              path='/profile'
              element={<Profile />}
            />
          </Route>
          <Route
            path='/sign-in'
            element={<SignIn />}
          />
          <Route
            path='/sign-up'
            element={<SignUp />}
          />
          <Route
            path='/forgot-password'
            element={<ForgotPassword />}
          />
          <Route
            path='/create-listing'
            element={<CreateListing />}
          />
          <Route
            path='/edit-listing/:listingId'
            element={<EditListing />}
          />
        </Routes>
        <Navbar />
      </Router>
      <ToastContainer
        position='top-right'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='light'
      />

      <ToastContainer />
    </>
  )
}

export default App
