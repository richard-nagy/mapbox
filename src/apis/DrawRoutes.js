import * as turf from "@turf/turf";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import axios from "axios";

const DrawRoutes = async (listOfPlaces, profile, pointHopper, map, forceRender) => {
    if (Object.keys(pointHopper.current).length > 1) {
        const coordinates = listOfPlaces.current.map((e) => [e.longitude, e.latitude]);

        axios
            .get(
                `https://api.mapbox.com/directions/v5/mapbox/${profile}/${coordinates.join(
                    ";"
                )}?geometries=geojson&steps=true&&access_token=${mapboxgl.accessToken}`
            )
            .then((response) => {
                const routeGeoJSON = turf.featureCollection([
                    turf.feature(response.data.routes[0].geometry),
                ]);
                map.current.getSource("route").setData(routeGeoJSON);
            })
            .catch((error) => {
                console.log("Error");
            });
    }

    forceRender((old) => !old);
};

export default DrawRoutes;
