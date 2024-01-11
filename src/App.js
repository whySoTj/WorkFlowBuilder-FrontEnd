import './App.css';
import Configuration from './Component/Configuration';
import Header from './Component/Header';
import WorkOrder from './Component/WorkOrder';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WorkOrderList from './Component/WorkOrderList';
import PopUp from './Component/PopUp';
import WorkflowList from './Component/FlowList';
import Navbar from './Component/Navbar'
import Carrier from './Component/Carriers'
import Filter from './Component/Filter'

function App() {
  return (
    <div className="App">
      <Router>
        {/* <Header /> */}
        <Navbar/>
        <Routes>
          <Route path='/' element={<Configuration />} />
          <Route path='/carriers' element={<Carrier/>} />
          <Route path='/workflowlist' element={<WorkflowList />} />
          <Route path='/workorder' element={<WorkOrder />} />
          <Route path='/workorderlist' element={<WorkOrderList/>}/>
          <Route path='/popup' element={<PopUp/>}/>
          <Route path='/popup/:id' element={<PopUp/>}/>
          <Route path='/filter' element={<Filter/>}/>
          
          
        </Routes>
      </Router>
    </div>
  );
}

export default App;
