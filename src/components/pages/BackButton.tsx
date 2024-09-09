import { useNavigate } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io';

const BackButton = ({ style, ...props }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <span onClick={handleBack} className="back-arrow" style={style} {...props}>
      <IoIosArrowBack />
    </span>
  );
};

export default BackButton;
