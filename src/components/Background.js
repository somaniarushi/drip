import person1 from '../assets/people/person-1.png';
import person2 from '../assets/people/person-2.png';
import person3 from '../assets/people/person-3.png';
import person4 from '../assets/people/person-4.png';

function Background() {
  return (
    <div className="background">
      <img src={person2} alt="decoration" className="absolute opacity-50 bg-image sm-hidden" style={{left: "35%", bottom: "-8%"}} />
      <img src={person1} alt="decoration" className="absolute opacity-20 bg-image sm-hidden" style={{left: "45%", bottom: "10%"}} />
      <img src={person3} alt="decoration" className="absolute opacity-30 bg-image sm-hidden" style={{left: "30%", top: "-10%"}} />
      <img src={person4} alt="decoration" className="absolute opacity-40 bg-image sm-hidden" style={{left: "-5%", bottom: "10%"}} />
    </div>
  )
}

export default Background;