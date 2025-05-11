import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import Papa from 'papaparse';
import Plot from 'react-plotly.js';

const imageUrls = ['https://cdn.pixabay.com/photo/2022/11/04/05/50/city-7569067_960_720.jpg','https://cdn.pixabay.com/photo/2022/11/04/05/50/city-7569067_960_720.jpg','https://cdn.pixabay.com/photo/2022/11/04/05/50/city-7569067_960_720.jpg','https://cdn.pixabay.com/photo/2022/11/04/05/50/city-7569067_960_720.jpg','https://cdn.pixabay.com/photo/2022/11/04/05/50/city-7569067_960_720.jpg','https://cdn.pixabay.com/photo/2022/11/04/05/50/city-7569067_960_720.jpg','https://cdn.pixabay.com/photo/2022/11/04/05/50/city-7569067_960_720.jpg','https://cdn.pixabay.com/photo/2022/11/04/05/50/city-7569067_960_720.jpg','https://cdn.pixabay.com/photo/2022/11/04/05/50/city-7569067_960_720.jpg','https://cdn.pixabay.com/photo/2022/11/04/05/50/city-7569067_960_720.jpg','https://cdn.pixabay.com/photo/2022/11/04/05/50/city-7569067_960_720.jpg','https://cdn.pixabay.com/photo/2022/11/04/05/50/city-7569067_960_720.jpg','https://cdn.pixabay.com/photo/2022/11/04/05/50/city-7569067_960_720.jpg'];

const cameraUrls = ['https://cdn.pixabay.com/photo/2022/11/04/05/50/city-7569067_960_720.jpg','https://cdn.pixabay.com/photo/2022/11/04/05/50/city-7569067_960_720.jpg','https://cdn.pixabay.com/photo/2022/11/04/05/50/city-7569067_960_720.jpg','https://cdn.pixabay.com/photo/2022/11/04/05/50/city-7569067_960_720.jpg'];
const trafficVideoUrl = "https://cdn.pixabay.com/video/2021/08/13/84970-587646749_large.mp4";

function Sidebar() {
  return (
    <div className="w-60 h-screen bg-gray-800 text-white p-4 space-y-4">
      <h1 className="text-xl font-bold mb-6">Menú</h1>
      <nav className="flex flex-col space-y-2">
        <Link to="/" className="hover:bg-gray-700 rounded p-2">Inicio</Link>
        <Link to="/tabla" className="hover:bg-gray-700 rounded p-2">Tabla de Datos</Link>
        <Link to="/galeria" className="hover:bg-gray-700 rounded p-2">Todas las Cámaras</Link>
        <Link to="/camaras" className="hover:bg-gray-700 rounded p-2">Cámaras</Link>
      </nav>
    </div>
  );
}

function CameraControls() {
  const [status, setStatus] = useState('Detenido');

  return (
    <div className="flex justify-center gap-4 flex-wrap mt-4">
      <Button onClick={() => setStatus('Grabando')}>Grabar</Button>
      <Button onClick={() => setStatus('Pausado')}>Pausar</Button>
      <Button onClick={() => setStatus('Continuando')}>Continuar</Button>
      <Button onClick={() => setStatus('Detenido')}>Detener</Button>
      <div className="text-green-400 font-semibold">Estado: {status}</div>
    </div>
  );
}

function DataTable() {
  const [filter, setFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState([]);
  const [plots, setPlots] = useState([]);
  const rowsPerPage = 20;

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        const parsedData = results.data.map((item, index) => ({ id: index + 1, ...item }));
        setData(parsedData);
        setVisibleColumns(Object.keys(parsedData[0] || {}));
        setCurrentPage(1);
      }
    });
  };

  const handlePythonUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("pythonScript", file);

    const response = await fetch("/run-python-script", { method: "POST", body: formData });
    const result = await response.json();
    setData(result.data);
    setPlots(result.plots);
    setVisibleColumns(Object.keys(result.data[0] || {}));
    setCurrentPage(1);
  };

  const toggleColumn = (column) => {
    setVisibleColumns(prev =>
      prev.includes(column)
        ? prev.filter(col => col !== column)
        : [...prev, column]
    );
  };

  const filteredData = data.filter(
    item => Object.values(item).some(val => val?.toString().toLowerCase().includes(filter.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <section className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Tabla de Datos</h2>
      <div className="flex gap-4 mb-4 flex-wrap">
        <Input type="file" accept=".csv" onChange={handleFileUpload} className="max-w-xs" />
        <Input type="file" accept=".py" onChange={handlePythonUpload} className="max-w-xs" />
        <Input
          placeholder="Filtrar..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {plots.map((plot, idx) => (
        <Plot key={idx} data={plot.data} layout={plot.layout} className="mb-6" />
      ))}

      {data.length > 0 && (
        <>
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Selecciona las columnas a visualizar:</h3>
            <div className="flex flex-wrap gap-3">
              {Object.keys(data[0] || {}).map((col, idx) => (
                <label key={idx} className="flex items-center gap-2 text-sm">
                  <Checkbox checked={visibleColumns.includes(col)} onCheckedChange={() => toggleColumn(col)} />
                  {col}
                </label>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  {visibleColumns.map((key, idx) => (
                    <th key={idx} className="px-4 py-2 border text-left">{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    {visibleColumns.map((col, i) => (
                      <td key={i} className="px-4 py-2 border text-left truncate max-w-[200px]" title={item[col]}>{item[col]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-between items-center mt-4">
              <Button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}>Anterior</Button>
              <span>Página {currentPage} de {totalPages}</span>
              <Button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)}>Siguiente</Button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

function Gallery() {
  return (
    <section className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Todas las Cámaras</h2>
      <div className="grid grid-cols-4 gap-2 border border-gray-300">
        {imageUrls.map((url, idx) => (
          <Link to={`/imagen/${idx}`} key={idx} className="border border-gray-300">
            <img src={url} alt={`Imagen ${idx + 1}`} className="w-full h-40 object-cover" loading="lazy" />
          </Link>
        ))}
      </div>
    </section>
  );
}

function Cameras() {
  return (
    <section className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Vista de Cámaras</h2>
      <div className="grid grid-cols-2 gap-4">
        {cameraUrls.map((url, idx) => (
          <Link to={`/camara/${idx}`} key={idx}>
            <Card className="shadow-lg relative">
              <CardContent className="p-2">
                <img src={url} alt={`Cámara ${idx + 1}`} className="rounded w-full h-48 object-cover" loading="lazy" />
                <div className="absolute top-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                  Cámara {idx + 1}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}

function ImageDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const imageUrl = imageUrls[id];

  return (
    <div className="p-6">
      <img src={imageUrl} alt={`Imagen ${Number(id) + 1}`} className="w-full max-w-4xl mx-auto rounded shadow-lg" loading="lazy" />
      <CameraControls />
      <div className="flex justify-center mt-4">
        <Button onClick={() => navigate(-1)}>Regresar</Button>
      </div>
    </div>
  );
}

function CameraDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const cameraUrl = cameraUrls[id];

  return (
    <div className="p-6">
      <img src={cameraUrl} alt={`Cámara ${Number(id) + 1}`} className="w-full max-w-4xl mx-auto rounded shadow-lg" loading="lazy" />
      <CameraControls />
      <div className="flex justify-center mt-4">
        <Button onClick={() => navigate(-1)}>Regresar</Button>
      </div>
    </div>
  );
}

function Home() {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setCounter(prev => prev + 1), 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Cámara Principal</h2>
      <video src={trafficVideoUrl} autoPlay loop controls className="w-full max-w-4xl mx-auto rounded shadow-lg" />
      <div className="mt-4 text-green-400 font-bold text-lg">Multas detectadas: {counter}</div>
      <CameraControls />
    </section>
  );
}

export default function DashboardPage() {
  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tabla" element={<DataTable />} />
            <Route path="/galeria" element={<Gallery />} />
            <Route path="/camaras" element={<Cameras />} />
            <Route path="/imagen/:id" element={<ImageDetail />} />
            <Route path="/camara/:id" element={<CameraDetail />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
