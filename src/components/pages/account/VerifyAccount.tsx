import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import logo from '../../../assets/img/w-logo.png'; 
import { IoIosArrowBack } from "react-icons/io";

const VerifyEmail = () => {
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');
  const [verificationStatus, setVerificationStatus] = useState('Checking verification status...');
  const [polling, setPolling] = useState(true);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const checkVerificationStatus = async () => {
      const user = auth.currentUser;
      if (user) {
        await user.reload(); // Refresh user data
        if (user.emailVerified) {
          setIsVerified(true);
          setVerificationStatus('Email Verified');
          setPolling(false); // Stop polling if verified
        } else {
          setVerificationStatus('Email Not Verified');
        }
      }
    };

    const intervalId = setInterval(() => {
      if (polling) {
        checkVerificationStatus();
      }
    }, 30000); // Check every 30 seconds

    // Clean up interval on component unmount or when polling is stopped
    return () => clearInterval(intervalId);
  }, [auth.currentUser, polling]);

  const handleBack = () => {
    navigate(-1);
  };

  const resendVerificationEmail = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        await user.sendEmailVerification();
        setError('Verification email sent. Please check your inbox.');
      } catch (err) {
        setError('Failed to send verification email.');
      }
    }
  };

  const handleVerify = () => {
    if (isVerified) {
      navigate('/location-access');
    } else {
      resendVerificationEmail();
    }
  };

  return (
    <div className="card-body">
      <div className="header">
        <span className="back-arrow" onClick={handleBack}>
          <IoIosArrowBack />
        </span>
        <img src={logo} alt="Logo" className="app-logo" />
      </div>
      <div className="card-content" style={{ height: "50vh" }}>
        <div className='content-info'>
          <h2>VERIFICATION STATUS</h2>
          <p className='mb-5 p-1'>Please kindly know that an email has been <br /> sent with a verification link.</p>
        </div>
        <div className="form-field mt-5 center">
          <input type="text" className='input text-center' style={{color: 'green'}} readOnly value={verificationStatus} />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button className="check-card mt-4" onClick={handleVerify}>
          {isVerified ? 'Proceed' : 'Verify Again'}
        </button>
      </div>
    </div>
  );
};

export default VerifyEmail;
