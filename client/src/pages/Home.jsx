
import "leaflet/dist/leaflet.css";
import Issue from "../components/Issue";
import ReportMap from "../components/ReportMap";
import HeroSection from '../components/HeroSection'
const UserDashboard = () => {
  return (
    <div>
      <HeroSection/>
      <Issue />
      <ReportMap />
    </div>
  );
};

export default UserDashboard;
