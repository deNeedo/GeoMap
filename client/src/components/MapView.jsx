import React, {useEffect, useState} from "react";
import {MapContainer, TileLayer, Marker, Popup, useMapEvents, Polyline} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {Line} from 'react-chartjs-2';
import {Chart, registerables} from 'chart.js';
import Styles from "../styles/MapView.module.css"

Chart.register(...registerables);

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const MapView = () => {
    const [position, setPosition] = useState({lat: null, lon: null});
    const [markers, setMarkers] = useState([]);
    const [lineCoordinates, setLineCoordinates] = useState([]);
    const [distance, setDistance] = useState(null);
    const [elevationData, setElevationData] = useState([]);
    
    const saveCollection = async () => {
        if (markers.length === 0) {
            console.log("Add some markers before saving...")
        } else {
            try {
                const response = await fetch(`http://10.147.17.201:8080/saveCollection`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Username": "Test"
                    },
                    body: JSON.stringify(markers),
                });
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await response.text();
                console.log("Success: ", data);
            } catch (error) {
                console.error("Error: ", error);
            }
        }
    }

    const loadCollection = async () => {
        if (markers.length !== 0) {
            console.log("Clear all the markers before loading...")
        } else {
            try {
                const response = await fetch(`http://10.147.17.201:8080/loadCollection`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Username": "Test"
                    },
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setMarkers(data);
            } catch (error) {
                console.error("Error: ", error);
            }
        }
    };

    const greatCirclePoints = (lat1, lon1, lat2, lon2) => {
        const points = [];
        const R = 6371;
        const slat1 = Math.sin(lat1 * (Math.PI / 180));
        const slat2 = Math.sin(lat2 * (Math.PI / 180));
        const clat1 = Math.cos(lat1 * (Math.PI / 180));
        const clat2 = Math.cos(lat2 * (Math.PI / 180));
        const cdLon = Math.cos((lon2 - lon1) * (Math.PI / 180));
        const cDel = slat1 * slat2 + clat1 * clat2 * cdLon
        const c = Math.acos(cDel)
        setDistance(R * c)
        const numPoints = Math.floor(R * c)
        const sinDLon = Math.sin((lon2 - lon1) * (Math.PI / 180))
        const alph = Math.atan2(sinDLon * clat1 * clat2, slat2 - slat1 * cDel)
        for (let m = 0; m <= numPoints; m++) {
            const del_m = c / numPoints * m;
            const slat_m = slat1 * Math.cos(del_m) + clat1 * Math.sin(del_m) * Math.cos(alph);
            const lat_m = Math.asin(slat_m)
            const del_lon_m = Math.atan2(Math.sin(alph) * Math.sin(del_m) * clat1, Math.cos(del_m) - slat1 * slat_m);
            const lon_m = lon1 + del_lon_m * (180 / Math.PI);
            points.push([lat_m * (180 / Math.PI), lon_m]);
        }
        return points;
    };

    const LocationLogger = () => {
        useMapEvents({
            click: async (e) => {
                const {lat, lng} = e.latlng;
                const elev = await fetchElevation(lat, lng);
                setMarkers([...markers, {lat, lng, elev}]);
                if (markers.length > 0) {
                    const lastMarker = markers[markers.length - 1];
                    const points = greatCirclePoints(lastMarker.lat, lastMarker.lng, lat, lng);
                    setLineCoordinates(points);
                    await fetchElevationAlongPath(points);
                }
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

    const fetchElevationAlongPath = async (points) => {
        function delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        const elevations = [];
        for (const point of points) {
            const elev = await fetchElevation(point[0], point[1]);
            elevations.push(elev);
            await delay(200);
        }
        setElevationData(elevations);
    };

    const fetchLocation = async () => {
        try {
            const response = await fetch(`https://get.geojs.io/v1/ip/geo.json`);
            const data = await response.json();
            setPosition({lat: data.latitude, lon: data.longitude});
        } catch (err) {
            setPosition({lat: null, lon: null});
        }
    };

    useEffect(() => {
        fetchLocation();
    }, []);

    useEffect(() => {
        console.log(distance);
    }, [distance]);

    const data = {
        labels: lineCoordinates.map((_, index) => index + 1),
        datasets: [
            {
                label: 'Elevation (m)',
                data: elevationData,
                fill: false,
                backgroundColor: 'blue',
                borderColor: 'blue',
            },
        ],
    };

    const dateLineCoordinates = [
        [90, 180],
        [-90, 180], 
    ];

    const dateLineCoordinates2 = [
        [90, -180],
        [-90, -180],
    ];

    return (
        <>
        {position.lat != null ? (
            <div className={Styles.container}>
                <div className={Styles.map}>
                        <MapContainer style={{height:"100%", width:"100%"}} center={position} zoom={8} worldCopyJump={true}>
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
                            {lineCoordinates.length > 0 && (
                                <Polyline positions={lineCoordinates} color="blue" />
                            )}
                            <Polyline positions={dateLineCoordinates} color="red" dashArray="10, 10" />
                            <Polyline positions={dateLineCoordinates2} color="red" dashArray="10, 10" />
                        </MapContainer>
                </div>
                <div className={Styles.bottomMenu}>
                    <button onClick={saveCollection}> Save collection </button>
                    <button onClick={loadCollection}> Load collection </button>
                    <div>
                        <h3> Terrain Profile </h3>
                        <Line data={data} />
                    </div>
                </div>
            </div>
        ) : "Error while fetching your IP location"} </>
    );
};

export default MapView;