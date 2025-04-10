import PropTypes from "prop-types";
import "./Background.css";
import video1 from "../../Assets/video1.mp4";
import image1 from "../../Assets/image1.png";
import image2 from "../../Assets/image2.png";
import image3 from "../../Assets/image3.png";

const Background = ({ playStatus, heroCount }) => {
    if (playStatus) {
        return (
            <video className='background' autoPlay loop muted>
                <source src={video1} type='video/mp4' />
            </video>
        );
    } else {
        return (
            <img
                className='background'
                src={heroCount === 0 ? image1 : heroCount === 1 ? image2 : image3}
                alt="Background"
            />
        );
    }
};

// ✅ PropTypes validation
Background.propTypes = {
    playStatus: PropTypes.bool.isRequired,  // Must be a boolean
    heroCount: PropTypes.number.isRequired, // Must be a number
};

export default Background;
