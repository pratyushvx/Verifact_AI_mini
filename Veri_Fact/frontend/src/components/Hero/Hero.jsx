import './Hero.css';
import arrow_btn from "../../Assets/arrow_btn.png";
import play_icon from "../../Assets/play_icon.png";
import pause_icon from "../../Assets/pause_icon.png";
import PropTypes from "prop-types";

const Hero = ({ heroData, setHeroCount, heroCount, setPlayStatus, playStatus }) => {
  return (
    <div className='hero'>
      {/* Hero Text */}
      <div className="hero-text">
        <p>{heroData.text1}</p>
        <p>{heroData.text2}</p>
      </div>

      {/* Explore Button (Bottom Left)
      <div className="hero-explore" onClick={() => console.log("Explore Clicked")}>
        <p>Explore the feature</p>
        <img src={arrow_btn} alt="Explore arrow" />
      </div> */}

      {/* Navigation Dots */}
      <div className="hero-dot-play">
        <ul className="hero-dots">
          {[0, 1, 2].map((index) => (
            <li 
              key={index}
              onClick={() => setHeroCount(index)}
              className={heroCount === index ? "hero-dot orange" : "hero-dot"}
            ></li>
          ))}
        </ul>
      </div>

      {/* Play/Pause Button */}
      <div className="hero-play">
        <img 
          onClick={() => setPlayStatus(!playStatus)}
          src={playStatus ? pause_icon : play_icon}
          alt="Play/Pause"
          className="play-icon"
        />
        <p>See the video</p>  
      </div>
    </div>
  );
};

// ✅ PropTypes Validation
Hero.propTypes = {
  heroData: PropTypes.shape({
    text1: PropTypes.string.isRequired,
    text2: PropTypes.string.isRequired
  }).isRequired,
  setHeroCount: PropTypes.func.isRequired,
  heroCount: PropTypes.number.isRequired,
  setPlayStatus: PropTypes.func.isRequired,
  playStatus: PropTypes.bool.isRequired,
};

export default Hero;
