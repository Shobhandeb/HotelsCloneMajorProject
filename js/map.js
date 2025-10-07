mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container:"map",
    style:"mapbox://styles/mapbox/streets-v12",
    center:[77.289,28.6139],
    zoom:9
});