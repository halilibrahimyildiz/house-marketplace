import React, {useEffect, useState} from "react"
import {useNavigate} from "react-router-dom"
import {collection, getDocs, limit, orderBy, query} from "firebase/firestore"
import {A11y, Navigation, Pagination, Scrollbar} from "swiper/modules"
import {Swiper, SwiperSlide} from "swiper/react"

import {db} from "../firebase.config"

import Spinner from "./Spinner"

import "swiper/swiper-bundle.css"

function Slider() {
  const [loading, setLoading] = useState(false)
  const [listings, setListings] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    const fetchListings = async () => {
      const listingsRef = collection(db, "listings")
      const q = query(listingsRef, orderBy("timestamp", "desc"), limit(5))

      const querrSnap = await getDocs(q)
      let listings = []
      querrSnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        })
      })

      setListings(listings)
      setLoading(false)
    }
    fetchListings()
  }, [])

  if (loading) return <Spinner />

  return (
    listings && (
      <>
        <p className='exploreHeading'>Recomended</p>
        <Swiper
          modules={[A11y, Navigation, Pagination, Scrollbar]}
          slidesPerView={1}
          pagination={{clickable: true}}
          resizeObserver={true}
          aspectRatio={16 / 9}
        >
          {listings.map(({data, id}) => (
            <SwiperSlide
              key={id}
              onClick={() => navigate(`/category/${data.type}/${id}`)}
            >
              <div
                className='swiperSlideDiv'
                style={{
                  background: `url(${data.imageUrls[0]}) center no-repeat`,
                  backgroundSize: "cover",
                }}
              >
                <p className='swiperSlideText'>{data.name}</p>
                <p className='swiperSlidePrice'>
                  ${data.discountedPrice ?? data.regularPrice}
                  {data.type === "rent" && "/month"}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </>
    )
  )
}

export default Slider
