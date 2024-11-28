import React, {useCallback, useEffect, useState} from "react";
import {MapContainer, TileLayer, Marker, Popup, useMapEvents, Polyline} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {Line} from 'react-chartjs-2';
import {Chart, registerables} from 'chart.js';
import Styles from "../styles/Home.module.css"
import {useAuth} from "../components/AuthContext.jsx";

Chart.register(...registerables);

const chart_options = {
    responsive: true,
    plugins: {
        legend: {
            position: "bottom"
        },
        title: {
            display: true,
            text: "Terrain Profile",
        },
    },
};

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const Home = () => {
    const {authToken, logout, serverIP, serverPORT} = useAuth();
    const [message, setMessage] = useState("No errors so far");
    const [distance, setDistance] = useState("0km");
    const [area, setArea] = useState("0km^2")
    const [position, setPosition] = useState({lat: null, lon: null});
    const [markers, setMarkers] = useState([]);
    const [lineCoordinates, setLineCoordinates] = useState([]);
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [{
            label: "Elevation (m)",
            data: [],
            fill: false,
        }]
    })

    // const serverIP = process.env.REACT_APP_SERVER_IP;
    // const serverPORT = process.env.REACT_APP_SERVER_PORT;

    const handleLogout = async () => {
        try {
            await fetch(`http://${serverIP}:${serverPORT}/logout1`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Auth-Token": authToken
                }
            });
            logout()
        } catch (error) {
            console.error("Unexpected error during logout: ", error);
        }
    };

    const saveCollection = async () => {
        if (markers.length === 0) {
            console.log("Add some markers before saving..."); return;
        }
        try {
            const response = await fetch(`http://${serverIP}:${serverPORT}/saveCollection`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Auth-Token": authToken
                },
                body: JSON.stringify(markers),
            });
            console.log(response)
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.text();
            console.log("Success: ", data);
        } catch (error) {
            console.error("Error: ", error);
        }
    }

    const loadCollection = async () => {
        if (markers.length !== 0) {
            console.log("Clear all the markers before loading..."); return;
        }
        try {
            const response = await fetch(`http://${serverIP}:${serverPORT}/loadCollection`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Auth-Token": authToken
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
    };

    const saveCollectionLocally = () => {
        if (markers.length === 0) {
            console.log("Add some markers before saving..."); return;
        }
        const csvContent = "data:text/csv;charset=utf-8," 
            + markers.map(marker => `${marker.lat},${marker.lng},${marker.elev}`).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "markers.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const loadCollectionLocally = () => {
        let input = document.createElement("input");
        input.type = "file"; input.accept = ".csv"
        input.addEventListener('change', (event) => {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target.result;
                const lines = text.split("\n");
                const loadedMarkers = lines.map(line => {
                    const [lat, lng, elev] = line.split(",").map(Number);
                    return {lat, lng, elev};
                }).filter(marker => !isNaN(marker.lat) && !isNaN(marker.lng) && !isNaN(marker.elev));
                setMarkers(loadedMarkers);
            };
            reader.readAsText(file);
        });
        input.click()
    }

    const greatCirclePoints = (lat1, lon1, lat2, lon2, flag) => {
        const points = [[lat1, lon1]];
        const R = 6371;
        const slat1 = Math.sin(lat1 * (Math.PI / 180));
        const slat2 = Math.sin(lat2 * (Math.PI / 180));
        const clat1 = Math.cos(lat1 * (Math.PI / 180));
        const clat2 = Math.cos(lat2 * (Math.PI / 180));
        const cdLon = Math.cos((lon2 - lon1) * (Math.PI / 180));
        const cDel = slat1 * slat2 + clat1 * clat2 * cdLon
        const c = Math.acos(cDel)
        const distance = R * c;
        const numPoints = Math.floor(R * c)
        const sinDLon = Math.sin((lon2 - lon1) * (Math.PI / 180))
        const alph = Math.atan2(sinDLon * clat1 * clat2, slat2 - slat1 * cDel)
        for (let m = 1; m <= numPoints - 2; m++) {
            const del_m = c / numPoints * m;
            const slat_m = slat1 * Math.cos(del_m) + clat1 * Math.sin(del_m) * Math.cos(alph);
            const lat_m = Math.asin(slat_m)
            const del_lon_m = Math.atan2(Math.sin(alph) * Math.sin(del_m) * clat1, Math.cos(del_m) - slat1 * slat_m);
            const lon_m = lon1 + del_lon_m * (180 / Math.PI);
            points.push([lat_m * (180 / Math.PI), lon_m]);
        }
        if (flag) {points.push([lat2, lon2])}
        return [points, distance];
    };

    const LocationLogger = () => {
        useMapEvents({
            click: async (e) => {
                const {lat, lng} = e.latlng;
                const elev = await fetchElevation(lat, lng);
                setMarkers(prevMarkers => [...prevMarkers, {lat, lng, elev}]);
            }
        });
        return null;
    };

    const deleteMarker = (index) => {
        setMarkers(markers.filter((_, i) => i !== index));
    };

    const calculateTerrain = () => {
        if (markers.length >= 2) {
            let totalLabels = []; let totalElevations = []
            for (let m = 0; m < markers.length; m += 1) {
                totalElevations.push(markers[m].elev);
                totalLabels.push(m);
            }
            setChartData({
                labels: totalLabels,
                datasets: [{
                    label: "Elevation (m)",
                    data: totalElevations,
                    fill: false,
                }]
            });
        }
    }

    const calculateDistance = useCallback(async() => {
        if (markers.length >= 2) {
            let totalDistance = 0; let totalPoints = []; let totalLabels = []; let totalElevations = [];
            let flag = false; let trimmedPoints; let elevationPoints;
            for (let m = 1; m < markers.length; m += 1) {
                if (m === markers.length - 1) {flag = true}
                const [points, distance] = greatCirclePoints(markers[m - 1].lat, markers[m - 1].lng, markers[m].lat, markers[m].lng, flag);
                totalDistance += distance; if (flag) {elevationPoints = points}
                const repetitions = Math.ceil(points.length / 100)
                for (let n = 0; n < repetitions; n += 1) {
                    if (n === repetitions - 1) {
                        trimmedPoints = points.slice(100 * n, points.length)
                    } else {
                        trimmedPoints = points.slice(100 * n, 100 * (n + 1) - 1)
                    }
                    trimmedPoints.forEach((point) => {totalPoints.push(point);})
                }
            }
            if (elevationPoints.length <= 100) {
                setMessage("No errors so far")
                const elevations = await fetchElevationAlongPath(elevationPoints);
                for (let b = 0; b < elevations.length; b += 1) {
                    totalElevations.push(elevations[b]);
                    totalLabels.push(b);
                }
            } else {
                setMessage("100km distance limit for terrain profile")
            }
            setLineCoordinates(totalPoints);
            setDistance(`${totalDistance.toFixed(3)}km`)
            setChartData({
                labels: totalLabels,
                datasets: [{
                    label: "Elevation (m)",
                    data: totalElevations,
                    fill: false,
                }]
            });
        } else {
            setChartData({
                labels: [],
                datasets: [{
                    label: 'Elevation (m)',
                    data: [],
                    fill: false,
                }],
            })
            setLineCoordinates([]);
            setDistance("0km")
            setMessage("No errors so far")
        }
        setArea("0km^2")
    }, [markers])

    const closePolygon = () => {
        if (markers.length > 2) {
            if (markers[0].lat !== markers[markers.length - 1].lat && markers[0].lng !== markers[markers.length - 1].lng && markers.length > 2) {
                const lat = markers[0].lat
                const lng = markers[0].lng
                const elev = markers[0].elev
                setMarkers(prevMarkers => [...prevMarkers, {lat, lng, elev}]);
            }
        }
    }

    const fetchElevation = async (lat, lng) => {
        try {
            const response = await fetch(`https://api.open-elevation.com/api/v1/lookup?locations=${lat},${lng}`);
            const data = await response.json();
            if (data.results && data.results[0]) {
                return data.results[0].elevation
            }
        } catch (error) {
            return []
        }
    };

    const fetchElevationAlongPath = async (points) => {
        const elevations = []
        let query = ""; let counter = 0
        for (const point of points) {
            query += `${point[0]},${point[1]}|`;
        }
        query = query.slice(0, -1);
        try {
            const response = await fetch(`https://api.open-elevation.com/api/v1/lookup?locations=${query}`);
            const data = await response.json();
            points.forEach(() => {
                if (data.results && data.results[counter]) {
                    elevations.push(data.results[counter].elevation)
                }
                counter += 1
            });
            return elevations
        } catch (error) {
            return []
        }
    };

    const calculateArea = () => {
        if (markers.length > 3 && markers[0].lat === markers[markers.length - 1].lat && markers[0].lng === markers[markers.length - 1].lng) {
            const R = 6371
            let temp = 0
            for (let m = 0; m < markers.length - 1; m += 1) {
                let curr_lat = markers[m].lat * (Math.PI / 180)
                let next_lat = markers[m + 1].lat * (Math.PI / 180)
                let curr_lon = markers[m].lng * (Math.PI / 180)
                let next_lon = markers[m + 1].lng * (Math.PI / 180)
                let first_part = Math.sin((next_lat + curr_lat) / 2) / Math.cos((next_lat - curr_lat) / 2)
                let second_part = Math.tan((next_lon - curr_lon) / 2)
                temp += Math.atan(first_part * second_part) * 2
            }
            temp = temp * Math.pow(R, 2)
            setMessage("No errors so far")
            setArea(`${Math.abs(temp).toFixed(3)}km^2`)
        } else {
            setMessage("Not a closed figure")
            setArea("0km^2")
        }
    }

    const fetchLocation = async () => {
        try {
            const response = await fetch(`https://get.geojs.io/v1/ip/geo.json`);
            const data = await response.json();
            setPosition({lat: data.latitude, lon: data.longitude});
        } catch (err) {
            setPosition({lat: null, lon: null});
        }
    };

    const clearMarkers = () => {
        setMarkers([])
        setChartData({
            labels: [],
            datasets: [{
                label: 'Elevation (m)',
                data: [],
                fill: false,
            }],
        })
    }

    useEffect(() => {
        calculateDistance()
    }, [markers, calculateDistance])

    useEffect(() => {
        fetchLocation();
    }, [position]);

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
                        <Polyline positions={[[90, 180], [-90, 180]]} color="red" dashArray="10, 10" />
                        <Polyline positions={[[90, -180], [-90, -180]]} color="red" dashArray="10, 10" />
                    </MapContainer>
                </div>
                <div className={Styles.sideMenu}>
                    <div className={Styles.container}>
                        <div className={Styles.storage}>
                            <button className={Styles.sideMenuButton} onClick={saveCollection}> Save remotely </button>
                            <button className={Styles.sideMenuButton} onClick={saveCollectionLocally}> Save locally </button>
                            <button className={Styles.sideMenuButton} onClick={loadCollection}> Load remote </button>
                            <button className={Styles.sideMenuButton} onClick={loadCollectionLocally}> Load local </button>
                        </div>
                        <div className={Styles.calculations}>
                            <button className={Styles.sideMenuButton} onClick={clearMarkers}> Clear markers </button>
                            <button className={Styles.sideMenuButton} onClick={closePolygon}> Close polygon </button>
                            <button className={Styles.sideMenuButton} onClick={calculateArea}> Calculate Area </button>
                            <button className={Styles.sideMenuButton} onClick={calculateTerrain}> Calculate Terrain Profile </button>
                        </div>
                        <div className={Styles.logout}>
                            <button className={Styles.sideMenuButton} onClick={handleLogout}> Logout </button>
                        </div>
                    </div>
                </div>
                {/* overlay elements */}
                <div className={Styles.chart}>
                    <Line options={chart_options} data={chartData} />
                </div>
                <div className={Styles.info}>
                    <div className={Styles.infoEntry}> Distance: {distance} </div>
                    <div className={Styles.infoEntry}> Area: {area} </div>
                </div>
                <div className={Styles.messageBox}> 
                    <div className={Styles.messageBoxEntry}> {message} </div>
                </div>
            </div>
        ) : (
            <div className={Styles.messageBox}> 
                <div className={Styles.messageBoxEntry}> Waiting for your IP location... </div>
            </div>
        )}
        </>
    );
};

export default Home;