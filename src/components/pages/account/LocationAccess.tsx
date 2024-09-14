import { useState, useEffect } from "react";
import { doc, setDoc, updateDoc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { db } from "../../../firebase/firebaseConfig"; // Adjust the type definition for this
import logo from '../../../assets/img/w-logo.png';
import location from '../../../assets/img/location.png';
import Modal from 'react-modal';
import BackButton from '../BackButton';
import { CSSProperties } from 'react';

// Define styles object
const styles: { [key: string]: CSSProperties } = {
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
    border: "none",
    fontWeight: "bold",
    cursor: "pointer",
    float: "right",
  },
};

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
    marginTop: '20px',
  },
};

function LocationAccess() {
  const [locationAllowed, setLocationAllowed] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      setUserId(user.uid);
    } else {
      console.error('User is not authenticated');
    }
  }, []);

  const handleAllowLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocationAllowed(true);
          setLoading(true);

          try {
            if (userId) {
              await saveLocationForUser(userId, latitude, longitude);
              setModalIsOpen(true);
              setTimeout(() => {
                navigate('/signin');
              }, 5000);
            } else {
              console.error('User ID is missing');
              alert('User information is missing');
            }
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
          setModalIsOpen(true);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const saveLocationForUser = async (userId: string, latitude: number, longitude: number) => {
    try {
      const userRef = doc(db, "locations", userId);
      const docSnapshot = await getDoc(userRef);

      const locationData = {
        latitude,
        longitude,
        timestamp: new Date(),
      };

      if (docSnapshot.exists()) {
        await updateDoc(userRef, { location: locationData });
        console.log("Location data updated for user:", userId);
      } else {
        await setDoc(userRef, { location: locationData });
        console.log("User document created and location data saved:", userId);
      }
    } catch (e) {
      console.error("Error saving location to user's document:", e);
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
            <img src={location} alt="Location Icon" className="location-img" />
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
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={modalStyles}>
        <span onClick={closeModal} style={modalStyles.close}>X</span>
        <div style={modalStyles.card}>
          <h2>{locationAllowed ? 'Location Access' : 'Access Denied'}</h2>
          <p>{locationAllowed ? "Current Location! Address captured." : "Please enable location access to continue using the app."}</p>
          <button onClick={closeModal} style={modalStyles.button}>OK</button>
        </div>
      </Modal>
    </div>
  );
}

export default LocationAccess;
