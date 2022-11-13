import axios from "axios";

const getLocation = (lng, lat, getPlaceName) => {
    axios
        .get(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?&access_token=pk.eyJ1IjoianNjYXN0cm8iLCJhIjoiY2s2YzB6Z25kMDVhejNrbXNpcmtjNGtpbiJ9.28ynPf1Y5Q8EyB_moOHylw`
        )
        .then((response) => {
            getPlaceName(response);
        })
        .catch((error) => {
            console.log(error);
            alert("An error occured. You might need to refresh the page.");
        });
};

export { getLocation };
