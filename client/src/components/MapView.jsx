import React, {useCallback, useEffect, useState} from "react";
import {MapContainer, TileLayer, Marker, Popup, useMapEvents, Polyline} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {Line} from 'react-chartjs-2';
import {Chart, registerables} from 'chart.js';
import Styles from "../styles/MapView.module.css"

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

const MapView = () => {
    const [message, setMessage] = useState("");
    const [area, setArea] = useState("")
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

    const saveCollection = async () => {
        if (markers.length === 0) {
            console.log("Add some markers before saving..."); return;
        }
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

    const loadCollection = async () => {
        if (markers.length !== 0) {
            console.log("Clear all the markers before loading..."); return;
        }
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

    const loadCollectionLocally = (event) => {
        const file = event.target.files[0];
        if (!file) {
            console.log("No file selected."); return;
        }
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
    };

    const greatCirclePoints = (lat1, lon1, lat2, lon2) => {
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
        points.push([lat2, lon2])
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

    const calculateDistance = useCallback(async() => {
        if (markers.length >= 2) {
            let totalDistance = 0; let totalPoints = []; let totalLabels = []; let totalElevations = []; let counter = 0
            for (let m = 1; m < markers.length; m += 1) {
                const [points, distance] = greatCirclePoints(markers[m - 1].lat, markers[m - 1].lng, markers[m].lat, markers[m].lng);
                totalDistance += distance; totalPoints.push(points);
                const elevations = await fetchElevationAlongPath(points);
                elevations.forEach(elem => {
                    totalElevations.push(elem);
                    totalLabels.push(counter);
                    counter += 1
                })
            }
            setLineCoordinates(totalPoints);
            setMessage(`Distance: ${totalDistance.toFixed(3)}km`)
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
            setMessage(``)
        }
    }, [markers])

    const closeCircle = () => {
        if (markers[0].lat !== markers[markers.length - 1].lat && markers[0].lng !== markers[markers.length - 1].lng && markers.length > 2) {
            const lat = markers[0].lat
            const lng = markers[0].lng
            const elev = markers[0].elev
            setMarkers(prevMarkers => [...prevMarkers, {lat, lng, elev}]);
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
            return null
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
            setArea(`Area: ${Math.abs(temp).toFixed(3)}km^2`)
            // let temp = 0; let next = 0; let curr = 0; let prev = 0;
            // for (let m = 0; m < markers.length - 1; m += 1) {
            //     next = markers[m + 1].lng * (Math.PI / 180);
            //     curr = Math.sin(markers[m].lat * (Math.PI / 180))
            //     if (m === 0) {prev = markers[markers.length - 1].lng * (Math.PI / 180)}
            //     else {prev = markers[m - 1].lng * (Math.PI / 180)}
            //     console.log(next, prev, curr)
            //     temp += (next - prev) * curr
            // }
            // setArea(`Area: ${(temp * (Math.pow(R, 2) / 2))}`)
        } else {
            setArea(`Need to close the polygon first`)
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
                <div className={Styles.bottomMenu}>
                    <button onClick={saveCollection}> Save collection on server </button>
                    <button onClick={loadCollection}> Load collection from server </button>
                    <button onClick={saveCollectionLocally}> Save collection as a file </button>
                    <input type="file" accept=".csv" onChange={loadCollectionLocally} placeholder="Load collection from a file"/>
                    <button onClick={clearMarkers}> Clear markers </button>
                    <button onClick={closeCircle}> Close polygon </button>
                    <button onClick={calculateArea}> Calculate Area </button>
                    <div> {message} </div>
                    <div> {area} </div>
                    <div className={Styles.chart}>
                        <Line options={chart_options} data={chartData} />
                    </div>
                </div>
            </div>
        ) : "Error while fetching your IP location"} </>
    );
};

export default MapView;