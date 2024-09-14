import { useState, useEffect } from 'react';
import moment from 'moment'; // For formatting time
import { CiLock } from "react-icons/ci";
import checkIn from '../../assets/img/in.png';
import checkOut from '../../assets/img/out.png';
import Hrs from '../../assets/img/hrs.png';
import avatar from '../../assets/img/avatar.png';
import { IoIosCheckmarkCircle } from "react-icons/io";
import BackButton from '../pages/BackButton';

const CheckInOutPassword = () => {
  const [time, setTime] = useState(moment().format('h:mm a')); // show current time
  const [date, setDate] = useState(moment().format('MMMM Do, YYYY')); // show current date
  const [checkInTime, setCheckInTime] = useState<string | null>(null); // this stores check-in time
  const [checkOutTime, setCheckOutTime] = useState<string | null>(null); // this stores check-out time
  const [totalHours, setTotalHours] = useState<string | null>(null); // this displays total hours
  const [password, setPassword] = useState(''); // Password input
  const [errorMessage, setErrorMessage] = useState(''); // Error message
  const [userImage, setUserImage] = useState<string | null>(null); // Stores user's uploaded image
  const [greetUser, setGreetUser] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(moment().format('h:mm a')); // Update current time every second
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Handle profile image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUserImage(imageUrl); // Set user image
    }
  };

  const handleGreetUser = () => {
    const currentHour = moment().hour(); 
    let greeting = '';

    if (currentHour < 12) {
      greeting = 'Morning';
    } else if (currentHour < 18) {
      greeting = 'Afternoon';
    } else {
      greeting = 'Evening';
    }
    setGreetUser(greeting); 
  };

  useEffect(() => {
    handleGreetUser(); // Call function when component mounts
  }, []);

  const handleAction = () => {
    if (password === '1234') { // Will later integrate user password to check in/out
      if (!checkInTime) {
        // If user is checking in
        const currentTime = moment().format('h:mm a');
        setCheckInTime(currentTime);
        setErrorMessage('');
      } else if (!checkOutTime) {
        // If user is checking out
        const currentTime = moment();
        setCheckOutTime(currentTime.format('h:mm a'));

        const checkInMoment = moment(checkInTime, 'h:mm a');
        const diffInHours = currentTime.diff(checkInMoment, 'hours', true);
        setTotalHours(diffInHours ? diffInHours.toFixed(2) : '--:--'); // Calculates total time in hours
      }
      setPassword(''); // Clear the password input after successful action
    } else {
      setErrorMessage('Incorrect password. Try again.');
    }
  };

  return (
    <div className="card-body">
        <span><BackButton style={{color: '#4A82DD'}} /></span>
      <div className="card-inner">   
      <div className="heading">
        <div className="greeting">
          <h2>Hey Balikis!</h2>
          <p>Good {greetUser} ! {checkInTime ? 'Remember to Check Out when leaving.' : ' Check In and start your day.'}</p> {/* Adjust greeting */}
        </div>
        <div className="profile-picture">
          <label htmlFor="file-upload">
            {userImage ? (
              <img src={userImage} alt="Profile" style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              <img src={avatar} alt="Avatar" style={{ width: '70px', height: '70px', borderRadius: '50%', cursor: 'pointer' }} />
            )}
          </label>
          <input
            id="file-upload"
            type="file"
            style={{ display: 'none' }}
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
      </div>

      <div className="time-display">
        <h1>{time}</h1> {/* Display current time */}
        <p>{date}</p> {/* Display current date */}
      </div>

      <div className="checkin-section">
        {/* Toggle between Check In and Check Out */}
        <h3>{checkInTime ? <span style={{ color: '#E35B5B' }}>Check Out</span> : <span style={{ color: '#55B841' }}>Check In</span>}</h3> 
        
        <div className="form-group" style={{ marginTop: '8%' }}>
          <div className="form-field">
            <CiLock className="icon" style={{ fontSize: "1.8rem", color: "#467AFB" }} />
            <input
              type="password"
              placeholder="Input Password"
              value={password}
              className="input"
              onChange={(e) => setPassword(e.target.value)}
              disabled={!!checkOutTime} // Disable if already checked out
            />
            <IoIosCheckmarkCircle
              style={{ color: '#55B841', fontSize: '2rem', cursor: 'pointer' }}
              onClick={handleAction}
            />
          </div>
          {errorMessage && <p className='incorrectPass'>{errorMessage}</p>}
        </div>
      </div>

      <div className="status-section">
        <div>
          <span><img src={checkIn} style={{ width: '33px' }} alt="CheckIn" /></span>
          <h2>{checkInTime || '--:--'}</h2> {/* Show Check In time */}
          <p>Check In</p>
        </div>
        <div>
          <span><img src={checkOut} style={{ width: '28px' }} alt="CheckOut" /></span>
          <h2>{checkOutTime || '--:--'}</h2> {/* Show Check Out time */}
          <p>Check Out</p>
        </div>
        <div>
          <span><img src={Hrs} style={{ width: '33px' }} alt="Hrs" /></span>
          <h2>{totalHours || '--:--'}</h2> {/* Show Total Hours */}
          <p>Total Hrs</p>
        </div>
      </div>

      <div className="footer-nav check-card">
        <button>Home</button>
        <button>History</button>
        <button>Profile</button>
      </div>
      </div>
    </div>
  );
};

export default CheckInOutPassword;
