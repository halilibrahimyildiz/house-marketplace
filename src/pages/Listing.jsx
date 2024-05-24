import {useEffect, useState} from "react"
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet"
import {Link, useNavigate, useParams} from "react-router-dom"
import {getAuth} from "firebase/auth"
import {doc, getDoc} from "firebase/firestore"
import {A11y, Navigation, Pagination, Scrollbar} from "swiper/modules"
import {Swiper, SwiperSlide} from "swiper/react"

import shareIcon from "../assets/svg/shareIcon.svg"
import Spinner from "../components/Spinner"
import {db} from "../firebase.config"

import "swiper/swiper-bundle.css"

function Listing() {
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)

  const [shareLinkCopied, setShareLinkCopied] = useState(false)

  const navigate = useNavigate()
  const params = useParams()
  const auth = getAuth()

  useEffect(() => {
    const fetchListings = async () => {
      const docRef = doc(db, "listings", params.listingId)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        setListing(docSnap.data())
        console.log(listing)
        setLoading(false)
      }
    }
    fetchListings()
  }, [navigate, params.listingId, listing])

  if (loading) return <Spinner />

  return (
    <main>
      <Swiper
        modules={[A11y, Navigation, Pagination, Scrollbar]}
        slidesPerView={1}
        pagination={{clickable: true}}
      >
        {listing.imageUrls.map((url, index) => (
          <SwiperSlide key={index}>
            <div
              onClick={(e) => {
                e.preventDefault()
                window.open(url, "_blank")
              }}
              style={{
                background: `url(${url}) center no-repeat`,
                backgroundSize: "cover", // Resmi dikey merkezlemek için "contain" değerini kullanıyoruz
                // Dikey merkezlemek için ekledik
              }}
              className='swiperSlideDiv'
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div
        className='shareIconDiv'
        onClick={() => {
          navigator.clipboard.writeText(window.location.href)
          setShareLinkCopied(true)
          setTimeout(() => setShareLinkCopied(false), 2000)
        }}
      >
        <img
          src={shareIcon}
          alt=''
        />
      </div>
      {shareLinkCopied && <p className='linkCopied'>Link Copied</p>}

      <div className='listingDetails'>
        <p className='listingName'>
          {listing.name} - $
          {listing.offer
            ? listing.discountedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            : listing.regularPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </p>
        <p className='listingLocation'>{listing.location}</p>
        <p className='listingType'>For {listing.type === "rent" ? "Rent" : "Sale"}</p>
        {listing.offer && (
          <p className='discountedPrice'>${listing.regularPrice - listing.discountedPrice}</p>
        )}
        <ul className='listingDetailsList'>
          <li>{listing.bedrooms > 1 ? `${listing.bedrooms} Bedrooms` : "1 Bedroom"}</li>
          <li>{listing.bathrooms > 1 ? `${listing.bathrooms} Bathrooms` : "1 Bathroom"}</li>
          <li>{listing.parking && "Parking Spot"}</li>
          <li>{listing.furnished && "Furnished"}</li>

          <p className='listingLocationTitle'>Location</p>

          <div className='leafletContainer'>
            <MapContainer
              style={{height: "100%", width: "100%"}}
              center={[listing.geolocation.lat, listing.geolocation.lng]}
              zoom={13}
              scrollWheelZoom={false}
            >
              <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url='https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png'
              />
              <Marker position={[listing.geolocation.lat, listing.geolocation.lng]}>
                <Popup>{listing.location}</Popup>
              </Marker>
            </MapContainer>
          </div>

          {auth.currentUser?.uid !== listing.userRef && (
            <Link
              to={`/contact/${listing.userRef}?listingName=${listing.name}`}
              className='primaryButton'
            >
              Contact Landlord
            </Link>
          )}
        </ul>
      </div>
    </main>
  )
}

export default Listing
