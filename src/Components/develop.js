import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css";
import * as turf from "@turf/turf";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import { getLocation } from "../apis/Location";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;
let id = 0;

export default function App() {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(-70.9);
    const [lat, setLat] = useState(42.35);
    const [zoom, setZoom] = useState(9);
    const [listOfPlaces, setListOfPlaces] = useState([]);
    const pointHopper = useRef({});
    const dropoffs = turf.featureCollection([]);
    const nothing = turf.featureCollection([]);

    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/streets-v11",
            center: [19.1315, 47.4825],
            zoom: zoom,
        });
    });

    useEffect(() => {
        if (!map.current) return; // wait for map to initialize
        map.current.on("move", () => {
            setLng(map.current.getCenter().lng.toFixed(4));
            setLat(map.current.getCenter().lat.toFixed(4));
            setZoom(map.current.getZoom().toFixed(2));
        });

        if (!map.current) return; // wait for map to initialize

        map.current.on("load", () => {
            map.current.addLayer({
                id: "dropoffs-symbol",
                type: "symbol",
                source: {
                    data: dropoffs,
                    type: "geojson",
                },
                layout: {
                    "icon-allow-overlap": true,
                    "icon-ignore-placement": true,
                    "icon-image": "zoo-11",
                },
            });

            map.current.on("click", (event) => {
                addWaypoints(event.point);
            });

            map.current.addSource("route", {
                type: "geojson",
                data: nothing,
            });

            map.current.addLayer(
                {
                    id: "routeline-active",
                    type: "line",
                    source: "route",
                    layout: {
                        "line-join": "round",
                        "line-cap": "round",
                    },
                    paint: {
                        "line-color": "#3887be",
                        "line-width": ["interpolate", ["linear"], ["zoom"], 12, 3, 22, 12],
                    },
                },
                "waterway-label"
            );
        });
    });

    useEffect(() => {
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
                var geocoder_result = event.result.geometry;
                map.current.getSource("route").setData(geocoder_result);

                //project to use (pixel xy coordinates instead of lat/lon for WebGL)
                var geocoder_point = map.current.project([
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
    }

    async function newDropoff(coordinates) {
        // Store the clicked point as a new GeoJSON feature with
        // two properties: `orderTime` and `key`

        addPlaceToList(coordinates.lng, coordinates.lat);

        const pt = turf.point([coordinates.lng, coordinates.lat], {
            key: Math.random(),
        });
        dropoffs.features.push(pt);
        pointHopper.current[pt.properties.key] = pt;

        // Make a request to the Optimization API
        const query = await fetch(assembleQueryURL(), { method: "GET" });
        const response = await query.json();

        if (Object.keys(pointHopper.current).length > 1) {
            const routeGeoJSON = turf.featureCollection([
                turf.feature(response.routes[0].geometry),
            ]);
            map.current.getSource("route").setData(routeGeoJSON);
        }
    }

    // Here you'll specify all the parameters necessary for requesting a response from the Optimization API
    function assembleQueryURL() {
        const coordinates = [];

        // Create an array of GeoJSON feature collections for each point
        const restJobs = Object.keys(pointHopper.current).map((key) => pointHopper.current[key]);

        for (const job of restJobs) {
            coordinates.push(job.geometry.coordinates);
        }

        return `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates.join(
            ";"
        )}?geometries=geojson&steps=true&&access_token=${mapboxgl.accessToken}`;
    }

    const addPlaceToList = (lng, lat) => {
        function getPlaceName(response) {
            const name = response.data.features[0].place_name;
            setListOfPlaces((old) => [
                ...old,
                { id: id++, longitude: lng, latitude: lat, name: name },
            ]);
        }

        getLocation(lng, lat, getPlaceName);
    };

    return (
        <div>
            <div className="sidebar">
                Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
            </div>
            <div ref={mapContainer} className="map-container"></div>
            <ul>
                {listOfPlaces.map((place) => {
                    return <li key={place.id}>{place.name}</li>;
                })}
            </ul>
        </div>
    );
}
