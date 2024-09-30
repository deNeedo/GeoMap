import React, {useEffect, useState} from "react";
import {MapContainer, TileLayer, Marker, Popup, useMapEvents} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const MapView = () => {
    const [position, setPosition] = useState({ lat: null, lon: null });
    const [error, setError] = useState(null);

    const LocationLogger = () => {
        useMapEvents({
            click: async (e) => {
                const { lat, lng } = e.latlng;
                const elevation = await fetchElevation(lat, lng);
                console.log("Latitude ", lat, "\nLongitude ", lng, "\nElevation: ", elevation, " meters");
            }
        });
        return null;
    };

    const fetchElevation = async (lat, lng) => {
        try {
            const response = await fetch(`https://api.open-elevation.com/api/v1/lookup?locations=${lat},${lng}`);
            const data = await response.json();
            if (data.results && data.results[0]) {
                return data.results[0].elevation;
            }
        } catch (error) {
            console.error("Error fetching elevation:", error);
            return null;
        }
    };

    const fetchLocation = async () => {
        try {
            const response = await fetch('http://ip-api.com/json/');
            const data = await response.json();
            if (data.status === 'success') {
                setPosition({ lat: data.lat, lon: data.lon });
            } else {
                setError('Unable to fetch location');
            }
        } catch (err) {
            setError('Error fetching location');
        }
    };

    useEffect(() => {
        fetchLocation();
    }, [position]);

    return (
        <>
            {position.lat != null ?
            <MapContainer center={position} zoom={8} style={{height: "100vh", width: "100%"}}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
                />
                <LocationLogger/> {/* This handles the map click event */}
                <Marker position={position}> <Popup> Your IP address location </Popup> </Marker>
                <Marker position={{ lat: 50, lon: 20 }}> <Popup> Latutide: 50 <br/> Longitude: 20 </Popup> </Marker>
            </MapContainer>
            : error} {/* add styling later on */}
        </>

    );
};

export default MapView;