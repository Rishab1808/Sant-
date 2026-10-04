import { useState, useRef, useEffect } from 'react'
import { Search, ShieldAlert, MapPin, Info, X, CheckCircle2, AlertTriangle, Map as MapIcon, List, Building2, HeartHandshake, Navigation, Calculator, Tag } from 'lucide-react'
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import data from '../healthcare_data.json'

const mockHospitals = [
  { id: 1, name: 'Gandhi General Hospital', type: 'government', lat: 17.3950, lng: 78.4767, color: '#16a34a', insurances: ['PM-JAY', 'State Scheme'] },
  { id: 2, name: 'Lions Club Trust Hospital', type: 'trust', lat: 17.3650, lng: 78.4967, color: '#2563eb', insurances: ['Star Health', 'Care Health'] },
  { id: 3, name: 'Apollo Premium Care', type: 'private', lat: 17.4050, lng: 78.4367, color: '#475569', insurances: ['HDFC Ergo', 'ICICI Lombard', 'Star Health'] },
  { id: 4, name: 'KEM Hospital (Govt)', type: 'government', lat: 19.0560, lng: 72.8577, color: '#16a34a', insurances: ['PM-JAY', 'State Scheme'] },
  { id: 5, name: 'Holy Spirit Charity', type: 'trust', lat: 19.0960, lng: 72.8977, color: '#2563eb', insurances: ['HDFC Ergo', 'Care Health'] },
  { id: 6, name: 'Lilavati Premium', type: 'private', lat: 19.0360, lng: 72.8277, color: '#475569', insurances: ['ICICI Lombard', 'Star Health', 'Care Health'] },
  { id: 7, name: 'Safdarjung Hospital', type: 'government', lat: 28.5672, lng: 77.2010, color: '#16a34a', insurances: ['PM-JAY'] },
  { id: 8, name: 'St. Stephen Trust', type: 'trust', lat: 28.6741, lng: 77.2525, color: '#2563eb', insurances: ['Care Health', 'Star Health'] },
  { id: 9, name: 'Max Super Speciality', type: 'private', lat: 28.6341, lng: 77.1225, color: '#475569', insurances: ['HDFC Ergo', 'ICICI Lombard', 'Star Health'] },
  { id: 10, name: 'Victoria Hospital', type: 'government', lat: 12.9516, lng: 77.5746, color: '#16a34a', insurances: ['PM-JAY', 'State Scheme'] },
  { id: 11, name: 'Sathya Sai Trust', type: 'trust', lat: 12.9916, lng: 77.6146, color: '#2563eb', insurances: ['HDFC Ergo', 'Star Health'] },
  { id: 12, name: 'Manipal Premium', type: 'private', lat: 12.9316, lng: 77.6346, color: '#475569', insurances: ['ICICI Lombard', 'Care Health', 'Star Health'] },
  { id: 13, name: 'Rajiv Gandhi Govt', type: 'government', lat: 13.0827, lng: 80.2707, color: '#16a34a', insurances: ['PM-JAY', 'State Scheme'] },
  { id: 14, name: 'Chennai Mission Trust', type: 'trust', lat: 13.0427, lng: 80.2207, color: '#2563eb', insurances: ['Star Health', 'HDFC Ergo'] },
  { id: 15, name: 'Kauvery Private Care', type: 'private', lat: 13.0127, lng: 80.2507, color: '#475569', insurances: ['ICICI Lombard', 'Care Health', 'HDFC Ergo'] },
  { id: 16, name: 'SSKM Government', type: 'government', lat: 22.5326, lng: 88.3439, color: '#16a34a', insurances: ['PM-JAY', 'State Scheme'] },
  { id: 17, name: 'Ramakrishna Mission', type: 'trust', lat: 22.5926, lng: 88.3839, color: '#2563eb', insurances: ['Star Health', 'Care Health'] },
  { id: 18, name: 'AMRI Private', type: 'private', lat: 22.5026, lng: 88.3639, color: '#475569', insurances: ['HDFC Ergo', 'ICICI Lombard', 'Star Health'] },
  { id: 19, name: 'Sassoon General', type: 'government', lat: 18.5204, lng: 73.8767, color: '#16a34a', insurances: ['PM-JAY', 'State Scheme'] },
  { id: 20, name: 'KEM Pune Trust', type: 'trust', lat: 18.4904, lng: 73.8367, color: '#2563eb', insurances: ['Care Health', 'HDFC Ergo'] },
  { id: 21, name: 'Ruby Hall Clinic', type: 'private', lat: 18.5404, lng: 73.8967, color: '#475569', insurances: ['ICICI Lombard', 'Star Health', 'Care Health'] },
  { id: 22, name: 'Civil Hospital', type: 'government', lat: 23.0525, lng: 72.6014, color: '#16a34a', insurances: ['PM-JAY', 'State Scheme'] },
  { id: 23, name: 'VSF Charity Hospital', type: 'trust', lat: 23.0025, lng: 72.5514, color: '#2563eb', insurances: ['Star Health', 'HDFC Ergo'] },
  { id: 24, name: 'Zydus Premium Care', type: 'private', lat: 23.0625, lng: 72.5114, color: '#475569', insurances: ['HDFC Ergo', 'ICICI Lombard', 'Care Health'] },
  { id: 25, name: 'SMS Hospital', type: 'government', lat: 26.9024, lng: 75.8073, color: '#16a34a', insurances: ['PM-JAY', 'State Scheme'] },
  { id: 26, name: 'Narayana Trust Care', type: 'trust', lat: 26.8524, lng: 75.7573, color: '#2563eb', insurances: ['Care Health', 'Star Health'] },
  { id: 27, name: 'Fortis Jaipur', type: 'private', lat: 26.8824, lng: 75.8373, color: '#475569', insurances: ['HDFC Ergo', 'ICICI Lombard', 'Star Health'] },
  { id: 28, name: 'KGMU Hospital', type: 'government', lat: 26.8667, lng: 80.9162, color: '#16a34a', insurances: ['PM-JAY'] },
  { id: 29, name: 'Sahara Trust', type: 'trust', lat: 26.8167, lng: 80.9762, color: '#2563eb', insurances: ['Star Health', 'HDFC Ergo'] },
  { id: 30, name: 'Medanta Lucknow', type: 'private', lat: 26.8367, lng: 80.9062, color: '#475569', insurances: ['ICICI Lombard', 'Care Health', 'HDFC Ergo'] },
  { id: 31, name: 'PGIMER', type: 'government', lat: 30.7633, lng: 76.7794, color: '#16a34a', insurances: ['PM-JAY', 'State Scheme'] },
  { id: 32, name: 'Rotary Trust Hospital', type: 'trust', lat: 30.7133, lng: 76.8094, color: '#2563eb', insurances: ['Care Health', 'Star Health'] },
  { id: 33, name: 'Max Super Speciality', type: 'private', lat: 30.7233, lng: 76.7294, color: '#475569', insurances: ['HDFC Ergo', 'ICICI Lombard', 'Star Health'] },
  { id: 34, name: 'AIIMS Bhopal', type: 'government', lat: 23.2099, lng: 77.4526, color: '#16a34a', insurances: ['PM-JAY', 'State Scheme'] },
  { id: 35, name: 'BMHRC Trust', type: 'trust', lat: 23.2899, lng: 77.4026, color: '#2563eb', insurances: ['Star Health', 'HDFC Ergo'] },
  { id: 36, name: 'Bansal Private Care', type: 'private', lat: 23.2299, lng: 77.3826, color: '#475569', insurances: ['ICICI Lombard', 'Care Health', 'Star Health'] },
  { id: 37, name: 'Ernakulam General', type: 'government', lat: 9.9712, lng: 76.2873, color: '#16a34a', insurances: ['PM-JAY', 'State Scheme'] },
  { id: 38, name: 'Amrita Trust', type: 'trust', lat: 10.0312, lng: 76.3273, color: '#2563eb', insurances: ['Care Health', 'Star Health'] },
  { id: 39, name: 'Aster Medcity', type: 'private', lat: 10.0612, lng: 76.2573, color: '#475569', insurances: ['HDFC Ergo', 'ICICI Lombard', 'Care Health'] }
];
const formatWhatsAppMessage = (procedureName, cityTier, costs, schemes, hospitals) => {
  let message = `*Procedure:* ${procedureName}\n`;
  message += `*City/Tier:* ${cityTier}\n\n`;
  
  message += `*Cost Breakdown:*\n`;
  message += `- Government: ₹${costs.govt}\n`;
  message += `- Trust: ₹${costs.trust}\n`;
  message += `- Private: ₹${costs.private}\n\n`;
  
  message += `*Applicable Government Schemes:*\n`;
  if (schemes && schemes.length > 0) {
    schemes.forEach(scheme => {
      message += `- ${scheme}\n`;
    });
  } else {
    message += `- None found\n`;
  }
  message += `\n*Available Hospitals:*\n`;
  
  hospitals.forEach(hospital => {
    message += `🏥 ${hospital.name}\n`;
    message += `📍 https://maps.google.com/?q=${hospital.lat},${hospital.lng || 0}\n\n`;
  });

  return `https://wa.me/?text=${encodeURIComponent(message)}`;
};
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

const categoryKeywords = {
  'cardiology': ['heart', 'chest pain', 'cardiac', 'breathlessness', 'palpitations', 'attack', 'stroke', 'blocked', 'artery', 'bp', 'blood pressure'],
  'surgery': ['stomach', 'belly', 'abdomen', 'pain', 'cut', 'operation', 'lump'],
  'general surgery': ['stomach', 'belly', 'abdomen', 'pain', 'cut', 'operation', 'lump', 'gallstones', 'hernia', 'groin', 'piles', 'bleeding'],
  'general medicine': ['fever', 'infection', 'sick', 'weakness', 'cough', 'breathing', 'virus', 'bacteria', 'disease'],
  'ophthalmology': ['eye', 'vision', 'blurry', 'blind', 'sight', 'glasses', 'cataract', 'retina', 'specs'],
  'diagnostics': ['test', 'scan', 'imaging', 'report', 'x-ray', 'xray', 'checkup', 'machine'],
  'orthopedics': ['bone', 'joint', 'pain', 'fracture', 'broken', 'spine', 'back', 'knee', 'hip', 'ligament', 'slip disc', 'sciatica'],
  'obstetrics': ['pregnancy', 'baby', 'birth', 'delivery', 'maternity', 'labor', 'pregnant', 'childbirth'],
  'gynecology': ['uterus', 'womb', 'period', 'bleeding', 'cyst', 'ovary', 'fibroid', 'women', 'female'],
  'nephrology': ['kidney', 'renal', 'urine', 'pee', 'dialysis', 'failure'],
  'urology': ['urine', 'pee', 'prostate', 'stone', 'kidney stone', 'bladder'],
  'oncology': ['cancer', 'tumor', 'chemo', 'radiation', 'malignant', 'carcinoma', 'lump'],
  'ent': ['ear', 'nose', 'throat', 'hearing', 'deaf', 'tonsils', 'swallowing', 'eardrum'],
  'dental': ['tooth', 'teeth', 'toothache', 'cavity', 'decay', 'gums', 'dentist'],
  'pulmonology': ['lungs', 'breathing', 'cough', 'asthma', 'breath', 'chest'],
  'pediatrics': ['baby', 'infant', 'newborn', 'child', 'kid', 'nicu'],
  'infectious diseases': ['bite', 'dog', 'animal', 'rabies', 'virus', 'infection'],
  'hematology': ['blood', 'anemia', 'hemoglobin', 'weakness'],
  'plastic surgery': ['burn', 'skin', 'wound', 'scar', 'reconstruction', 'graft'],
  'vascular surgery': ['vein', 'artery', 'blood vessel', 'dialysis access']
};

const procedureKeywords = {
  'p1': ['belly ache', 'stomach pain', 'burst appendix', 'right side pain', 'appendicitis'],
  'p2': ['mosquito', 'platelets', 'bone breaking fever', 'severe fever', 'dengue'],
  'p3': ['cloudy eye', 'cataract', 'white eye', 'lens replacement'],
  'p4': ['brain scan', 'spine scan', 'mri', 'magnetic resonance', 'head scan'],
  'p5': ['knee pain', 'cannot walk', 'joint replacement', 'tkr', 'artificial knee'],
  'p6': ['heart attack', 'stent', 'blockage', 'chest pain', 'clogged artery', 'balloon'],
  'p7': ['normal delivery', 'childbirth', 'labor pain', 'having a baby', 'vaginal birth'],
  'p8': ['gallstones', 'gallbladder', 'stomach pain', 'stone in belly', 'laparoscopy'],
  'p9': ['c-section', 'cesarean', 'operation delivery', 'surgical birth', 'stomach cut baby'],
  'p10': ['bypass', 'open heart', 'heart attack', 'major blockage', 'cabg'],
  'p11': ['kidney failure', 'blood cleaning', 'ckd', 'dialysis machine'],
  'p12': ['kidney failure', 'organ transplant', 'new kidney', 'donor kidney'],
  'p13': ['cancer treatment', 'chemo', 'tumor shrinking', 'hair loss', 'cancer drugs'],
  'p14': ['cancer treatment', 'radiation', 'tumor burning', 'radiotherapy'],
  'p15': ['stomach scan', 'belly scan', 'ct scan', 'computed tomography'],
  'p16': ['heart scan', 'echo', 'heart ultrasound', 'valve test', 'echocardiogram'],
  'p17': ['hip pain', 'fractured hip', 'hip joint', 'cannot walk', 'broken hip', 'thr'],
  'p18': ['sports injury', 'torn ligament', 'knee popping', 'acl', 'keyhole knee'],
  'p19': ['sore throat', 'tonsils', 'swallowing pain', 'throat operation'],
  'p20': ['hole in ear', 'eardrum', 'hearing loss', 'ear discharge', 'tympanoplasty'],
  'p21': ['kidney stone', 'laser stone', 'pain in side', 'blood in urine', 'stone removal'],
  'p22': ['prostate', 'difficulty peeing', 'old man pee', 'frequent urination', 'turp'],
  'p23': ['groin lump', 'hernia', 'bulge in stomach', 'mesh repair'],
  'p24': ['piles', 'haemorrhoids', 'bleeding while pooping', 'painful sitting', 'laser piles'],
  'p25': ['pneumonia', 'lung infection', 'heavy breathing', 'cough with phlegm', 'chest infection'],
  'p26': ['heart test', 'angiogram', 'check for blockages', 'cath lab', 'dye test heart'],
  'p27': ['slow heartbeat', 'fainting', 'pacemaker', 'heart rhythm', 'battery for heart'],
  'p28': ['remove glasses', 'lasik', 'laser eye', 'specs removal', 'vision correction'],
  'p29': ['retinal detachment', 'eye bleeding', 'dark spots in vision', 'vitrectomy', 'floaters'],
  'p30': ['typhoid', 'high fever', 'water borne', 'salmonella', 'prolonged fever'],
  'p31': ['diabetic foot', 'foot ulcer', 'wound not healing', 'black toe', 'sugar wound'],
  'p32': ['breast cancer', 'breast removal', 'lump in breast', 'mastectomy', 'tumor excision'],
  'p33': ['cancer spread test', 'pet scan', 'whole body scan', 'pet ct', 'nuclear scan'],
  'p34': ['uterus removal', 'heavy periods', 'fibroids', 'hysterectomy', 'womb removal'],
  'p35': ['ovary lump', 'ovarian cyst', 'pelvic pain', 'water bag', 'cyst removal'],
  'p36': ['slip disc', 'sciatica', 'lower back pain', 'leg pain shooting', 'spine surgery', 'discectomy'],
  'p37': ['two stents', 'double blockage', 'heart attack', 'multiple blockages'],
  'p38': ['nicu', 'premature baby', 'baby in glass box', 'jaundice baby', 'sick newborn'],
  'p39': ['ventilator', 'life support', 'can\'t breathe', 'icu machine', 'breathing tube'],
  'p40': ['endoscopy', 'stomach tube', 'acidity', 'ulcer', 'vomiting blood', 'camera in throat'],
  'p41': ['colonoscopy', 'bowel test', 'blood in stool', 'large intestine tube', 'rectum camera'],
  'p42': ['rct', 'root canal', 'severe toothache', 'decayed tooth', 'dental nerve'],
  'p43': ['fistula', 'pus from bum', 'anal pain', 'fistulotomy', 'anal tract'],
  'p44': ['thyroid', 'goiter', 'neck swelling', 'thyroid cancer', 'throat lump'],
  'p45': ['head injury', 'brain bleed', 'accident head scan', 'head ct', 'skull fracture'],
  'p46': ['dog bite', 'monkey bite', 'rabies', 'anti rabies injection', 'animal bite'],
  'p47': ['appendix without surgery', 'mild appendicitis', 'stomach pain antibiotics', 'appendix medicine'],
  'p48': ['blood transfusion', 'low blood', 'blood bag', 'hb low', 'severe anemia'],
  'p49': ['av fistula', 'dialysis prep', 'vein surgery for dialysis', 'arm vein connection'],
  'p50': ['skin grafting', 'burn treatment', 'acid attack', 'skin peeling', 'new skin']
};

function MapFlyTo({ coords }) {
  const map = useMap()
  if (coords) {
    map.flyTo(coords, 11, { duration: 1.5 })
  }
  return null
}

const getHiddenCostValue = (text, privateCostRangeString) => {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }
  const percentage = 6 + (Math.abs(hash) % 10);
  let baseCost = 20000;
  if (privateCostRangeString && privateCostRangeString !== 'N/A') {
    const matches = privateCostRangeString.replace(/,/g, '').match(/\d+/g);
    if (matches && matches.length >= 1) {
      baseCost = parseInt(matches[0], 10);
    }
  }
  const rawValue = (baseCost * percentage) / 100;
  return Math.max(500, Math.round(rawValue / 100) * 100);
};

const parseCostRange = (costString) => {
  if (!costString || costString === 'N/A') return [0, 0];
  const matches = costString.replace(/,/g, '').match(/\d+/g);
  if (!matches) return [0, 0];
  if (matches.length === 1) return [parseInt(matches[0], 10), parseInt(matches[0], 10)];
  return [parseInt(matches[0], 10), parseInt(matches[1], 10)];
};

const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const getStemmedTerm = (word) => {
  const lower = word.toLowerCase();
  if (lower.length <= 3) return lower; 
  if (lower.endsWith('ss')) return lower; 
  if (lower.endsWith('s')) return lower.slice(0, -1); 
  return lower;
};

// Match whole words as well as the beginning of a word. This keeps search
// responsive while a user is typing a symptom (for example, "he" → "heart").
const matchesSearchWord = (searchWord, searchableText) => {
  const searchBase = getStemmedTerm(searchWord);
  const prefixRegex = new RegExp(`\\b${escapeRegExp(searchBase)}\\w*`, 'i');
  return prefixRegex.test(searchableText);
};

const HighlightText = ({ text, highlight }) => {
  if (!highlight.trim()) return <>{text}</>;
  
  const searchTokens = highlight.trim().split(/\s+/).filter(Boolean).map(w => {
    const escapedStem = escapeRegExp(getStemmedTerm(w));
    return `\\b${escapedStem}\\w*`;
  });

  if (searchTokens.length === 0) return <>{text}</>;

  const combinedRegex = new RegExp(`(${searchTokens.join('|')})`, 'gi');
  const parts = text.split(combinedRegex);
  
  return (
    <>
      {parts.map((part, i) => {
        if (part && new RegExp(`^(${searchTokens.join('|')})$`, 'i').test(part)) {
          return <span key={i} className="bg-yellow-200 text-yellow-900 rounded-sm px-0.5">{part}</span>;
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
};

function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTier, setSelectedTier] = useState('tier1')
  const [selectedInsurance, setSelectedInsurance] = useState('All')
  const [viewMode, setViewMode] = useState('list')
  
  const [activeModal, setActiveModal] = useState(null)
  const [activeMapProcedure, setActiveMapProcedure] = useState(null)
  
  const [flyLocation, setFlyLocation] = useState(null)
  const [isLocating, setIsLocating] = useState(false)
  const [customCity, setCustomCity] = useState('')
  
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  const [checkedExtras, setCheckedExtras] = useState([])

  useEffect(() => {
    setCheckedExtras([])
  }, [activeModal, selectedTier])

  const filteredProcedures = data.procedures.filter(procedure => {
    const searchString = searchTerm.toLowerCase().trim();
    if (!searchString) return true; 

    const catKeywords = categoryKeywords[procedure.category.toLowerCase()] || [];
    const procKeywords = procedureKeywords[procedure.id] || [];

    const searchableText = `
      ${procedure.name}
      ${procedure.category}
      ${procedure.description}
      ${catKeywords.join(' ')}
      ${procKeywords.join(' ')}
    `.toLowerCase();

    const searchWords = searchString.split(/\s+/).filter(Boolean);
    
    const matchesAllWords = searchWords.every(word => matchesSearchWord(word, searchableText));
    
    return matchesAllWords;
  });

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

  const handleCityInputChange = (e) => {
    const val = e.target.value
    setCustomCity(val)
    
    if (val.trim()) {
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

  const handleSuggestionClick = (cityKey) => {
    const formattedCity = cityKey.charAt(0).toUpperCase() + cityKey.slice(1)
    setCustomCity(formattedCity)
    setShowSuggestions(false)
    setFlyLocation(cityCoordinates[cityKey])
  }

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

  let baseMin = 0;
  let baseMax = 0;
  let extraCostsTotal = 0;
  
  const privateCostStr = activeModal?.costs?.[selectedTier]?.private || '0';

  if (activeModal) {
    [baseMin, baseMax] = parseCostRange(privateCostStr);
    checkedExtras.forEach(idx => {
      extraCostsTotal += getHiddenCostValue(activeModal.hidden_costs[idx], privateCostStr);
    });
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
                placeholder="Try searching 'hearts', 'vomitings', or 'cataract'..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              value={selectedInsurance}
              onChange={(e) => setSelectedInsurance(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm font-medium text-slate-700"
            >
              <option value="All">Any Insurance</option>
              <option value="PM-JAY">Ayushman Bharat (PM-JAY)</option>
              <option value="State Scheme">State Health Scheme</option>
              <option value="Star Health">Star Health</option>
              <option value="HDFC Ergo">HDFC Ergo</option>
              <option value="ICICI Lombard">ICICI Lombard</option>
              <option value="Care Health">Care Health</option>
            </select>
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
          <>
            {/* NEW: Search Results Counter Badge */}
            {searchTerm.trim() !== '' && filteredProcedures.length > 0 && (
              <div className="mb-6 flex items-center gap-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-semibold shadow-sm">
                  <Search className="w-4 h-4 text-indigo-500" />
                  {filteredProcedures.length} {filteredProcedures.length === 1 ? 'Result' : 'Results'}
                </div>
                <p className="text-sm text-slate-500 font-medium">
                  found for <span className="text-slate-800 font-bold">"{searchTerm}"</span>
                </p>
              </div>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProcedures.length > 0 ? (
                filteredProcedures.map((procedure) => {
                  const searchString = searchTerm.toLowerCase().trim();
                  let showHiddenBadge = false;
                  let matchedKeyword = '';

                  if (searchString) {
                    const visibleText = `${procedure.name} ${procedure.category} ${procedure.description}`.toLowerCase();
                    const searchWords = searchString.split(/\s+/).filter(Boolean);
                    
                    const isVisible = searchWords.every(word => matchesSearchWord(word, visibleText));
                    
                    if (!isVisible) {
                      showHiddenBadge = true;
                      
                      const catKeywords = categoryKeywords[procedure.category.toLowerCase()] || [];
                      const procKeywords = procedureKeywords[procedure.id] || [];
                      const allHidden = [...catKeywords, ...procKeywords];
                      
                      const foundKeyword = allHidden.find(kw => {
                         return searchWords.some(word => matchesSearchWord(word, kw));
                      });
                      matchedKeyword = foundKeyword || searchString;
                    }
                  }

                  return (
                    <div key={procedure.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col hover:shadow-md transition-shadow relative">
                      <div className="flex-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-1 rounded-md mb-3 inline-block">
                          <HighlightText text={procedure.category} highlight={searchTerm} />
                        </span>
                        <h3 className="text-xl font-bold mb-2">
                          <HighlightText text={procedure.name} highlight={searchTerm} />
                        </h3>
                        <p className="text-slate-600 mb-3 text-sm line-clamp-3">
                          <HighlightText text={procedure.description} highlight={searchTerm} />
                        </p>
                        
                        {showHiddenBadge && (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 mb-4 rounded-md bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-medium">
                            <Tag className="w-3 h-3" />
                            Matches symptom: <span className="font-bold capitalize">{matchedKeyword}</span>
                          </div>
                        )}
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
                  )
                })
              ) : (
                <div className="col-span-full py-12 text-center">
                  <ShieldAlert className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-slate-700">No procedures found</h3>
                  <p className="text-slate-500">Try searching for different symptoms or body parts.</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-4 flex-1 min-h-0">
            <div className="shrink-0 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-slate-800">{activeMapProcedure ? `Showing facilities for: ${activeMapProcedure.name}` : 'Facility Map'}</h3>
                <p className="text-sm text-slate-500">Discover Government, Trust, and Private care options near you.</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex gap-2 w-full sm:w-auto relative">
                  
                  <div className="relative w-full sm:w-48">
                    <input 
                      type="text" 
                      placeholder="Enter city..."
                      className="px-4 py-2 w-full rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={customCity}
                      onChange={handleCityInputChange}
                      onFocus={() => { if(customCity.trim() && suggestions.length > 0) setShowSuggestions(true) }}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} 
                      onKeyDown={(e) => e.key === 'Enter' && handleCitySearch()}
                    />
                    
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
                {mockHospitals
                  .filter(hospital => selectedInsurance === 'All' || hospital.insurances?.includes(selectedInsurance))
                  .map(hospital => (
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
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl relative">
            
            {/* Modal Header */}
            <div className="shrink-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <div>
                <h3 className="text-xl font-bold text-slate-900">{activeModal.name}</h3>
                <p className="text-sm text-slate-500 capitalize">{selectedTier.replace('tier', 'Tier ')} Analysis</p>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-2 hover:bg-slate-100 rounded-full">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            
            {/* Modal Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
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
                    <p className="text-xs font-semibold text-slate-700 uppercase mb-1">Private (Base)</p>
                    <p className="font-bold text-lg text-slate-900">{activeModal.costs?.[selectedTier]?.private || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Interactive Hidden Costs Section */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <h4 className="font-bold text-amber-900">Interactive Hidden Costs Calculator</h4>
                </div>
                <p className="text-sm text-amber-800 mb-4">
                  Check the extra variables below to see how they impact your final private hospital bill.
                </p>
                
                {activeModal.hidden_costs?.length > 0 ? (
                  <div className="space-y-3">
                    {activeModal.hidden_costs.map((costText, idx) => {
                      const costValue = getHiddenCostValue(costText, privateCostStr);
                      const isChecked = checkedExtras.includes(idx);
                      
                      return (
                        <label 
                          key={idx} 
                          className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${isChecked ? 'bg-amber-100 border-amber-300 shadow-sm' : 'bg-white border-amber-200 hover:bg-amber-50'}`}
                        >
                          <input 
                            type="checkbox" 
                            className="mt-1 w-4 h-4 text-amber-600 bg-white border-amber-300 rounded focus:ring-amber-500 cursor-pointer"
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setCheckedExtras([...checkedExtras, idx]);
                              } else {
                                setCheckedExtras(checkedExtras.filter(i => i !== idx));
                              }
                            }}
                          />
                          <div className="flex-1">
                            <span className={`text-sm block ${isChecked ? 'text-amber-900 font-medium' : 'text-amber-800'}`}>
                              {costText}
                            </span>
                          </div>
                          <span className="text-sm font-bold text-amber-700 whitespace-nowrap bg-amber-200/50 px-2 py-1 rounded">
                            + ₹{costValue.toLocaleString('en-IN')}
                          </span>
                        </label>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-amber-800">No specific hidden costs documented.</p>
                )}
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
{/* WHATSAPP BUTTON */}
              <div className="pt-4 border-t border-slate-100 mt-4">
                <button 
                  onClick={() => {
                    const procedureName = activeModal.name;
                    const cityOrTier = selectedTier.replace('tier', 'Tier ');
                    const costs = {
                      govt: activeModal.costs?.[selectedTier]?.government || 'N/A',
                      trust: activeModal.costs?.[selectedTier]?.trust || 'N/A',
                      private: activeModal.costs?.[selectedTier]?.private || 'N/A'
                    };
                    const schemesList = activeModal.schemes?.map(s => s.name) || [];
                    
                    const link = formatWhatsAppMessage(procedureName, cityOrTier, costs, schemesList, mockHospitals);
                    window.open(link, '_blank');
                  }}
                  className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  Share to WhatsApp
                </button>
              </div>
            {/* Sticky Footer Calculator */}
            <div className="shrink-0 sticky bottom-0 bg-slate-900 rounded-b-2xl p-5 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.1)] z-20">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-slate-800 p-2 rounded-lg">
                    <Calculator className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Total Estimated Bill (Private)</p>
                    <p className="text-sm text-slate-300">Base Cost + {checkedExtras.length} Selected Extras</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-white tracking-tight">
                    ₹{(baseMin + extraCostsTotal).toLocaleString('en-IN')} - ₹{(baseMax + extraCostsTotal).toLocaleString('en-IN')}
                  </span>
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
