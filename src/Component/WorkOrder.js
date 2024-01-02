import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';     


const WorkOrder = () => {
    const [formData, setFormData] = useState({
        workFlow:'',
        origin: '',
        destination: '',
        capacity: '',
        hazmat: false,
        itemType: '',
        route:'',

    });
    const [originOptions, setOriginOptions] = useState([]);
    const [destinationOptions, setDestinationOptions] = useState([]);
    const [disableDestination,setDisableDestination]= useState(true);
    const [workflowOptions, setWorkflowOptions] = useState([]);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        console.log('Selected location ID:', value);
        const inputValue = type === 'checkbox' ? checked : value;
        // setFormData({ ...formData, [name]: inputValue });
        // setFormData(prevState => ({
        //     ...prevState,
        //     ...(e.target.name === 'workFlow' ? 
        //     {['workFlow']:{["workFlowId"]:e.target.value}}:
        //     { [e.target.name]: e.target.value } )
        //   }));
        if (name === 'workFlow') {
            setFormData(prevState => ({
                ...prevState,
                [name]: {
                    'workFlowId': value
                }
            }));
        } else {
            setFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
        if(name==="origin"){
            getDestinationData(value,inputValue)
            setDisableDestination(false);
        }
    };

    const getDestinationData=async(locationId,city)=>{
        try {
            const response = await axios.get('http://localhost:8080/route/destination', {
                params: {locationId,city}
            });
            console.log('Data sent successfully:', response.data);
            const destinationData= response.data;
            console.log(destinationData);
            setDestinationOptions(destinationData);
            
            // Add any additional logic upon successful data submission
        } catch (error) {
            console.error('Error sending data:', error);
            // Handle error
        }
    }

    
    
    const handleSubmit = async (originId,destinationId,e) => {
        e.preventDefault();
        // formData.status = 
        try {
            const routeResponse = await axios.get('http://localhost:8080/getroute', {
                params: {originId,destinationId}
            });
            
            // setFormData(prevState => ({
            //     ...prevState,
            //     route: routeResponse.data.routeId // Update this to the correct property in formData
            // }));
            const payload= {...formData,'route':{'routeId':routeResponse.data.routeId}};

            const response = await axios.post('http://localhost:8080/workorder', payload);
            toast.success("Work Order has been successfully created")
            setFormData({
                workFlow:'',
                origin: '',
                destination: '',
                capacity: '',
                hazmat: false,
                itemType: '',
                route:'',
            });
            setDisableDestination(true);
            console.log("formSubmitted" + response);

            const workOrderId = await response.data.workOrderId;
            console.log(workOrderId);

            const carrierSelectionList = await axios.get('http://localhost:8080/savedlist/' + workOrderId);
            


            // if (formData.configuration?.configuration === "MANUAL") {
            //     await axios.get('http://localhost:8080/list/' + workOrderId);
            //     console.log("first");
            //     // Navigate to '/popup' when configuration is "MANUAL"
            //     navigate('/workorderlist');
            //   } else {
            //     await axios.get('http://localhost:8080/savedlist/' + workOrderId);
            //     // Navigate to '/workorder' when configuration is not "MANUAL"
            //     // navigate('/workorder');
            //   }

            // Add any additional logic upon successful data submission
        } 
        catch (error) {
            console.error('Error sending data:', error);
            // Handle error
        }
        
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const originResponse = await axios.get('http://localhost:8080/route');
                console.log(originResponse.data)
                const originData= originResponse.data.map((data)=> data.origin)
                function removeDuplicatesByKey(array, key) {
                    const seen = new Set();
                    return array.filter((item) => {
                      const value = item[key];
                      if (!seen.has(value)) {
                        seen.add(value);
                        return true;
                      }
                      return false;
                    });
                  }
                let finalOriginData=removeDuplicatesByKey(originData,'locationId');
                console.log(finalOriginData);
                setOriginOptions(finalOriginData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        const fetchWorkflowOptions = async () => {
            try {
                const workflowResponse = await axios.get('http://localhost:8080/workflow');
                console.log(workflowResponse.data);
                setWorkflowOptions(workflowResponse.data);
            } catch (error) {
                console.error('Error fetching workflow data:', error);
            }
        };
    
        fetchData();
        fetchWorkflowOptions();
    }, []);
    
   
    return (
        <div className="container mt-5">
            <h2>Work Order</h2>
            <form onSubmit={(e) => handleSubmit(formData.origin, formData.destination, e)}>
                <div className="mb-3">
                    <label className="form-label">Origin:</label>
                    <select
                        className="form-select"
                        name="origin"
                        value={formData.origin}
                        onChange={handleInputChange}
                    >
                        <option value="">Select Origin</option>
                        {originOptions.map((origin) => (
                            <option key={origin.locationId} value={origin.locationId}>
                                {origin.city}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">Destination:</label>
                    <select
                        className="form-select"
                        name="destination"
                        value={formData.destination}
                        onChange={handleInputChange}
                        disabled={disableDestination}
                    >
                        <option value="">Select Destination</option>
                        {destinationOptions.map(destination => (
                            <option key={destination.locationId} value={destination.locationId}>
                                {destination.city}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="capacity" className="form-label">Capacity:</label>
                    <input
                        type="number"
                        className="form-control"
                        id="capacity"
                        name="capacity"
                        placeholder="Enter capacity(Kg)"
                        min="0"
                        value={formData.capacity}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Workflow:</label>
                    <select
                        className="form-select"
                        name="workFlow"
                        value={formData.workFlow.workFlowId ||''}
                        onChange={handleInputChange}
                    >
                        <option value="">Select Workflow</option>
                        {workflowOptions.map((workflow) => (
                            <option key={workflow.workFlowId} value={workflow.workFlowId}>
                                {workflow.workFlowName}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">Item Type:</label>
                    <div>
                        <div className="form-check form-check-inline">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="itemType"
                                value="NORMAL"
                                checked={formData.itemType === 'NORMAL'}
                                onChange={handleInputChange}
                            />
                            <label className="form-check-label">Normal</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="itemType"
                                value="FRAGILE"
                                checked={formData.itemType === 'FRAGILE'}
                                onChange={handleInputChange}
                            />
                            <label className="form-check-label">Fragile</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="itemType"
                                value="HAZMAT"
                                checked={formData.itemType === 'HAZMAT'}
                                onChange={handleInputChange}
                            />
                            <label className="form-check-label">Hazmat</label>
                        </div>
                        {/* <div className="form-check form-check-inline">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="itemType"
                                value="PERISHABLE"
                                checked={formData.itemType === 'PERISHABLE'}
                                onChange={handleInputChange}
                            />
                            <label className="form-check-label">Perishable</label>
                        </div> */}
                    </div>
                </div>
                <button type="submit" className="btn btn-primary">
                    Create Work Order
                </button>
                
                
            </form>
        </div>
    );
};

export default WorkOrder;


            