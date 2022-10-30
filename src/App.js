import React, { useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import {
    Divider,
    FormControlLabel,
    List,
    ListItem,
    ListItemText,
    Paper,
    Switch,
    Typography,
} from "@mui/material";
import Mark from "./components/Mark";
import { GeolocateControl, Map, NavigationControl, useControl } from "react-map-gl";
import { MapBox } from "./styles/Map";
import Geocoder from "./components/Geocoder";
import ControlPanel from "./components/ControlPanel";
import { getLocation } from "./apis/Location";
import { DeckGL, GeoJsonLayer, ScatterplotLayer } from "deck.gl";
import { LineLayer } from "@deck.gl/layers";
import axios from "axios";
import geci from "./geci.json";
import { MapContext } from "react-map-gl/dist/esm/components/map";
import { MapboxOverlay, MapboxOverlayProps } from "@deck.gl/mapbox/typed";

const TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

const data = [{ sourcePosition: [-122.41669, 37.7853], targetPosition: [-122.41669, 37.781] }];

let id = 0;

export default function App() {
    const [isMarkerOn, setsetIsMarkerOn] = useState(false);
    const [listOfPlaces, setListOfPlaces] = useState([]);

    const layers = [new LineLayer({ id: "line-layer", data })];

    const toggleSpecialCursor = () => {
        setsetIsMarkerOn(!isMarkerOn);
    };

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

    const handleClick = (map) => {
        if (!isMarkerOn) {
            return;
        }

        addPlaceToList(map.lngLat.lng, map.lngLat.lat);
    };

    const updateListOfPlaces = (event, id) => {
        const lng = event.lngLat.lng;
        const lat = event.lngLat.lat;

        function getPlaceName(response) {
            const name = response.data.features[0].place_name;
            const newState = listOfPlaces.map((obj) => {
                if (obj.id === id) {
                    return {
                        id: id,
                        longitude: lng,
                        latitude: lat,
                        name: name,
                    };
                }

                return obj;
            });
            setListOfPlaces(newState);
        }

        getLocation(lng, lat, getPlaceName);
    };

    // Draw the Map Matching route as a new layer on the map
    function addRoute(coords) {
        return {
            id: "route",
            type: "line",
            source: {
                type: "geojson",
                data: {
                    type: "Feature",
                    properties: {},
                    geometry: coords,
                },
            },
            layout: {
                "line-join": "round",
                "line-cap": "round",
            },
            paint: {
                "line-color": "#03AA46",
                "line-width": 8,
                "line-opacity": 0.8,
            },
        };
    }

    const test = () => {
        axios
            .get(
                `https://api.mapbox.com/directions/v5/mapbox/cycling/-84.518641,39.134270;-84.512023,39.102779?geometries=geojson&access_token=${TOKEN}`
            )
            .then((response) => {
                console.log(response.data.routes[0].geometry.coordinates);
                return response.data.routes[0].geometry.coordinates;
            });
    };

    const layerRoute = new GeoJsonLayer({
        id: "geojson-layer",
        data: test(),
        filled: true,
        stroked: false,
        extruded: true,
        pickable: true,
        lineJointRounded: true,
        getRadius: 50,
        getElevation: 30,
        lineWidthScale: 20,
    });

    return (
        <MapBox isMarkerOn={isMarkerOn}>
            {/* <DeckGL
                style={{ width: "500px", height: "500px", marginTop: "250px", zIndex: "2" }}
                initialViewState={{
                    longitude: -117.17282,
                    latitude: 32.71204,
                    zoom: 13,
                }}
                controller={true}
                layers={[layerRoute]}
            >
                <Map mapboxAccessToken={TOKEN} mapStyle="mapbox://styles/mapbox/streets-v9">
         
                    <Geocoder addMarker={addPlaceToList} />
                </Map>
            </DeckGL> */}
            {/* <ControlPanel top={0}>
                    <FormControlLabel
                        control={<Switch color="primary" />}
                        label="📌 Place marker on click"
                        labelPlacement="end"
                        onChange={toggleSpecialCursor}
                    />
                </ControlPanel>
                <ControlPanel top={70}>
                    <Typography variant="h6">List of places</Typography>
                    <List sx={{ padding: 0 }}>
                        {listOfPlaces.map((place) => {
                            return (
                                <div key={place.id}>
                                    <Divider sx={{ color: "red" }} />
                                    <ListItem sx={{ padding: 0 }}>
                                        <ListItemText primary={place.name} />
                                    </ListItem>
                                </div>
                            );
                        })}
                    </List>
                </ControlPanel> */}
        </MapBox>
    );
}
