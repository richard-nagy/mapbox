// pointHopper.current okozza problémát
// syncelni kell list of placessel

import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css";
import * as turf from "@turf/turf";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import { getLocation } from "../apis/Location";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import { Divider, FormControlLabel, List, ListItem, ListItemText, Typography } from "@mui/material";
import ControlPanel from "./ControlPanel";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;
let id = 0;
let key1 = 0;

export default function App() {
    const mapContainer = useRef(null);
    const map = useRef(null);

    const [, forceRender] = useState(false);
    const [profile, setProfile] = useState("driving");
    const [distance, setDistance] = useState(0);
    const dropoffs = turf.featureCollection([]);
    const pointHopper = useRef({});
    const listOfPlaces = useRef([]);
    const listOfMarkers = useRef([]);

    useEffect(async () => {
        const stuff = listOfPlaces.current.map((e) => [e.longitude, e.latitude]);

        const query = await fetch(assembleQueryURL(stuff), { method: "GET" });
        const response = await query.json();

        if (Object.keys(pointHopper.current).length > 1) {
            const routeGeoJSON = turf.featureCollection([
                turf.feature(response.routes[0].geometry),
            ]);
            map.current.getSource("route").setData(routeGeoJSON);
        }
    }, [profile]);

    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/streets-v11",
            center: [19.1315, 47.4825],
            zoom: 10,
        });
    });

    useEffect(() => {
        if (!map.current) return; // wait for map to initialize

        map.current.on("load", () => {
            map.current.addLayer({
                id: "dropoffs-symbol",
                type: "symbol",
                source: {
                    data: dropoffs,
                    type: "geojson",
                },
            });

            map.current.on("click", (event) => {
                addWaypoints(event.point);
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
                        "line-color": "#3887be",
                        "line-width": ["interpolate", ["linear"], ["zoom"], 12, 3, 22, 12],
                    },
                },
                "waterway-label"
            );
        });
    }, []);

    useEffect(() => {
        if (!map.current) return; // wait for map to initialize
        const geocoder = new MapboxGeocoder({
            // Initialize the geocoder
            accessToken: mapboxgl.accessToken, // Set the access token
            mapboxgl: mapboxgl, // Set the mapbox-gl instance
            marker: false, // Do not use the default marker style
        });

        // Add the geocoder to the map
        map.current.addControl(geocoder);

        geocoder.on("result", function (event) {
            // wait until the map has finished flying to the searched point
            map.current.once("moveend", function () {
                // add the result as a point in the 'search_point' layer to show up as marker
                let geocoder_result = event.result.geometry;
                map.current.getSource("route").setData(geocoder_result);

                //project to use (pixel xy coordinates instead of lat/lon for WebGL)
                let geocoder_point = map.current.project([
                    event.result.center[0],
                    event.result.center[1],
                ]);

                addWaypoints(geocoder_point);
            });
        });
    }, []);

    async function addWaypoints(point) {
        // When the map is clicked, add a new drop off point
        // and update the `dropoffs-symbol` layer
        await newDropoff(map.current.unproject(point));
        map.current.getSource("dropoffs-symbol").setData(dropoffs);
        if (listOfPlaces.current.length) {
            map.current.setLayoutProperty("routeline-active", "visibility", "visible");
        }
    }

    async function newDropoff(coordinates) {
        // const key = `key0-${key0++}`;

        // addPlaceToList(coordinates.lng, coordinates.lat, key);
        addPlaceToList(coordinates.lng, coordinates.lat);

        // const pt = turf.point([coordinates.lng, coordinates.lat], {
        //     // key: Math.random(),
        //     key: `key0-${key0++}`,
        // });
        // dropoffs.features.push(pt);
        // const key = pt.properties.key;
        // pointHopper.current[key] = pt;

        // // Make a request to the Optimization API
        // const query = await fetch(assembleQueryURL(), { method: "GET" });
        // const response = await query.json();

        // if (Object.keys(pointHopper.current).length > 1) {
        //     const routeGeoJSON = turf.featureCollection([
        //         turf.feature(response.routes[0].geometry),
        //     ]);
        //     map.current.getSource("route").setData(routeGeoJSON);
        // }
    }

    // Here you'll specify all the parameters necessary for requesting a response from the Optimization API
    function assembleQueryURL(updatatingRoute = []) {
        let coordinates = [];

        if (updatatingRoute.length === 0) {
            // Create an array of GeoJSON feature collections for each point
            const restJobs = Object.keys(pointHopper.current).map(
                (key) => pointHopper.current[key]
            );

            for (const job of restJobs) {
                coordinates.push(job.geometry.coordinates);
            }
        } else {
            coordinates = updatatingRoute;
        }

        return `https://api.mapbox.com/directions/v5/mapbox/${profile}/${coordinates.join(
            ";"
        )}?geometries=geojson&steps=true&&access_token=${mapboxgl.accessToken}`;
    }

    const addPlaceToList = (lng, lat) => {
        async function getPlaceName(response_) {
            const key = `key1-${key1++}`;

            const name = response_.data.features[0].place_name;
            const id_ = id++;
            listOfPlaces.current.push({
                id: id_,
                longitude: lng,
                latitude: lat,
                name: name,
                key: key,
            });
            forceRender((old) => !old);

            const marker = new mapboxgl.Marker({
                draggable: true,
            })
                .setLngLat([lng, lat])
                .addTo(map.current);

            listOfMarkers.current.push(marker);

            function onDragEnd() {
                updateListOfPlaces(marker.getLngLat().lng, marker.getLngLat().lat, id_, key);
            }

            marker.on("dragend", onDragEnd);

            let foundIndex = listOfPlaces.current.findIndex((x) => x.id === id);
            listOfPlaces.current[foundIndex] = {
                ...listOfPlaces.current[foundIndex],
                longitude: lng,
                latitude: lat,
                name: name,
            };

            const stuff = listOfPlaces.current.map((e) => [e.longitude, e.latitude]);

            const pt = turf.point([lng, lat], {
                // key: Math.random(),
                key: key,
            });
            dropoffs.features.push(pt);
            pointHopper.current[pt.properties.key] = pt;

            // Make a request to the Optimization API
            const query = await fetch(assembleQueryURL(stuff), { method: "GET" });
            const response = await query.json();

            if (Object.keys(pointHopper.current).length > 1) {
                const routeGeoJSON = turf.featureCollection([
                    turf.feature(response.routes[0].geometry),
                ]);

                map.current.getSource("route").setData(routeGeoJSON);
            }
        }

        getLocation(lng, lat, getPlaceName);
    };

    function updateListOfPlaces(lng, lat, id, key) {
        async function getPlaceName(response_) {
            const name = response_.data.features[0].place_name;

            let foundIndex = listOfPlaces.current.findIndex((x) => x.id === id);
            listOfPlaces.current[foundIndex] = {
                ...listOfPlaces.current[foundIndex],
                longitude: lng,
                latitude: lat,
                name: name,
                key: key,
            };
            forceRender((old) => !old);

            const stuff = listOfPlaces.current.map((e) => [e.longitude, e.latitude]);

            const pt = turf.point([lng, lat], {
                key: key,
            });
            dropoffs.features.push(pt);
            pointHopper.current[pt.properties.key] = pt;

            // Make a request to the Optimization API
            const query = await fetch(assembleQueryURL(stuff), { method: "GET" });
            const response = await query.json();

            if (Object.keys(pointHopper.current).length > 1) {
                const routeGeoJSON = turf.featureCollection([
                    turf.feature(response.routes[0].geometry),
                ]);
                map.current.getSource("route").setData(routeGeoJSON);
            }
        }

        getLocation(lng, lat, getPlaceName);
    }

    const deleteLocation = async (i, place) => {
        listOfPlaces.current = listOfPlaces.current.filter((_, index) => index !== i);
        listOfMarkers.current[i].remove();
        listOfMarkers.current = listOfMarkers.current.filter((_, index) => index !== i);

        delete pointHopper.current[place.key];

        if (listOfPlaces.current.length === 0) {
            const geojson = {
                name: "NewFeatureType",
                type: "FeatureCollection",
                features: [
                    {
                        type: "Feature",
                        geometry: {
                            type: "LineString",
                            coordinates: [],
                        },
                        properties: null,
                    },
                ],
            };

            map.current.getSource("route").setData(geojson);
        }

        if (listOfPlaces.current.length === 1 || listOfPlaces.current.length === 0) {
            map.current.setLayoutProperty("routeline-active", "visibility", "none");
            return;
        }

        const stuff = listOfPlaces.current.map((e) => [e.longitude, e.latitude]);

        // Make a request to the Optimization API
        const query = await fetch(assembleQueryURL(stuff), { method: "GET" });
        const response = await query.json();

        if (Object.keys(pointHopper.current).length > 1) {
            const routeGeoJSON = turf.featureCollection([
                turf.feature(response.routes[0].geometry),
            ]);

            map.current.getSource("route").setData(routeGeoJSON);
            forceRender((old) => !old);
        }
    };

    const moveLocation = async (up, index) => {
        if (up) {
            const placeHolder = listOfPlaces.current[index - 1];
            listOfPlaces.current[index - 1] = listOfPlaces.current[index];
            listOfPlaces.current[index] = placeHolder;
            forceRender((old) => !old);
        }

        const placeHolder = listOfPlaces.current[index + 1];
        listOfPlaces.current[index + 1] = listOfPlaces.current[index];
        listOfPlaces.current[index] = placeHolder;
        forceRender((old) => !old);

        const stuff = listOfPlaces.current.map((e) => [e.longitude, e.latitude]);

        // Make a request to the Optimization API
        const query = await fetch(assembleQueryURL(stuff), { method: "GET" });
        const response = await query.json();

        if (Object.keys(pointHopper.current).length > 1) {
            const routeGeoJSON = turf.featureCollection([
                turf.feature(response.routes[0].geometry),
            ]);
            map.current.getSource("route").setData(routeGeoJSON);
        }
    };

    return (
        <div>
            <div ref={mapContainer} className="map-container"></div>
            <ControlPanel top={10}>
                <button onClick={() => setProfile("driving")}>driving</button>
                <button onClick={() => setProfile("walking")}>walking</button>
                <button onClick={() => setProfile("cycling")}>cycling</button>
                distance: {distance}
            </ControlPanel>
            <ControlPanel top={70}>
                <Typography variant="h6">List of places</Typography>
                <List sx={{ padding: 0 }}>
                    {listOfPlaces.current.map((place, i) => {
                        return (
                            <div key={place.id}>
                                <Divider />
                                <ListItem sx={{ padding: 0 }}>
                                    <ListItemText primary={place.name} />
                                    <button onClick={() => deleteLocation(i, place)}>delete</button>
                                    {i !== 0 && (
                                        <button onClick={() => moveLocation(true, i)}>up</button>
                                    )}
                                    {listOfPlaces.current.length - 1 !== i && (
                                        <button onClick={() => moveLocation(false, i)}>down</button>
                                    )}
                                </ListItem>
                            </div>
                        );
                    })}
                </List>
            </ControlPanel>
            {/* <button onClick={() => console.log(listOfPlaces.current)}>log</button> */}
        </div>
    );
}
