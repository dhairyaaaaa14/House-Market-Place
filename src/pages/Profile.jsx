import React, { useState, useEffect } from "react";
import { getAuth, updateProfile } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { db } from "../firebase.config";
import {
  updateDoc,
  doc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";
import arrowRight from "../assets/svg/keyboardArrowRightIcon.svg";
import homeIcon from "../assets/svg/homeIcon.svg";

import ListingItem from "../components/ListingItem";

const Profile = () => {
  const auth = getAuth();

  const [listings, setListings] = useState({});
  const [loading, setLoading] = useState(true);
  const [changeDetails, setChangeDetails] = useState(false);

  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

  const { name, email } = formData;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserListings = async () => {
      const listingsRef = collection(db, "listings");
      console.log(listingsRef)
      const q = query(
        listingsRef,
        where("useRef", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc")
      )
      // console.log(q)
      const querySnap = await getDocs(q)
      console.log(querySnap)
      let listings = []

      querySnap.forEach((doc) => {
        console.log(doc.data())
        return listings.push({
          id:doc.id,
          data:doc.data()
        })
      })

    
      setListings(listings)
      console.log(listings)
      setLoading(false)
    }

    fetchUserListings();
  }, [auth.currentUser.uid]);

  const onLogout = () => {
    auth.signOut();
    navigate("/");
  };

  const onSubmit = async () => {
    try {
      //Updating display name is firebase
      if (auth.currentUser.displayName !== name) {
        await updateProfile(auth.currentUser, {
          displayName: name,
        });
      }

      //update in firestore

      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, {
        name,
      });
    } catch (error) {
      toast.error("Could not update profile details");
    }
  };

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onDelete = async (listingId) => {

    if(window.confirm('Are you sure you want to delete?'))
    {
      try {
        await deleteDoc(doc(db,'listings',listingId))
        const updatedListings = listings.filter((listing) => listing.id !== listingId)
        setListings(updatedListings)
        toast.success('Successfully deleted listing')
      } catch (error) {
        console.log(error)
      }
    
    }

  }

  const onEdit = (listingId) => {
    navigate(`/edit-listing/${listingId}`)
  }



console.log(listings)
  return (
    <div className="profile">
      <header className="profile">
        <div className="profilehHeader">
          <p className="pageHeader">My Profile</p>
          <button type="button" className="logOut" onClick={onLogout}>
            Logout
          </button>
        </div>
      </header>

      <main>
        <div className="profileDetailHeader">
          <p className="profileDetailsText">Personal Details</p>
          <p
            className="changePersonalDetails"
            onClick={() => {
              changeDetails && onSubmit();
              setChangeDetails((prevState) => !prevState);
            }}
          >
            {changeDetails ? "done" : "change"}
          </p>
        </div>

        <div className="profileCard">
          <form>
            <input
              className={!changeDetails ? "profileName" : "profileNameActive"}
              disabled={!changeDetails}
              value={name}
              onChange={onChange}
              type="text"
              id="name"
            />

            <input
              className={!changeDetails ? "profileEmail" : "profileEmailActive"}
              disabled={!changeDetails}
              value={email}
              onChange={onChange}
              type="text"
              id="email"
            />
          </form>
        </div>
        <Link to="/create-listing" className="createListing">
          <img src={homeIcon} alt="home" />
          <p>Sell or rent your home</p>
          <img src={arrowRight} alt=" arrow right" />
        </Link>

        {!loading && listings?.length > 0 && (
          <>
            <p className="listingText">Your Listings</p>
            <ul className="listingLists">
              {listings.map((listing) => {

                return <ListingItem key={listing.id} listing={listing.data} id={listing.id}
                onDelete={() => onDelete(listing.id)}
                onEdit={() => onEdit(listing.id)}
                 />

              } )}
            </ul>
          </>
        )}
      </main>
    </div>
  );
};

export default Profile;
