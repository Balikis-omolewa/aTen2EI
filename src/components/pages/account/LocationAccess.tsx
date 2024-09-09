import { useState } from "react";
import { collection, addDoc, query, where, getDocs, setDoc, doc } from "firebase/firestore"; 
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import { db } from "../../../firebase/firebaseConfig"; 
import logo from '../../../assets/img/w-logo.png';
import location from '../../../assets/img/location.png';
import Modal from 'react-modal';
import BackButton from '../BackButton';

Modal.setAppElement('#root');

function LocationAccess() {
  const [locationAllowed, setLocationAllowed] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const navigate = useNavigate(); // Initialize navigate for redirect

  // Function to get location and store it in Firestore
  const handleAllowLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocationAllowed(true);
          setLoading(true);

          try {
            // Store location in Firestore
            await saveLocationAndUserData(latitude, longitude, { userId: "12345", userName: "John Doe" }); // Example user data

            // After saving location, open modal and start redirect timer
            setModalIsOpen(true);
            setTimeout(() => {
              navigate('/signin'); // Redirect to sign-in page after 5 seconds
            }, 5000); // 5 seconds delay
          } catch (error) {
            console.error('Error storing location to Firestore:', error);
            alert("Error saving location data. Check console for details.");
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          setLocationAllowed(false);
          console.error("Location access denied:", error);
          setModalIsOpen(true); // Open modal if access denied
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  // Function to check if the location exists, and store user data
  const saveLocationAndUserData = async (latitude, longitude, userData) => {
    try {
      const locationsRef = collection(db, "locations");

      // Query Firestore to check if location exists
      const q = query(locationsRef, where("latitude", "==", latitude), where("longitude", "==", longitude));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        // Location does not exist, create new document for location
        const locationDocRef = await addDoc(locationsRef, {
          latitude,
          longitude,
          timestamp: new Date(),
          users: [userData] // Store user data as an array under 'users'
        });
        console.log("New location created with ID: ", locationDocRef.id);
      } else {
        // Location exists, update existing document with user data
        querySnapshot.forEach(async (docSnapshot) => {
          const locationDocRef = doc(db, "locations", docSnapshot.id);
          const locationData = docSnapshot.data();

          // Check if user data already exists
          const existingUsers = locationData.users || [];
          const userExists = existingUsers.find(user => user.userId === userData.userId);

          if (!userExists) {
            // Add new user to the 'users' array
            await setDoc(locationDocRef, {
              users: [...existingUsers, userData]
            }, { merge: true }); // Use merge to preserve existing fields
            console.log(`User data added to location ${docSnapshot.id}`);
          } else {
            console.log(`User already exists for location ${docSnapshot.id}`);
          }
        });
      }
    } catch (e) {
      console.error("Error saving location or user data to Firestore:", e);
    }
  };

  const handleDenyLocation = () => {
    setLocationAllowed(false);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div className="card-body">
      <div className="header">
        <span><BackButton /></span>
        <img src={logo} alt="Logo" className="app-logo" />
      </div>
      <div className="card-content card-content-bottom">
        <div className="mini-card">
          <div>
            <img
              src={location}
              alt="Location Icon"
              className="location-img"
            />
          </div>
          <h4 style={styles.enable}>ENABLE LOCATION</h4>
          <p style={styles.text}>
            Please enable location services to ensure accurate attendance tracking. 
            This helps us verify your presence and provides a smoother experience with the app.
          </p>
          <button onClick={handleAllowLocation} className="check-card" style={{ padding: "15px" }} disabled={loading}>
            {loading ? "Loading..." : "ALLOW WHILE USING APP"}
          </button>
          <button onClick={handleDenyLocation} className="check-card" style={styles.secondaryButton}>
            DON'T ALLOW
          </button>
        </div>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={modalStyles}
      >
        <span onClick={closeModal} style={modalStyles.close}>X</span>
        <div style={modalStyles.card}>
          <h2>{locationAllowed ? 'Location Access' : 'Access Denied'}</h2>
          <p>{locationAllowed ? `Current Location! Address captured.` : "Please enable location access to continue using the app."}</p>
          <button onClick={closeModal} style={modalStyles.button}>OK</button>
        </div>
      </Modal>
    </div>
  );
}

// Modal styles
const modalStyles = {
  content: {
    top: '55%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    transform: 'translate(-50%, -50%)',
    padding: '20px',
    borderRadius: '12px',
    width: '80%',
    maxWidth: '400px',
    textAlign: 'center',
    zIndex: '10000',
    position: 'fixed',
    border: 'none',
    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
  },
  overlay: {
    zIndex: '10000',
    position: 'fixed',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
  },
  card: { 
    marginBottom: '50px',
    marginTop: '60px',
  },
  close: {
    padding: '10px',
    color: '#0b0b0b',
    fontSize: '20px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '500',
    float: 'right',
  },
  button: {
    width: '80%',
    padding: '15px',
    backgroundColor: '#4A82DD',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '20px'
  },
};

const styles = {
  enable: {
    color: "#4A82DD",
    fontSize: "20px",
    marginTop: "20px",
    fontWeight: "500",
  },
  text: {
    color: "#7d7d7d",
    fontSize: "14px",
  },
  secondaryButton: {
    backgroundColor: "#fff",
    color: "#4A82DD",
    padding: "15px",
  },
};

export default LocationAccess;
