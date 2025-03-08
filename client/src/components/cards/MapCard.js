import { useEffect, useState } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function MapCard({ ad }) {
    const [coordinates, setCoordinates] = useState(null);
    const [mapInstance, setMapInstance] = useState(null);

    useEffect(() => {
        if (ad?.location?.coordinates?.length) {
            const lat = ad?.location?.coordinates[1];
            const lng = ad?.location?.coordinates[0];

            // Use Nominatim API for reverse geocoding to get location name
            fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
                .then(response => response.json())
                .then(data => {
                    // Handle the location data (optional)
                    console.log(data);
                })
                .catch(error => console.error("Error fetching location:", error));

            setCoordinates([lat, lng]);
        }
    }, [ad]);

    useEffect(() => {
        if (coordinates && !mapInstance) {
            const map = L.map("mapContainer").setView(coordinates, 11); // Create map with coordinates
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            // Custom marker with emoji
            const customIcon = L.divIcon({
                className: 'leaflet-emoji-icon',
                html: '📍', // Emoji as HTML content
                iconSize: [30, 30], // Customize size if needed
                iconAnchor: [15, 30], // Anchor position
                popupAnchor: [0, -30], // Popup position
            });

            const marker = L.marker(coordinates, { icon: customIcon }).addTo(map);
            marker.bindPopup(
                <Popup>
                    📍
                </Popup>
            );

            // Set map instance in state for future cleanup
            setMapInstance(map);

            return () => {
                // Clean up the map instance on unmount or update
                if (mapInstance) {
                    mapInstance.off();
                    mapInstance.remove();
                }
            };
        }
    }, [coordinates, mapInstance]);

    if (!coordinates) {
        return <div>Loading map...</div>;
    }

    return (
        <div style={{ width: "100%", height: "350px" }}>
            {/* Use MapContainer here, it will still work but we manually manage the map instance */}
            <div id="mapContainer" style={{ height: "100%", width: "100%" }} />
        </div>
    );
}
