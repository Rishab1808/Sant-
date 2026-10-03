import { useState, useRef, useEffect } from 'react'
import { Search, ShieldAlert, MapPin, Info, X, CheckCircle2, AlertTriangle, Map as MapIcon, List, Building2, HeartHandshake, Navigation } from 'lucide-react'
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import data from '../healthcare_data.json'

const mockHospitals = [
  { id: 1, name: 'Gandhi General Hospital', type: 'government', lat: 17.3950, lng: 78.4767, color: '#16a34a' },
  { id: 2, name: 'Lions Club Trust Hospital', type: 'trust', lat: 17.3650, lng: 78.4967, color: '#2563eb' },
  { id: 3, name: 'Apollo Premium Care', type: 'private', lat: 17.4050, lng: 78.4367, color: '#475569' },
  { id: 4, name: 'KEM Hospital (Govt)', type: 'government', lat: 19.0560, lng: 72.8577, color: '#16a34a' },
  { id: 5, name: 'Holy Spirit Charity', type: 'trust', lat: 19.0960, lng: 72.8977, color: '#2563eb' },
  { id: 6, name: 'Lilavati Premium', type: 'private', lat: 19.0360, lng: 72.8277, color: '#475569' },
  { id: 7, name: 'Safdarjung Hospital', type: 'government', lat: 28.5672, lng: 77.2010, color: '#16a34a' },
  { id: 8, name: 'St. Stephen Trust', type: 'trust', lat: 28.6741, lng: 77.2525, color: '#2563eb' },
  { id: 9, name: 'Max Super Speciality', type: 'private', lat: 28.6341, lng: 77.1225, color: '#475569' },
  { id: 10, name: 'Victoria Hospital', type: 'government', lat: 12.9516, lng: 77.5746, color: '#16a34a' },
  { id: 11, name: 'Sathya Sai Trust', type: 'trust', lat: 12.9916, lng: 77.6146, color: '#2563eb' },
  { id: 12, name: 'Manipal Premium', type: 'private', lat: 12.9316, lng: 77.6346, color: '#475569' },
  { id: 13, name: 'Rajiv Gandhi Govt', type: 'government', lat: 13.0827, lng: 80.2707, color: '#16a34a' },
  { id: 14, name: 'Chennai Mission Trust', type: 'trust', lat: 13.0427, lng: 80.2207, color: '#2563eb' },
  { id: 15, name: 'Kauvery Private Care', type: 'private', lat: 13.0127, lng: 80.2507, color: '#475569' },
  { id: 16, name: 'SSKM Government', type: 'government', lat: 22.5326, lng: 88.3439, color: '#16a34a' },
  { id: 17, name: 'Ramakrishna Mission', type: 'trust', lat: 22.5926, lng: 88.3839, color: '#2563eb' },
  { id: 18, name: 'AMRI Private', type: 'private', lat: 22.5026, lng: 88.3639, color: '#475569' },
  { id: 19, name: 'Sassoon General', type: 'government', lat: 18.5204, lng: 73.8767, color: '#16a34a' },
  { id: 20, name: 'KEM Pune Trust', type: 'trust', lat: 18.4904, lng: 73.8367, color: '#2563eb' },
  { id: 21, name: 'Ruby Hall Clinic', type: 'private', lat: 18.5404, lng: 73.8967, color: '#475569' },
  { id: 22, name: 'Civil Hospital', type: 'government', lat: 23.0525, lng: 72.6014, color: '#16a34a' },
  { id: 23, name: 'VSF Charity Hospital', type: 'trust', lat: 23.0025, lng: 72.5514, color: '#2563eb' },
  { id: 24, name: 'Zydus Premium Care', type: 'private', lat: 23.0625, lng: 72.5114, color: '#475569' },
  { id: 25, name: 'SMS Hospital', type: 'government', lat: 26.9024, lng: 75.8073, color: '#16a34a' },
  { id: 26, name: 'Narayana Trust Care', type: 'trust', lat: 26.8524, lng: 75.7573, color: '#2563eb' },
  { id: 27, name: 'Fortis Jaipur', type: 'private', lat: 26.8824, lng: 75.8373, color: '#475569' },
  { id: 28, name: 'KGMU Hospital', type: 'government', lat: 26.8667, lng: 80.9162, color: '#16a34a' },
  { id: 29, name: 'Sahara Trust', type: 'trust', lat: 26.8167, lng: 80.9762, color: '#2563eb' },
  { id: 30, name: 'Medanta Lucknow', type: 'private', lat: 26.8367, lng: 80.9062, color: '#475569' },
  { id: 31, name: 'PGIMER', type: 'government', lat: 30.7633, lng: 76.7794, color: '#16a34a' },
  { id: 32, name: 'Rotary Trust Hospital', type: 'trust', lat: 30.7133, lng: 76.8094, color: '#2563eb' },
  { id: 33, name: 'Max Super Speciality', type: 'private', lat: 30.7233, lng: 76.7294, color: '#475569' },
  { id: 34, name: 'AIIMS Bhopal', type: 'government', lat: 23.2099, lng: 77.4526, color: '#16a34a' },
  { id: 35, name: 'BMHRC Trust', type: 'trust', lat: 23.2899, lng: 77.4026, color: '#2563eb' },
  { id: 36, name: 'Bansal Private Care', type: 'private', lat: 23.2299, lng: 77.3826, color: '#475569' },
  { id: 37, name: 'Ernakulam General', type: 'government', lat: 9.9712, lng: 76.2873, color: '#16a34a' },
  { id: 38, name: 'Amrita Trust', type: 'trust', lat: 10.0312, lng: 76.3273, color: '#2563eb' },
  { id: 39, name: 'Aster Medcity', type: 'private', lat: 10.0612, lng: 76.2573, color: '#475569' }
]

const cityCoordinates = {
  'hyderabad': [17.3850, 78.4867],
  'mumbai': [19.0760, 72.8777],
  'delhi': [28.7041, 77.1025],
  'bangalore': [12.9716, 77.5946],
  'bengaluru': [12.9716, 77.5946],
  'chennai': [13.0827, 80.2707],
  'kolkata': [22.5726, 88.3639],
  'pune': [18.5204, 73.8567],
  'ahmedabad': [23.0225, 72.5714],
  'jaipur': [26.9124, 75.7873],
  'lucknow': [26.8467, 80.9462],
  'chandigarh': [30.7333, 76.7794],
  'bhopal': [23.2599, 77.4126],
  'kochi': [9.9312, 76.2673]
}

function MapFlyTo({ coords }) {
  const map = useMap()
  if (coords) {
    map.flyTo(coords, 11, { duration: 1.5 })
  }
  return null
}

function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTier, setSelectedTier] = useState('tier1')
  const [viewMode, setViewMode] = useState('list')
  
  const [activeModal, setActiveModal] = useState(null)
  const [activeMapProcedure, setActiveMapProcedure] = useState(null)
  
  const [flyLocation, setFlyLocation] = useState(null)
  const [isLocating, setIsLocating] = useState(false)
  const [customCity, setCustomCity] = useState('')
  
  // New states for the suggestions dropdown
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  const filteredProcedures = data.procedures.filter(procedure => 
    procedure.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    procedure.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleLocateMe = () => {
    setIsLocating(true)
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFlyLocation([position.coords.latitude, position.coords.longitude])
          setIsLocating(false)
        },
        (error) => {
          console.error(error)
          alert("Could not fetch location. Please ensure location permissions are allowed.")
          setIsLocating(false)
        }
      )
    } else {
      alert("Geolocation is not supported by your browser.")
      setIsLocating(false)
    }
  }

  // Handle typing in the city input box
  const handleCityInputChange = (e) => {
    const val = e.target.value
    setCustomCity(val)
    
    if (val.trim()) {
      // Filter cities that include the typed letters
      const filtered = Object.keys(cityCoordinates).filter(city => 
        city.toLowerCase().includes(val.toLowerCase())
      )
      setSuggestions(filtered)
      setShowSuggestions(true)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }

  // Handle clicking a city from the dropdown
  const handleSuggestionClick = (cityKey) => {
    const formattedCity = cityKey.charAt(0).toUpperCase() + cityKey.slice(1)
    setCustomCity(formattedCity)
    setShowSuggestions(false)
    setFlyLocation(cityCoordinates[cityKey])
  }

  // Fallback for clicking "Go" or hitting Enter
  const handleCitySearch = () => {
    const searchStr = customCity.toLowerCase().trim()
    if (!searchStr) return;

    const matchedCityKey = Object.keys(cityCoordinates).find(city => 
      city.includes(searchStr)
    )

    if (matchedCityKey) {
      setFlyLocation(cityCoordinates[matchedCityKey])
      setCustomCity(matchedCityKey.charAt(0).toUpperCase() + matchedCityKey.slice(1))
      setShowSuggestions(false)
    } else {
      alert("City not found! Try typing the first few letters of major cities like Mumbai, Delhi, Jaipur, or Kochi.")
    }
  }

  return (
    <div className={`bg-slate-50 font-sans text-slate-900 flex flex-col ${viewMode === 'map' ? 'h-screen overflow-hidden' : 'min-h-screen pb-12'}`}>
      
      <div className="shrink-0 sticky top-0 z-20 bg-slate-50 border-b border-slate-200 shadow-sm pb-6">
        <header className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold tracking-tight text-slate-800">CareNav</h1>
            </div>
            <div className="text-sm font-medium px-3 py-1 bg-blue-50 text-blue-700 rounded-full">
              Hackathon Prototype
            </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto px-4 pt-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">Procedure Cost Explorer</h2>
              <p className="text-slate-500 text-lg">Compare real costs across Government, Trust, and Private hospitals.</p>
            </div>
            
            <div className="flex bg-slate-200 p-1 rounded-xl w-fit">
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${viewMode === 'list' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600'}`}
              >
                <List className="w-4 h-4" /> List View
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${viewMode === 'map' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600'}`}
              >
                <MapIcon className="w-4 h-4" /> Map View
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search procedures..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex bg-slate-200 p-1 rounded-xl w-fit shrink-0">
              {['tier1', 'tier2', 'tier3'].map((tier) => (
                <button
                  key={tier}
                  onClick={() => setSelectedTier(tier)}
                  className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all ${selectedTier === tier ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600'}`}
                >
                  {tier === 'tier1' ? 'Tier 1 (Metro)' : tier === 'tier2' ? 'Tier 2 (Urban)' : 'Tier 3 (Rural)'}
                </button>
              ))}
            </div>
          </div>
        </div> 
      </div>

      <main className={`max-w-6xl w-full mx-auto px-4 ${viewMode === 'map' ? 'flex-1 flex flex-col py-4 min-h-0' : 'py-8'}`}>
        {viewMode === 'list' ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProcedures.map((procedure) => (
              <div key={procedure.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col hover:shadow-md transition-shadow">
                <div className="flex-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-1 rounded-md mb-3 inline-block">
                    {procedure.category}
                  </span>
                  <h3 className="text-xl font-bold mb-2">{procedure.name}</h3>
                  <p className="text-slate-600 mb-6 text-sm line-clamp-3">{procedure.description}</p>
                </div>
                
                <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-500 flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-green-600" /> Govt Est:
                    </span>
                    <span className="font-bold text-green-700">{procedure.costs?.[selectedTier]?.government || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-500 flex items-center gap-1.5">
                      <HeartHandshake className="w-4 h-4 text-blue-500" /> Trust/Charity:
                    </span>
                    <span className="font-bold text-blue-700">{procedure.costs?.[selectedTier]?.trust || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-500 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-slate-600" /> Private:
                    </span>
                    <span className="font-bold text-lg text-slate-900">{procedure.costs?.[selectedTier]?.private || 'N/A'}</span>
                  </div>
                </div>
                
                <div className="mt-auto flex flex-col gap-3">
                  <button 
                    onClick={() => setActiveModal(procedure)}
                    className="w-full py-2.5 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                  >
                    <Info className="w-4 h-4" /> Analyze Costs & Schemes
                  </button>
                  <button 
                    onClick={() => {
                      setActiveMapProcedure(procedure)
                      setViewMode('map')
                    }}
                    className="w-full py-2.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl font-medium hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <MapIcon className="w-4 h-4" /> View Facilities on Map
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4 flex-1 min-h-0">
            <div className="shrink-0 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-slate-800">{activeMapProcedure ? `Showing facilities for: ${activeMapProcedure.name}` : 'Facility Map'}</h3>
                <p className="text-sm text-slate-500">Discover Government, Trust, and Private care options near you.</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex gap-2 w-full sm:w-auto relative">
                  
                  {/* WRAPPED INPUT FOR DROPDOWN POSITIONING */}
                  <div className="relative w-full sm:w-48">
                    <input 
                      type="text" 
                      placeholder="Enter city..."
                      className="px-4 py-2 w-full rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={customCity}
                      onChange={handleCityInputChange}
                      onFocus={() => { if(customCity.trim() && suggestions.length > 0) setShowSuggestions(true) }}
                      // Delay hides dropdown so click event on <li> can fire
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} 
                      onKeyDown={(e) => e.key === 'Enter' && handleCitySearch()}
                    />
                    
                    {/* DROPDOWN MENU */}
                    {showSuggestions && suggestions.length > 0 && (
                      <ul className="absolute z-50 w-full bg-white border border-slate-200 shadow-lg rounded-xl mt-1 max-h-48 overflow-y-auto">
                        {suggestions.map((city) => (
                          <li 
                            key={city}
                            className="px-4 py-2 hover:bg-blue-50 cursor-pointer capitalize text-sm text-slate-700 font-medium transition-colors"
                            onClick={() => handleSuggestionClick(city)}
                          >
                            {city}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <button 
                    onClick={handleCitySearch}
                    className="px-4 py-2 bg-slate-800 text-white rounded-xl font-medium hover:bg-slate-700 transition-colors"
                  >
                    Go
                  </button>
                </div>
                
                <span className="text-slate-300 hidden sm:flex items-center">|</span>
                
                <button 
                  onClick={handleLocateMe}
                  disabled={isLocating}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:bg-blue-400 w-full sm:w-auto"
                >
                  <Navigation className={`w-4 h-4 ${isLocating ? 'animate-pulse' : ''}`} /> 
                  {isLocating ? 'Locating...' : 'My Location'}
                </button>
              </div>
            </div>

            <div className="flex-1 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative z-0">
              <MapContainer center={[17.4065, 78.4772]} zoom={11} className="w-full h-full rounded-xl">
                <MapFlyTo coords={flyLocation} />
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {flyLocation && (
                  <CircleMarker center={flyLocation} radius={8} pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.9 }}>
                    <Popup><strong className="text-red-600">Location Pinned</strong></Popup>
                  </CircleMarker>
                )}
                {mockHospitals.map(hospital => (
                  <CircleMarker 
                    key={hospital.id} 
                    center={[hospital.lat, hospital.lng]} 
                    radius={10}
                    pathOptions={{ color: hospital.color, fillColor: hospital.color, fillOpacity: 0.8 }}
                  >
                    <Popup>
                      <div className="font-sans">
                        <h4 className="font-bold text-slate-800">{hospital.name}</h4>
                        <p className="text-xs uppercase font-bold text-slate-500 mb-2">{hospital.type}</p>
                        {activeMapProcedure && (
                          <div className="mt-2 pt-2 border-t border-slate-200">
                            <span className="text-xs text-slate-500 block mb-1">Estimated Cost:</span>
                            <strong className="text-slate-900">{activeMapProcedure.costs[selectedTier][hospital.type]}</strong>
                          </div>
                        )}
                      </div>
                    </Popup>
                  </CircleMarker>
                ))}
              </MapContainer>
            </div>
          </div>
        )}
      </main>

      {/* Analysis Modal Overlay */}
      {activeModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h3 className="text-xl font-bold text-slate-900">{activeModal.name}</h3>
                <p className="text-sm text-slate-500 capitalize">{selectedTier.replace('tier', 'Tier ')} Analysis</p>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-2 hover:bg-slate-100 rounded-full">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <h4 className="font-bold text-slate-800 mb-3">Facility Cost Comparison</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                    <p className="text-xs font-semibold text-green-700 uppercase mb-1">Government</p>
                    <p className="font-bold text-lg text-green-900">{activeModal.costs?.[selectedTier]?.government || 'N/A'}</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <p className="text-xs font-semibold text-blue-700 uppercase mb-1">Trust/Charity</p>
                    <p className="font-bold text-lg text-blue-900">{activeModal.costs?.[selectedTier]?.trust || 'N/A'}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <p className="text-xs font-semibold text-slate-700 uppercase mb-1">Private (Avg)</p>
                    <p className="font-bold text-lg text-slate-900">{activeModal.costs?.[selectedTier]?.private || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-amber-900 mb-1">Hidden Costs to Verify</h4>
                    {activeModal.hidden_costs?.length > 0 ? (
                      <ul className="text-sm text-amber-800 list-disc list-inside space-y-1">
                        {activeModal.hidden_costs.map((cost, idx) => <li key={idx}>{cost}</li>)}
                      </ul>
                    ) : <p className="text-sm text-amber-800">No specific hidden costs documented.</p>}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Applicable Schemes
                </h4>
                <div className="space-y-3">
                  {activeModal.schemes?.length > 0 ? (
                    activeModal.schemes.map((scheme, idx) => (
                      <div key={idx} className="p-4 border border-slate-200 rounded-xl bg-white shadow-sm">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-blue-700">{scheme.name}</span>
                          <span className="text-xs font-bold bg-blue-50 text-blue-700 px-2 py-1 rounded">Coverage: {scheme.coverage}</span>
                        </div>
                        <p className="text-sm text-slate-600"><strong>Eligibility:</strong> {scheme.eligibility}</p>
                      </div>
                    ))
                  ) : <p className="text-sm text-slate-500 italic">No government schemes available.</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App