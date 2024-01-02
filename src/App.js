import './App.css';
import Configuration from './Component/Configuration';
import Header from './Component/Header';
import WorkOrder from './Component/WorkOrder';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WorkOrderList from './Component/WorkOrderList';
import PopUp from './Component/PopUp';


function App() {
  return (
    <div className="App">
      <Router>
        {/* <Header /> */}
        <Routes>
          <Route path='/' element={<Configuration />} />
          <Route path='/workorder' element={<WorkOrder />} />
          <Route path='/workorderlist' element={<WorkOrderList/>}/>
          <Route path='/popup' element={<PopUp/>}/>
          <Route path='/popup/:id' element={<PopUp/>}/>
          
          
        </Routes>
      </Router>
    </div>
  );
}

export default App;
