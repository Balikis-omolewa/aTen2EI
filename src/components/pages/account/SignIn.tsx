import { useNavigate } from 'react-router-dom';
import '../../shared/styles.css'; 
import logo from '../../../assets/img/w-logo.png';
import BackButton from '../BackButton';
import { CiLock } from "react-icons/ci";
import { IoFingerPrintSharp } from "react-icons/io5";

const SignIn = () => {
    const navigate = useNavigate();

    const handleSignUpClick = () => {
      navigate('/signup');
    };

    const handleCheckInWithPassword = () => {
        navigate('/checkwithpassword')
    };
    const handleCheckInWithBiometric = () => {
        navigate('/checkinwithbiometric')
    };

  return (
    <div className="card-body">
      <div className='header'>
      <span><BackButton /></span>
        <img src={logo} alt="Logo" className="app-logo" />
      </div>
      <div className='card-content' style={{ height: "50vh"}}>
        <div className='content-info'>
        <h2>WELCOME BACK !</h2>
        <p>Sign In with Password or Fingerprint.</p>
        </div>
       <div style={{ textAlign: "center"}}>
       <button className='check-card' 
       style={{ backgroundColor: "#fff", color: "#4A82DD", marginTop: "40px"}}
       onClick={handleCheckInWithPassword }
       ><span><CiLock className='icon' style={{ fontSize: "1.5rem"}} /></span> SIGN IN WITH PASSWORD</button>
       <button className='check-card' onClick={handleCheckInWithBiometric}><span><IoFingerPrintSharp className='icon' style={{ fontSize: "1.5rem"}} /></span> SIGN IN WITH BIOMETRIC</button>
       <a style={{textDecoration: "underline", fontSize: "15px", cursor: "pointer"}} onClick={handleSignUpClick}>
        New here? Create an Account</a>
       </div>
      </div>
      <button type="button" className='action-btn btn-white' onClick={handleSignUpClick}>SIGN UP</button>
    </div>
  );
};

export default SignIn;
