import { useNavigate } from 'react-router-dom';
import '../welcomePage/SplashScreen.css'; 
import logo from '../../../assets/img/logo.png';

const SplashScreen = () => {
  const navigate = useNavigate();

  const handleSignUpClick = () => {
    navigate('/signup');
  };

  const handleSignInClick = () => {
    navigate('/signin');
  };

  return (
    <div className="splash-screen">
      <div className="splash-content">
        <img src={logo} alt="Logo" className="logo" /> 
      </div>
      <div className="splash-footer">
        <button className="btn" onClick={handleSignInClick}>Sign In</button>
        <button className="btn" onClick={handleSignUpClick}>Sign Up</button>
      </div>
    </div>
  );
};

export default SplashScreen;
