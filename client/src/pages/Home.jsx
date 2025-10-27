
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import SnailLoader from '../components/Loader'

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
