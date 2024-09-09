import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SplashScreen from './components/pages/welcomePage/SplashScreen';
import SignUp from './components/pages/account/SignUp';
import SignIn from './components/pages/account/SignIn';
import VerifyAccount from './components/pages/account/VerifyAccount';
import LocationAccess from './components/pages/account/LocationAccess';
import CheckInOutPassword from './components/checkInCheckOut/checkInCheckOutPassword';
import CheckWithBiometric from './components/checkInCheckOut/checkInCheckOutBiometric';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/verifyaccount" element={<VerifyAccount />} />
        <Route path="/location-access" element={<LocationAccess />} />
        <Route path="/checkwithpassword" element={<CheckInOutPassword />} />
        <Route path="/checkinwithbiometric" element={<CheckWithBiometric />} />
        
      </Routes>
    </Router>
  );
}

export default App;
