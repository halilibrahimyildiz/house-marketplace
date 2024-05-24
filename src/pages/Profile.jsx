import {useEffect, useState} from "react"
import {Link, useNavigate} from "react-router-dom"
import {toast} from "react-toastify"
import {getAuth, updateProfile} from "firebase/auth"
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore"

import homeIcon from "../assets/svg/homeIcon.svg"
import arrowRight from "../assets/svg/keyboardArrowRightIcon.svg"
import ListingItem from "../components/ListingItem"
import Spinner from "../components/Spinner"
import {db} from "../firebase.config"

function Profile() {
  const auth = getAuth()
  const [changeDetails, setChangeDetails] = useState(false)
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  })
  const {name, email} = formData
  const [listings, setListings] = useState(null)
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()

  useEffect(() => {
    const fetchUserListings = async () => {
      const listingsRef = collection(db, "listings")
      const q = query(
        listingsRef,
        where("userRef", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc"),
      )
      const querrSnap = await getDocs(q)

      let listings = []

      querrSnap.forEach((doc) => {
        listings = [...listings, {id: doc.id, data: doc.data()}]
      })
      setListings(listings)
      setLoading(false)
    }

    fetchUserListings()
  }, [])

  const onLogout = () => {
    auth.signOut()
    navigate("/")
  }

  const onSubmit = async () => {
    try {
      if (auth.currentUser.displayName !== name) {
        // Update Display Name in Firebase
        await updateProfile(auth.currentUser, {displayName: name})

        // Update in fireStore
        const userRef = doc(db, "users", auth.currentUser.uid)
        await updateDoc(userRef, {
          name,
        })
      }
    } catch (error) {
      toast.error("Could not update profile details")
    }
  }

  const onDelete = async (listingId) => {
    if (window.confirm("Are you sure you want to delete?")) {
      await deleteDoc(doc(db, "listings", listingId))
      const updatedlistings = listings.filter((listing) => listing.id !== listingId)
      setListings(updatedlistings)
      toast.success("Successfully deleted listing")
    }
  }

  const onChange = (e) => {
    setFormData((preState) => ({
      ...preState,
      [e.target.id]: e.target.value,
    }))
  }

  const onEdit = (listingId) => navigate(`/edit-listing/${listingId}`)

  return (
    <div className='profile'>
      <header className='profileHeader'>
        <p className='pageHeader'>My Profile</p>
        <button
          type='button'
          className='logOut'
          onClick={onLogout}
        >
          Logout
        </button>
      </header>
      <main>
        <div className='profileDetailsHeader'>
          <p className='profileDetailsText'>Personal Details</p>
          <p
            className='changePersonalDetails'
            onClick={() => {
              changeDetails && onSubmit()
              setChangeDetails((prevState) => !prevState)
            }}
          >
            {changeDetails ? "done" : "change"}
          </p>
        </div>
        <div className='profileCard'>
          <form>
            <input
              type='text'
              id='name'
              className={!changeDetails ? "profileName" : "profileNameActive"}
              disabled={!changeDetails}
              value={name}
              onChange={onChange}
            />
            <input
              type='text'
              id='email'
              className={!changeDetails ? "profileEmail" : "profileEmailActive"}
              disabled={!changeDetails}
              value={email}
              onChange={onChange}
            />
          </form>
        </div>
        <Link
          to='/create-listing'
          className='createListing'
        >
          <img
            src={homeIcon}
            alt='home'
          />
          <p>Sell or rent your home</p>
          <img
            src={arrowRight}
            alt='arrovright'
          />
        </Link>
        {!loading && listings?.length > 0 && (
          <>
            <p className='listingText'>Your Listings</p>
            <ul className='listingsList'>
              {listings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                  onDelete={() => onDelete(listing.id)}
                  onEdit={() => onEdit(listing.id)}
                />
              ))}
            </ul>
          </>
        )}
      </main>
    </div>
  )
}

export default Profile
