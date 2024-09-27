import React, {useEffect, useState} from "react";
import {MapContainer, TileLayer, Marker, Popup} from "react-leaflet";
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

    useEffect(() => {
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
        fetchLocation();
    }, []);

    return (
        <>
            {position.lat != null ?
            <MapContainer center={position} zoom={13} style={{height: "100vh", width: "100%"}}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
                />
                <Marker position={position}>
                    <Popup> A pretty CSS3 popup. <br /> Easily customizable. </Popup>
                </Marker>
            </MapContainer>
            : error} {/* add styling later on */}
        </>

    );
};

export default MapView;