import {useEffect, useState} from "react"
import {useParams} from "react-router-dom"
import {toast} from "react-toastify"
import {collection, getDocs, limit, orderBy, query, startAfter, where} from "firebase/firestore"

import ListingItem from "../components/ListingItem.jsx"
import Spinner from "../components/Spinner.jsx"
import {db} from "../firebase.config"

function Offers() {
  const [listings, setListings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lastFetchListing, setLastFetchListing] = useState(null)

  useEffect(() => {
    const fetchListings = async () => {
      try {
        // Get reference
        const listingsRef = collection(db, "listings")

        //Create a query
        const q = query(
          listingsRef,
          where("offer", "==", true),
          orderBy("timestamp", "desc"),
          limit(10),
        )

        //Execute query

        const querySnap = await getDocs(q)
        const lastVisible = querySnap.docs[querySnap.docs.length - 1]
        setLastFetchListing(lastVisible)

        const listings = []

        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          })
        })

        setListings(listings)
        setLoading(false)
      } catch (error) {
        toast.error("Could not fetch listings")
      }
    }
    fetchListings()
  }, [])
  const onFetchMoreListings = async () => {
    try {
      // Get reference
      const listingsRef = collection(db, "listings")

      //Create a query
      const q = query(
        listingsRef,
        where("offer", "==", true),
        orderBy("timestamp", "desc"),
        startAfter(lastFetchListing),
        limit(10),
      )

      //Execute query
      const querySnap = await getDocs(q)

      const lastVisible = querySnap.docs[querySnap.docs.length - 1]
      setLastFetchListing(lastVisible)

      const listings = []

      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        })
      })

      setListings((prevState) => [...prevState, ...listings])
      setLoading(false)
    } catch (error) {
      toast.error("Could not fetch listings")
    }
  }

  return (
    <div className='category'>
      <header>
        <p className='pageHeader'>Offers </p>
      </header>
      {loading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <>
          <main>
            <ul className='categoryListings'>
              {listings.map((listing, key) => (
                <ListingItem
                  listing={listing.data}
                  id={listing.id}
                  key={listing.id}
                />
              ))}
            </ul>
          </main>
          <br />
          <br />
          {lastFetchListing && (
            <p
              className='loadMore'
              onClick={onFetchMoreListings}
            >
              Load More
            </p>
          )}
        </>
      ) : (
        <p>There are no current offers</p>
      )}
    </div>
  )
}

export default Offers
