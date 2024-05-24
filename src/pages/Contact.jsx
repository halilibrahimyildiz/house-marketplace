import {useEffect, useState} from "react"
import {useParams, useSearchParams} from "react-router-dom"
import {toast} from "react-toastify"
import {doc, getDoc} from "firebase/firestore"

import {db} from "../firebase.config"

import Listing from "./Listing"

function Contact() {
  const [message, setMessage] = useState("")
  const [landLord, setLandLord] = useState(null)
  const [searchParams, setSearchParams] = useSearchParams()

  const params = useParams()
  console.log(params.landLordId)

  useEffect(() => {
    const getLandLord = async () => {
      const docRef = doc(db, "users", params.landLordId)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        setLandLord(docSnap.data())
      } else {
        toast.error("Could not get landlord data")
      }
    }
    getLandLord()
  }, [params.landLordId])

  const onChange = (e) => {
    setMessage(e.target.value)
  }
  return (
    <div className='pageContainer'>
      <header>
        <p className='pageHeader'>Contact Landlord</p>
      </header>

      {landLord !== null && (
        <main>
          <div className='contactLandlord'>
            <p className='landlordName'>Contact {landLord.name}</p>
          </div>
          <form className='message'>
            <div className='messageDiv'>
              <label
                htmlFor='message'
                className='messageLabel'
              >
                Message
              </label>
              <textarea
                name='message'
                id='message'
                className='textarea'
                value={message}
                onChange={onChange}
              ></textarea>
            </div>
            <a
              href={`mailto:${landLord.email}?Subject=${searchParams.get(
                "listingName",
              )}&body=${message}`}
            >
              <button
                type='button'
                className='primaryButton'
              >
                Send Message
              </button>
            </a>
          </form>
        </main>
      )}
    </div>
  )
}

export default Contact
