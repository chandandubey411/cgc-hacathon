<<<<<<< HEAD
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
// <<<<<<< HEAD
// import HeroSection from "../components/HeroSection";
// =======
import SnailLoader from '../components/Loader'
// >>>>>>> c38661efdf1c616bfe0e867a70d39eb82648030e

=======
import Issue from "../components/Issue";
import ReportMap from "../components/ReportMap";
import HeroSection from '../components/HeroSection'
>>>>>>> f9611454fee1c2685dec7dbc39365b3870c08b89
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
