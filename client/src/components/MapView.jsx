import React, {useEffect, useState} from "react";
import {MapContainer, TileLayer, Marker, Popup, useMapEvents} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Styles from "../styles/MapView.module.css"

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const MapView = () => {
    // IP coords
    const [position, setPosition] = useState({lat: null, lon: null});
    // list of markers
    const [markers, setMarkers] = useState([]);

    const saveCollection = async () => {
        if (markers.length === 0) {
            console.log("Add some markers before saving...")
        } else {
            try {
                const response = await fetch("http://10.147.17.201:8080/saveCollection", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        'Username': 'Test'
                    },
                    body: JSON.stringify(markers),
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.text(); // Parse the JSON response
                console.log('Success:', data);
            } catch (error) {
                console.error('Error:', error);
            }
        }
    }

    const loadCollection = () => {
        console.log("Loading...")
    }

    const LocationLogger = () => {
        useMapEvents({
            click: async (e) => {
                const {lat, lng} = e.latlng;
                const elev = await fetchElevation(lat, lng);
                setMarkers([...markers, {lat, lng, elev}]);
            }
        });
        return null;
    };

    const deleteMarker = (index) => {
        setMarkers(markers.filter((_, i) => i !== index));
    };

    const fetchElevation = async (lat, lng) => {
        try {
            const response = await fetch(`https://api.open-elevation.com/api/v1/lookup?locations=${lat},${lng}`);
            const data = await response.json();
            if (data.results && data.results[0]) {
                return data.results[0].elevation
            }
        } catch (error) {
            return null
        }
    };

    const fetchLocation = async () => {
        try {
            const response = await fetch('https://get.geojs.io/v1/ip/geo.json');
            const data = await response.json();
            setPosition({lat: data.latitude, lon: data.longitude});
        } catch (err) {
            setPosition({lat: null, lon: null});
        }
    };

    useEffect(() => {
        fetchLocation();
    }, [position]);

    return (
        <div className={Styles.container}>
            {position.lat != null ? (
                <>
                    <div className={Styles.map}>
                            <MapContainer style={{height:"100%", width:"100%"}} center={position} zoom={8}>
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
                                />
                                <LocationLogger />
                                {markers.map((marker, index) => (
                                    <Marker key={index} position={marker}>
                                        <Popup>
                                            <p> Latitude: {marker.lat} </p>
                                            <p> Longitude: {marker.lng} </p>
                                            <p> Elevation: {marker.elev} </p>
                                            <button onClick={(e) => {e.stopPropagation(); deleteMarker(index);}}> Delete </button>
                                        </Popup>
                                    </Marker>
                                ))}
                                <Marker position={position}> <Popup> Your IP address location </Popup> </Marker>
                            </MapContainer>
                    </div>
                    <div className={Styles.bottomMenu}>
                        <button onClick={saveCollection}> Save collection </button>
                        <button onClick={loadCollection}> Load collection </button>
                    </div>
                </>
            ) : ("Error while fetching your IP location")}
        </div>
    );
};

export default MapView;