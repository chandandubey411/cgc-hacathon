import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../Utils";
import { useNavigate } from "react-router-dom";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function LocationPicker({ setLocation }) {
  useMapEvents({
    click(e) {
      setLocation({ latitude: e.latlng.lat, longitude: e.latlng.lng });
    },
  });
  return null;
}

const categories = [
  "Garbage",
  "Water Leak",
  "Road Safety",
  "Pothole",
  "Streetlight",
  "Other",
];

const ReportIssue = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: categories[0],
    image: null,
    latitude: 28.6448,
    longitude: 77.216721,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleSearch = async (e) => {
    setSearch(e.target.value);
    if (e.target.value.trim().length < 3) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          e.target.value
        )}`
      );
      const data = await res.json();
      setSearchResults(data);
    } catch {
      setSearchResults([]);
    }
    setSearching(false);
  };

  const handleResultClick = (place) => {
    setForm({
      ...form,
      latitude: parseFloat(place.lat),
      longitude: parseFloat(place.lon),
    });
    setSearch(place.display_name);
    setSearchResults([]);
  };

  const validate = () => {
    let errs = {};
    if (!form.title) errs.title = "Title is required";
    if (!form.description) errs.description = "Description is required";
    if (!form.image) errs.image = "Please upload an image";
    return errs;
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, image: file });
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  const setLocation = ({ latitude, longitude }) => {
    setForm({ ...form, latitude, longitude });
  };

  const handleDetectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setForm({
            ...form,
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
          handleSuccess("Location fetched!");
        },
        () => handleError("Unable to fetch location.")
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    const data = new FormData();
    for (let key in form) data.append(key, form[key]);

    try {
      const res = await fetch("https://cgc-hacathon-backend.onrender.com/api/issues/", {
        method: "POST",
        body: data,
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      if (res.ok) {
        handleSuccess("Issue reported successfully!");
        setTimeout(() => navigate("/user/dashboard"), 1200);
      } else handleError(result.message || "Something went wrong!");
    } catch {
      handleError("Failed to submit issue.");
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center p-8 backdrop-blur-lg bg-transparent">
      <div className="backdrop-blur-xl bg-white/50 shadow-2xl rounded-3xl flex flex-col md:flex-row w-full max-w-6xl overflow-hidden border border-white/40">
        
        {/* Left Form Section */}
        <div className="flex-1 p-8 space-y-6">
          <h2 className="text-3xl font-bold text-gray-800 text-center">
            🧾 Report an Issue
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
            <div>
              <label className="font-semibold text-gray-700">Title</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                className={`w-full p-3 mt-1 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 ${
                  errors.title ? "border-red-500" : "border-gray-300"
                }`}
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                className={`w-full p-3 mt-1 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 ${
                  errors.description ? "border-red-500" : "border-gray-300"
                }`}
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full p-3 mt-1 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
              >
                {categories.map((cat) => (
                  <option key={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-gray-700">Upload Image</label>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageChange}
                className="w-full mt-1"
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="preview"
                  className="mt-3 h-32 w-full object-cover rounded-lg shadow-md"
                />
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 text-white py-3 mt-2 rounded-lg font-semibold hover:bg-blue-700 transition-transform transform hover:scale-105"
            >
              {submitting ? "Submitting..." : "Submit Issue"}
            </button>
          </form>
        </div>

        {/* Right Map Section */}
        <div className="flex-1 p-8 bg-white/40 border-l border-gray-200 relative">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-4">
            📍 Select Location
          </h2>

          <input
            type="text"
            placeholder="Search location..."
            value={search}
            onChange={handleSearch}
            className="w-full p-3 border rounded-lg shadow-sm mb-3 focus:ring-2 focus:ring-blue-400"
          />

          {searching && <p className="text-gray-500 text-sm">Searching...</p>}
          {searchResults.length > 0 && (
            <ul className="absolute bg-white border rounded-lg shadow-md w-[90%] z-20 max-h-48 overflow-y-auto">
              {searchResults.map((result) => (
                <li
                  key={result.place_id}
                  onClick={() => handleResultClick(result)}
                  className="px-3 py-2 hover:bg-blue-500 hover:text-white cursor-pointer text-sm"
                >
                  {result.display_name}
                </li>
              ))}
            </ul>
          )}

          <button
            onClick={handleDetectLocation}
            className="w-full bg-green-600 text-white py-2 rounded-lg mt-2 hover:bg-green-700 transition"
          >
            Use My Current Location
          </button>

          <div className="h-80 mt-4 rounded-xl overflow-hidden border border-gray-300 shadow-md">
            <MapContainer
              center={[form.latitude, form.longitude]}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <LocationPicker setLocation={setLocation} />
              <Marker position={[form.latitude, form.longitude]} />
            </MapContainer>
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default ReportIssue;
