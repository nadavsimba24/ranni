import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { MapPin, ArrowUpDown, Search, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import L from 'leaflet';

// טיפוסים
type Project = {
  requestNumber: string;
  authority: string;
  requestAmount: number;
  totalBudget: number;
  externalSources: number;
  funder: string;
  budgetItem: string;
  governmentBalance: number;
  lat: number;
  lng: number;
};

type AuthoritySummary = {
  totalRequests: number;
  totalBudget: number;
  totalBalance: number;
  projectCount: number;
};

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Project>('requestAmount');
  const [sortDirection, setSort] = useState<'asc' | 'desc'>('desc');
  const [selectedAuthority, setSelectedAuthority] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([31.5, 35]);
  const [mapZoom, setMapZoom] = useState(8);

  // נתוני הפרויקטים
  const projects: Project[] = [
    {
      requestNumber: "1001259764",
      authority: "ג'לג'וליה",
      requestAmount: 6907,
      totalBudget: 6907,
      externalSources: 6907,
      funder: "משרד החינוך",
      budgetItem: "5442",
      governmentBalance: 3681,
      lat: 32.15306236,
      lng: 34.95042999
    },
     {
    "requestNumber": "1001264444",
    "authority": "באר יעקב",
    "requestAmount": 19000,
    "totalBudget": 23000,
    "externalSources": 4000,
    "funder": "עיריית באר יעקב",
    "budgetItem": "6744",
    "governmentBalance": 15000,
    "lat": 31.9138,
    "lng": 34.8365
  },
  {
    "requestNumber": "1001264545",
    "authority": "גבעת שמואל",
    "requestAmount": 12000,
    "totalBudget": 15000,
    "externalSources": 3000,
    "funder": "משרד השיכון",
    "budgetItem": "8966",
    "governmentBalance": 9000,
    "lat": 32.0657,
    "lng": 34.8525
  },
   {
    "requestNumber": "1001264646",
    "authority": "אור יהודה",
    "requestAmount": 16000,
    "totalBudget": 20000,
    "externalSources": 4000,
    "funder": "עיריית אור יהודה",
    "budgetItem": "1188",
    "governmentBalance": 12000,
    "lat": 32.0419,
    "lng": 34.8691
  },
  {
    "requestNumber": "1001264747",
    "authority": "גני תקווה",
    "requestAmount": 14000,
    "totalBudget": 17000,
    "externalSources": 3000,
    "funder": "משרד הפנים",
    "budgetItem": "3411",
    "governmentBalance": 11000,
    "lat": 32.0691,
    "lng": 34.8766
  },
  {
    "requestNumber": "1001264848",
    "authority": "סביון",
    "requestAmount": 13000,
    "totalBudget": 16000,
    "externalSources": 3000,
    "funder": "עיריית סביון",
    "budgetItem": "5633",
    "governmentBalance": 10000,
    "lat": 32.0546,
    "lng": 34.8987
  },
  {
    "requestNumber": "1001264949",
    "authority": "כוכב יאיר",
    "requestAmount": 18000,
    "totalBudget": 22000,
    "externalSources": 4000,
    "funder": "משרד השיכון",
    "budgetItem": "7855",
    "governmentBalance": 14000,
    "lat": 32.1719,
    "lng": 35.0048
  },
    {
    "requestNumber": "1001265050",
    "authority": "צור יגאל",
    "requestAmount": 11000,
    "totalBudget": 14000,
    "externalSources": 3000,
    "funder": "עיריית צור יגאל",
    "budgetItem": "9977",
    "governmentBalance": 8000,
    "lat": 32.2119,
    "lng": 34.9692
  },
  {
    "requestNumber": "1001265151",
    "authority": "תל מונד",
    "requestAmount": 6907,
    "totalBudget": 6907,
    "externalSources": 6907,
    "funder": "משרד החינוך",
    "budgetItem": "5442",
    "governmentBalance": 3681,
    "lat": 32.2668,
    "lng": 34.9235
  },
   {
    "requestNumber": "1001265252",
    "authority": "אבן יהודה",
    "requestAmount": 6907,
    "totalBudget": 6907,
    "externalSources": 6907,
    "funder": "משרד החינוך",
    "budgetItem": "5442",
    "governmentBalance": 3681,
    "lat": 32.2927,
    "lng": 34.9050
  },
    {
    "requestNumber": "1001265353",
    "authority": "בנימינה-גבעת עדה",
    "requestAmount": 6907,
    "totalBudget": 6907,
    "externalSources": 6907,
    "funder": "משרד החינוך",
    "budgetItem": "5442",
    "governmentBalance": 3681,
    "lat": 32.5418,
    "lng": 34.9590
  },
    {
    "requestNumber": "1001265454",
    "authority": "זכרון יעקב",
    "requestAmount": 6907,
    "totalBudget": 6907,
    "externalSources": 6907,
    "funder": "משרד החינוך",
    "budgetItem": "5442",
    "governmentBalance": 3681,
    "lat": 32.5783,
    "lng": 34.9500
  },
   {
    "requestNumber": "1001265555",
    "authority": "אור עקיבא",
    "requestAmount": 6907,
    "totalBudget": 6907,
    "externalSources": 6907,
    "funder": "משרד החינוך",
    "budgetItem": "5442",
    "governmentBalance": 3681,
    "lat": 32.4887,
    "lng": 34.9327
  }
    // ... יתר הנתונים יתווספו כאן
  ];

  // פונקציות עזר
  const formatNumber = (num: number) => 
    new Intl.NumberFormat('he-IL').format(num);

  const sortProjects = (a: Project, b: Project) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    return sortDirection === 'asc' 
      ? (aVal > bVal ? 1 : -1)
      : (aVal < bVal ? 1 : -1);
  };

  const getAuthoritySummary = (authority: string): AuthoritySummary => {
    const authorityProjects = projects.filter(p => p.authority === authority);
    return {
      totalRequests: authorityProjects.reduce((sum, p) => sum + p.requestAmount, 0),
      totalBudget: authorityProjects.reduce((sum, p) => sum + p.totalBudget, 0),
      totalBalance: authorityProjects.reduce((sum, p) => sum + p.governmentBalance, 0),
      projectCount: authorityProjects.length
    };
  };

  const filteredProjects = projects
    .filter(project => 
      (selectedAuthority ? project.authority === selectedAuthority : true) &&
      (searchTerm ? 
        project.authority.includes(searchTerm) ||
        project.requestNumber.includes(searchTerm) ||
        project.funder.includes(searchTerm)
        : true)
    )
    .sort(sortProjects);

  const totalRequestAmount = filteredProjects.reduce((sum, p) => sum + p.requestAmount, 0);
  const totalGovernmentBalance = filteredProjects.reduce((sum, p) => sum + p.governmentBalance, 0);
  const uniqueAuthorities = [...new Set(projects.map(p => p.authority))];

  // כרטיסיות סטטיסטיות
  const StatCard = ({ title, value, trend }: { title: string, value: string, trend?: 'up' | 'down' }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <div className="flex items-center">
        <p className="text-3xl font-bold text-blue-600">{value}</p>
        {trend && (
          <span className={`ml-2 ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
            {trend === 'up' ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
          </span>
        )}
      </div>
    </div>
  );

  // תצוגת פרטי רשות
  const AuthorityDetails = ({ authority }: { authority: string }) => {
    const summary = getAuthoritySummary(authority);
    
    return (
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">{authority}</h2>
          <button 
            onClick={() => setSelectedAuthority(null)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">סך בקשות</h3>
            <p className="text-lg font-bold">₪{formatNumber(summary.totalRequests)}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">מספר פרויקטים</h3>
            <p className="text-lg font-bold">{summary.projectCount}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">תקציב כולל</h3>
            <p className="text-lg font-bold">₪{formatNumber(summary.totalBudget)}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">יתרת הרשאות</h3>
            <p className="text-lg font-bold">₪{formatNumber(summary.totalBalance)}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 text-right" dir="rtl">
      {/* כותרת ראשית */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">דשבורד הקצאות כספיות</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* כרטיסיות סטטיסטיות */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatCard 
            title="סך הבקשות" 
            value={`₪${formatNumber(totalRequestAmount)}`}
            trend="up"
          />
          <StatCard 
            title="יתרת הרשאות" 
            value={`₪${formatNumber(totalGovernmentBalance)}`}
            trend="down"
          />
          <StatCard 
            title="מספר פרויקטים" 
            value={filteredProjects.length.toString()}
          />
          <StatCard 
            title="רשויות פעילות" 
            value={uniqueAuthorities.length.toString()}
          />
        </div>

        {/* חיפוש */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-4">
            <div className="relative">
              <Search className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="חיפוש לפי רשות, מספר בקשה או גורם מממן..."
                className="w-full pr-10 p-2 border rounded-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* תצוגת פרטי רשות נבחרת */}
        {selectedAuthority && <AuthorityDetails authority={selectedAuthority} />}

        {/* מפה וטבלה במסך מפוצל */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* מפה */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-4">
              <div className="h-[600px] rounded-lg">
                <MapContainer 
                  center={mapCenter} 
                  zoom={mapZoom} 
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  {projects.map((project, idx) => (
                    <Marker
                      key={idx}
                      position={[project.lat, project.lng]}
                      eventHandlers={{
                        click: () => setSelectedAuthority(project.authority)
                      }}
                    >
                      <Popup>
                        <div className="text-center">
                          <h3 className="font-bold mb-2">{project.authority}</h3>
                          <p>סך בקשות: ₪{formatNumber(project.requestAmount)}</p>
                          <p>יתרת הרשאות: ₪{formatNumber(project.governmentBalance)}</p>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </div>
          </div>

          {/* טבלת נתונים */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      רשות
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      מספר בקשה
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      סכום הבקשה
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      תקציב כולל
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      יתרת הרשאות
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      גורם מממן
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProjects.map((project, idx) => (
                    <tr 
                      key={idx} 
                      className={`hover:bg-gray-50 cursor-pointer ${
                        selectedAuthority === project.authority ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => setSelectedAuthority(project.authority)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {project.authority}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {project.requestNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ₪{formatNumber(project.requestAmount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ₪{formatNumber(project.totalBudget)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ₪{formatNumber(project.governmentBalance)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {project.funder}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;