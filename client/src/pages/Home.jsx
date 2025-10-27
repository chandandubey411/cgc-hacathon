import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Issue from "../components/Issue";
import ReportMap from "../components/ReportMap";
import HeroSection from '../components/HeroSection'
import HowItWorks from '../components/Working'
import FeaturesSection from '../components/FeaturesSection'
import "leaflet/dist/leaflet.css";


const UserDashboard = () => {
  return (
    <div>
      <HeroSection/>
      <HowItWorks/>
      <FeaturesSection/>
      <Issue />
      <ReportMap />
    </div>
  );
};

export default UserDashboard;
