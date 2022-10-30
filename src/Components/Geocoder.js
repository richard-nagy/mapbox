import MapBoxGeocoder from "@mapbox/mapbox-gl-geocoder";
import { useControl } from "react-map-gl";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

const TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

const Geocoder = ({ addMarker }) => {
    const ctrl = new MapBoxGeocoder({
        accessToken: TOKEN,
        marker: false,
        // collapsed: true,
        // clearOnBlur: true,
    });
    useControl(() => ctrl);
    ctrl.on("result", (element) => {
        const coords = element.result.geometry.coordinates;
        addMarker(coords[0], coords[1]);
    });
    return null;
};

export default Geocoder;
