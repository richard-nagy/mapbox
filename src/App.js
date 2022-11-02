import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import * as turf from "@turf/turf";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import { getLocation } from "./apis/Location";
import Profiles from "./components/Profiles";
import { ListOfPlaces } from "./components/ListOfPlaces";
import DrawRoutes from "./apis/DrawRoutes";
import Settings from "./components/Settings";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import "./App.css";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;
let globalID = 0;

const App = () => {
    const [profile, setProfile] = useState("driving");
    const [timeDistance, setTimeDistance] = useState({ time: 0, distance: 0 });
    const colorWidth = useRef({ color: "#90caf9", width: 3 });
    const mapContainer = useRef(null);
    const map = useRef(null);
    const pointHopper = useRef({});
    const listOfPlaces = useRef([]);

    // Initialize the map
    useEffect(() => {
        // initialize map only once
        if (map.current) {
            return;
        }
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/streets-v11",
            center: [17.9093, 47.1028],
            zoom: 10,
        });
    });

    // Initialize the route drawings
    useEffect(() => {
        // wait for map to initialize
        if (!map.current) {
            return;
        }

        map.current.on("load", () => {
            // Add controllers to the map
            map.current.addControl(new mapboxgl.NavigationControl());

            map.current.addLayer({
                id: "dropoffs-symbol",
                type: "symbol",
                source: {
                    data: turf.featureCollection([]),
                    type: "geojson",
                },
            });

            map.current.on("click", (event) => {
                addNewPlace(event.point);
            });

            map.current.addSource("route", {
                type: "geojson",
                data: turf.featureCollection([]),
            });

            map.current.addLayer(
                {
                    id: "routeline-active",
                    type: "line",
                    source: "route",
                    layout: {
                        "line-join": "round",
                        "line-cap": "round",
                        visibility: "visible",
                    },
                    paint: {
                        "line-color": colorWidth.current.color,
                        "line-width": [
                            "interpolate",
                            ["linear"],
                            ["zoom"],
                            12,
                            colorWidth.current.width,
                            22,
                            12,
                        ],
                    },
                },
                "waterway-label"
            );
        });
    });

    // Initialize the geocoder (Search bar)
    useEffect(() => {
        // wait for map to initialize
        if (!map.current) {
            return;
        }
        const geocoder = new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            mapboxgl: mapboxgl,
            marker: false,
        });

        map.current.addControl(geocoder);

        // When we choose a result
        geocoder.on("result", (event) => {
            // After it arrived to the destination
            // Send the coordinates to the addNewPlace function
            // So it can add the location to the list
            map.current.once("moveend", () => {
                map.current.getSource("route").setData(event.result.geometry);
                const geocoder_point = map.current.project([
                    event.result.center[0],
                    event.result.center[1],
                ]);

                addNewPlace(geocoder_point);
            });
        });
    }, []);

    // Fetch route
    const fetchRoutes = (profile_ = profile) => {
        DrawRoutes(listOfPlaces, profile_, pointHopper, map, setTimeDistance);
    };

    // Add new place to the list
    // By clicking on the map, or choosing in the search
    const addNewPlace = (point) => {
        const lng = map.current.unproject(point).lng;
        const lat = map.current.unproject(point).lat;

        getLocation(lng, lat, (response_) => {
            const name = response_.data.features[0].place_name;
            const id = globalID++;

            // Create marker
            const marker = new mapboxgl.Marker({
                draggable: true,
                color: colorWidth.current.color,
            })
                .setLngLat([lng, lat])
                .addTo(map.current);

            listOfPlaces.current.push({
                id: id,
                longitude: lng,
                latitude: lat,
                name: name,
                marker: marker,
            });

            marker.on("dragend", () => {
                const lng = marker.getLngLat().lng;
                const lat = marker.getLngLat().lat;

                getLocation(lng, lat, async (response_) => {
                    const name = response_.data.features[0].place_name;

                    const foundIndex = listOfPlaces.current.findIndex((x) => x.id === id);
                    listOfPlaces.current[foundIndex] = {
                        ...listOfPlaces.current[foundIndex],
                        longitude: lng,
                        latitude: lat,
                        name: name,
                    };

                    const pt = turf.point([lng, lat], {
                        id: id,
                    });
                    pointHopper.current[pt.properties.id] = pt;

                    fetchRoutes();
                });
            });

            const foundIndex = listOfPlaces.current.findIndex((x) => x.id === globalID);
            listOfPlaces.current[foundIndex] = {
                ...listOfPlaces.current[foundIndex],
                longitude: lng,
                latitude: lat,
                name: name,
            };

            const pt = turf.point([lng, lat], {
                id: id,
            });
            pointHopper.current[pt.properties.id] = pt;

            fetchRoutes();
        });

        // If there is more than 1 locations, show the route drawings
        if (listOfPlaces.current.length) {
            map.current.setLayoutProperty("routeline-active", "visibility", "visible");
        }
    };

    // Delete location from list
    const deleteLocation = async (i, place) => {
        // Delete values from lists
        listOfPlaces.current[i].marker.remove();
        listOfPlaces.current = listOfPlaces.current.filter((_, index) => index !== i);
        delete pointHopper.current[place.id];

        // If there is only one location, hide the route
        if (listOfPlaces.current.length === 1 || listOfPlaces.current.length === 0) {
            map.current.setLayoutProperty("routeline-active", "visibility", "none");
        }

        fetchRoutes();
    };

    // Change order of locations
    const changeLocationOrder = async (movingUp, index) => {
        if (movingUp) {
            const placeHolder = listOfPlaces.current[index - 1];
            listOfPlaces.current[index - 1] = listOfPlaces.current[index];
            listOfPlaces.current[index] = placeHolder;
        } else {
            const placeHolder = listOfPlaces.current[index + 1];
            listOfPlaces.current[index + 1] = listOfPlaces.current[index];
            listOfPlaces.current[index] = placeHolder;
        }

        fetchRoutes();
    };

    // When we change the colro or
    // Line width in the options
    // Update all the necesarry values
    const changeColorWidth = (
        color = colorWidth.current.color,
        width = colorWidth.current.width
    ) => {
        colorWidth.current = { color: color, width: width };
        map.current.setPaintProperty("routeline-active", "line-color", color);
        map.current.setPaintProperty("routeline-active", "line-width", [
            "interpolate",
            ["linear"],
            ["zoom"],
            12,
            width,
            22,
            12,
        ]);
        listOfPlaces.current.forEach((place) => {
            const markerElement = place.marker.getElement();
            markerElement
                .querySelectorAll('svg g[fill="' + place.marker._color + '"]')[0]
                .setAttribute("fill", color);
            place.marker._color = color;
        });
    };

    return (
        <>
            <div ref={mapContainer} className="map-container" />
            <Profiles
                profile={profile}
                setProfile={setProfile}
                fetchRoutes={fetchRoutes}
                timeDistance={timeDistance}
            />
            <ListOfPlaces
                listOfPlaces={listOfPlaces}
                changeLocationOrder={changeLocationOrder}
                deleteLocation={deleteLocation}
            />
            <Settings changeColorWidth={changeColorWidth} />
        </>
    );
};

export default App;
