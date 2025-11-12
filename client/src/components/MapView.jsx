import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons
const userIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="#3b82f6" stroke="white" stroke-width="2"/>
      <circle cx="12" cy="12" r="4" fill="white"/>
    </svg>
  `),
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12],
});

const gigIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="#10b981" stroke="white" stroke-width="2"/>
      <path d="M8 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `),
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12],
});

const MapView = ({ gigs, userLocation }) => {
  // Center on India
  const indiaCenter = [20.5937, 78.9629];
  const indiaZoom = 5;

  if (!gigs || !Array.isArray(gigs) || gigs.length === 0) {
    return (
      <div className="w-full min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Loading Gig Map</h3>
          <p className="text-gray-500">Discover opportunities across India...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Map Container */}
      <div className="w-full h-[80vh] mx-auto max-w-7xl relative">
        <MapContainer
          center={indiaCenter}
          zoom={indiaZoom}
          style={{ height: '100%', width: '100%' }}
          className="rounded-xl shadow-2xl border-2 border-gray-200"
          zoomControl={true}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* User location marker */}
          {userLocation && (
            <Marker
              position={[userLocation.latitude, userLocation.longitude]}
              icon={userIcon}
            >
              <Popup>
                <div className="text-center p-2">
                  <div className="text-blue-600 font-semibold mb-1">📍 Your Location</div>
                  <div className="text-xs text-gray-600">
                    {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
                  </div>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Gig markers */}
          {gigs && gigs.length > 0 && gigs.map((gig) => {
            if (!gig.coordinates || typeof gig.coordinates.latitude !== 'number' || typeof gig.coordinates.longitude !== 'number') {
              return null;
            }

            return (
              <Marker
                key={gig.id}
                position={[gig.coordinates.latitude, gig.coordinates.longitude]}
                icon={gigIcon}
              >
                <Popup>
                  <div className="max-w-sm p-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-green-600 text-sm">💼</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm mb-1 text-gray-900">{gig.title}</h3>
                        <p className="text-xs text-gray-600 mb-2">{gig.postedBy?.companyName || 'Unknown Company'}</p>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{gig.location}</span>
                        </div>
                        <div className="text-sm font-bold text-green-600">
                          ₹{gig.budget.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        {/* Legend */}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border">
          <h4 className="font-semibold text-sm mb-2 text-gray-800">Legend</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>
              <span className="text-xs text-gray-700">Your Location</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              <span className="text-xs text-gray-700">Available Gigs</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;