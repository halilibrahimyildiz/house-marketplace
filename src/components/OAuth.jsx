import {useLocation, useNavigate} from "react-router-dom"
import {toast} from "react-toastify"
import {getAuth, GoogleAuthProvider, signInWithPopup} from "firebase/auth"
import {doc, getDoc, serverTimestamp, setDoc} from "firebase/firestore"

import googleIcon from "../assets/svg/googleIcon.svg"
import {db} from "../firebase.config"

function OAuth() {
  const navigate = useNavigate()
  const location = useLocation()
  const onGoogleClick = async (e) => {
    try {
      const auth = getAuth()
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)

      const user = result.user

      const docRef = doc(db, "users", user.uid)
      const docSnap = await getDoc(docRef)
      console.log(docSnap, docRef, user)
      if (!docSnap.exists()) {
        await setDoc(docRef, {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        })
      }
      navigate("/")
    } catch (error) {
      toast.error("Could not authorize with Google")
      console.log(error)
    }
  }

  return (
    <div className='socialLogin'>
      <p>Sign {location.pathname === "/sign-up" ? "up" : "in"} with </p>
      <button
        className='socialIconDiv'
        onClick={onGoogleClick}
      >
        <img
          className='socialIconImg'
          src={googleIcon}
          alt='google'
        />
      </button>
    </div>
  )
}

export default OAuth
