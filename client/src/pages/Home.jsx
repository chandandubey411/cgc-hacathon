import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Issue from "../components/Issue";
import ReportMap from "../components/ReportMap";
import HeroSection from '../components/HeroSection'
import "leaflet/dist/leaflet.css";


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
