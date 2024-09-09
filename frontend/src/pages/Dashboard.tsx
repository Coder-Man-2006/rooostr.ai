import { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, useMap, useMapEvent, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import L from 'leaflet';
import './Dashboard.css';
import LineTool from '../assets/graphics/line-tool.svg';
import PerimiterTool from '../assets/graphics/perimiter-tool.svg';
import PolygonTool from '../assets/graphics/polygon-tool.svg';
import RulerTool from '../assets/graphics/ruler-tool.svg';
import HeatmapTool from '../assets/graphics/heatmap-tool.svg';
import POItool from '../assets/graphics/POI-tool.svg';

interface Polyline {
  polyline: L.Polyline;
  color: string;
  markers: L.LatLng[];
}

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const MapComponent = ({ isDrawing, onUndo, onRedo, setMap, polylines, setPolylines, currentColor, setIsDrawing, setHistory, isCtrlAltWPressed, setIsCtrlAltWPressed }: { isDrawing: boolean, onUndo: () => void, onRedo: () => void, setMap: (map: L.Map) => void, polylines: Polyline[], setPolylines: (polylines: Polyline[]) => void, currentColor: string, setIsDrawing: (isDrawing: boolean) => void, setHistory: (history: Polyline[]) => void, isCtrlAltWPressed: boolean, setIsCtrlAltWPressed: (isPressed: boolean) => void }) => {
  const map = useMap();
  const [drawing, setDrawing] = useState(false);
  const [currentPolyline, setCurrentPolyline] = useState<L.Polyline | null>(null);

  useEffect(() => {
    setMap(map);
  }, [map, setMap]);

  useEffect(() => {
    if (isDrawing) {
      map.getContainer().style.cursor = 'crosshair';
    } else {
      map.getContainer().style.cursor = '';
    }
  }, [isDrawing, map]);

  useMapEvent('click', (e) => {
    if (!isDrawing) return;

    if (!drawing) {
      const newPolyline = L.polyline([e.latlng], { color: currentColor }).addTo(map);
      setCurrentPolyline(newPolyline);
      setDrawing(true);
      const newPolylines = [...polylines, { polyline: newPolyline, color: currentColor, markers: [e.latlng] }];
      setPolylines(newPolylines);
      setHistory(newPolylines); // Update history
    } else {
      currentPolyline!.addLatLng(e.latlng);
      const updatedPolylines = polylines.map((p) => {
        if (p.polyline === currentPolyline) {
          return { ...p, markers: [...p.markers, e.latlng] };
        }
        return p;
      });
      setPolylines(updatedPolylines);
      setHistory(updatedPolylines); // Update history
    }
  });

  useMapEvent('dblclick', () => {
    if (drawing) {
      setDrawing(false);
      setCurrentPolyline(null);
      setIsDrawing(false); // Disable the line tool on double-click
    }
  });

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'z') {
      e.preventDefault();
      onUndo();
    } else if (e.ctrlKey && e.shiftKey && e.key === 'Z') {
      e.preventDefault();
      onRedo();
    } else if (e.ctrlKey && e.altKey && e.key === 'w') {
      setIsCtrlAltWPressed(true);
    }
  }, [onUndo, onRedo, setIsCtrlAltWPressed]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (e.key === 'w') {
      setIsCtrlAltWPressed(false);
    }
  }, [setIsCtrlAltWPressed]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  return (
    <>
      {polylines.map((p, index) => (
        p.markers.map((marker: L.LatLng, i: number) => (
          <Marker
            key={`${index}-${i}`}
            position={marker}
            icon={L.divIcon({
              className: 'custom-marker',
              html: `<div style="background-color: ${i === 0 ? 'blue' : 'red'}; width: 20px; height: 20px; border-radius: 50%;"></div>`,
            })}
            draggable={isCtrlAltWPressed}
            eventHandlers={{
              dragend: (e: L.DragEndEvent) => {
                const newMarkers = [...p.markers];
                newMarkers[i] = e.target.getLatLng();
                p.polyline.setLatLngs(newMarkers);
                const updatedPolylines = polylines.map((poly, idx) => {
                  if (idx === index) {
                    return { ...poly, markers: newMarkers };
                  }
                  return poly;
                });
                setPolylines(updatedPolylines);
                setHistory(updatedPolylines); // Update history
              }
            }}
          />
        ))
      ))}
    </>
  );
};

const RooostrUI = () => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [landInvestments, setLandInvestments] = useState<string[]>([]);
  const [propertyInvestments, setPropertyInvestments] = useState<string[]>([]);
  const [addDropdownOpen, setAddDropdownOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<number | null>(null); // State to track selected tool
  const [isDrawing, setIsDrawing] = useState(false); // State to track if drawing is active
  const [history, setHistory] = useState<Polyline[]>([]);
  const [redoStack, setRedoStack] = useState<Polyline[]>([]);
  const [isCtrlAltWPressed, setIsCtrlAltWPressed] = useState(false); // State to track if CTRL + ALT + W is pressed
  const [, setMap] = useState<L.Map | null>(null);
  const [polylines, setPolylines] = useState<Polyline[]>([]);
  const [currentColor, setCurrentColor] = useState<string>(getRandomColor());
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserEmail(user.email);
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setFirstName(userData.firstName);
          setLastName(userData.lastName);
        }
      } else {
        setUserEmail(null);
      }
    });
    return () => unsubscribe();
  }, [auth, db]);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        window.location.href = '/login';
      })
      .catch((error) => {
        console.error('Error signing out:', error);
      });
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleAddDropdown = () => {
    setAddDropdownOpen(!addDropdownOpen);
  };

  const addInvestment = (type: 'land' | 'property') => {
    if (type === 'land') {
      setLandInvestments([
        ...landInvestments,
        `Untitled Land Investment ${landInvestments.length + 1}`,
      ]);
    } else {
      setPropertyInvestments([
        ...propertyInvestments,
        `Untitled Property Investment ${propertyInvestments.length + 1}`,
      ]);
    }
    setAddDropdownOpen(false);
  };

  const tools = [
    { src: LineTool, alt: 'Line Tool' },
    { src: PerimiterTool, alt: 'Perimeter Tool' },
    { src: PolygonTool, alt: 'Polygon Tool' },
    { src: RulerTool, alt: 'Ruler Tool' },
    { src: HeatmapTool, alt: 'Heatmap Tool' },
    { src: POItool, alt: 'POI Tool' },
  ];

  const handleToolClick = (index: number) => {
    setSelectedTool(index);
    setIsDrawing(index === 0); // Assuming the line tool is at index 0
    if (index === 0) {
      setCurrentColor(getRandomColor());
    }
  };

  const undo = useCallback(() => {
    if (history.length > 0) {
      const newHistory = history.slice(0, -1);
      const lastPolyline = history[history.length - 1];
      setRedoStack([lastPolyline, ...redoStack]);
      setHistory(newHistory);
      setPolylines(newHistory);
    }
  }, [history, redoStack]);

  const redo = useCallback(() => {
    if (redoStack.length > 0) {
      const newHistory = [...history, redoStack[0]];
      const newRedoStack = redoStack.slice(1);
      setHistory(newHistory);
      setRedoStack(newRedoStack);
      setPolylines(newHistory);
    }
  }, [history, redoStack]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'z') {
      e.preventDefault();
      undo();
    } else if (e.ctrlKey && e.shiftKey && e.key === 'Z') {
      e.preventDefault();
      redo();
    } else if (e.ctrlKey && e.altKey && e.key === 'w') {
      setIsCtrlAltWPressed(true);
    }
  }, [undo, redo]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (e.key === 'w') {
      setIsCtrlAltWPressed(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  const startNewLine = () => {
    setIsDrawing(true);
    setCurrentColor(getRandomColor());
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <h1 className="title">rooostr</h1>
        <div className="add-button-container">
          <button className="add-button" onClick={toggleAddDropdown}>
            Add New +
          </button>
          {addDropdownOpen && (
            <div className="add-dropdown">
              <button
                className="dropdown-item"
                onClick={() => addInvestment('land')}
              >
                Land Investment
              </button>
              <button
                className="dropdown-item"
                onClick={() => addInvestment('property')}
              >
                Property Investment
              </button>
            </div>
          )}
        </div>
        <div className="section">
          <h2 className="section-title">Land Investment</h2>
          <div className="investment-list">
            {landInvestments.length === 0 ? (
              <p className="section-content">No land investments added yet</p>
            ) : (
              landInvestments.map((investment, index) => (
                <p key={index} className="investment-item">
                  {investment}
                </p>
              ))
            )}
          </div>
        </div>
        <div className="section">
          <h2 className="section-title">Property Investment</h2>
          <div className="investment-list">
            {propertyInvestments.length === 0 ? (
              <p className="section-content">No property investments added yet</p>
            ) : (
              propertyInvestments.map((investment, index) => (
                <p key={index} className="investment-item">
                  {investment}
                </p>
              ))
            )}
          </div>
        </div>
      </div>
      <div className="main-content">
        <div className="header">
          <div className="header-top">
            <h2 className="welcome-message">
              Welcome back, {firstName} {lastName}
            </h2>
            <div className="user-dropdown">
              <button className="user-button" onClick={toggleDropdown}>
                {userEmail} <span className="chevron">{dropdownOpen ? '▲' : '▼'}</span>
              </button>
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <button
                    className="dropdown-item"
                    onClick={() => (window.location.href = '/dashboard')}
                  >
                    Dashboard
                  </button>
                  <button
                    className="dropdown-item"
                    onClick={() => (window.location.href = '/billing')}
                  >
                    Billing
                  </button>
                  <button className="dropdown-item" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
          <p className="intro-text">
            Get started by adding a new land or property investment.
          </p>
          <div className="action-buttons">
            <button className="action-button">How to use rooostr.ai?</button>
            <button className="action-button">Give Feedback</button>
          </div>
        </div>
        <div className="map-container">
          <MapContainer style={{ height: '100%', width: '100%' }} center={[51.505, -0.09]} zoom={13}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapComponent isDrawing={isDrawing} onUndo={undo} onRedo={redo} setMap={setMap} polylines={polylines} setPolylines={setPolylines} currentColor={currentColor} setIsDrawing={setIsDrawing} setHistory={setHistory} isCtrlAltWPressed={isCtrlAltWPressed} setIsCtrlAltWPressed={setIsCtrlAltWPressed} />
          </MapContainer>
          <div className="map-controls">
            {tools.map((tool, index) => (
              <button
                key={index}
                className={`map-control-button ${selectedTool === index ? 'selected' : ''}`}
                onClick={() => handleToolClick(index)}
              >
                <img src={tool.src} alt={tool.alt} />
              </button>
            ))}
            {selectedTool === 0 && (
              <button className="map-control-button" onClick={startNewLine}>
                Start New Line
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RooostrUI;