import './App.css';
import Configuration from './Component/Configuration';
import Header from './Component/Header';
import WorkOrder from './Component/WorkOrder';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WorkOrderList from './Component/WorkOrderList';

function App() {
  return (
    <div className="App">
      <Router>
        {/* <Header /> */}
        <Routes>
          <Route path='/' element={<Configuration />} />
          <Route path='/workorder' element={<WorkOrder />} />
          <Route path='/workorderlist' element={<WorkOrderList/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
