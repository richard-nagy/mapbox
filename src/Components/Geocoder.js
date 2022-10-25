import MapBoxGeocoder from "@mapbox/mapbox-gl-geocoder";
import { useControl } from "react-map-gl";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

const TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

const Geocoder = ({ addWaypoint }) => {
    const ctrl = new MapBoxGeocoder({
        accessToken: TOKEN,
        marker: false,
        collapsed: true,
    });
    useControl(() => ctrl);
    ctrl.on("result", (e) => {
        const coords = e.result.geometry.coordinates;
        addWaypoint(coords[0], coords[1]);
    });
    return null;
};

export default Geocoder;
