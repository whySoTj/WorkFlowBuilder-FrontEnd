import React, { useState , useEffect} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from './Header';

const Configuration = () => {
    const [formData, setFormData] = useState({
        workFlowName:'',
        loadType: '',
        cost: '',
        configuration: '',
    });

const [configuration,setConfigurations] =useState([]);
const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.loadType) {
            alert('Please fill in all required fields.'); 
            return;           
        } else if (!formData.cost){
            alert('Please fill in all required fields.');  
            return;          
        }
        else if (!formData.configuration){
            alert('Please fill in all required fields.');   
            return;         
        }else if(!formData.workFlowName){
            alert('Please fill in all required fields.');   
            return;
        }
        
        try {
            
            const response = await axios.post('http://localhost:8080/workflow', formData);
            console.log('Data sent successfully:', response.data);
            navigate("/workorder")
            // Handle success or perform actions on response data
        } catch (error) {
            console.error('Error sending data:', error);
            // Handle error
        }
    };

    //
    useEffect(() => {
        // Fetch configuration options from Spring Boot backend
        const fetchConfigurations = async () => {
            try {
                const response = await axios.get('http://localhost:8080/config');
                console.log(response.data);
                setConfigurations(response.data);

            } catch (error) {
                console.error('Error fetching configurations:', error);
            }
        };
        fetchConfigurations();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
    
        if (name === 'configuration') {
            setFormData(prevState => ({
                ...prevState,
                [name]: {
                    'configId': value
                }
            }));
        } else {
            setFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };
    

    // const handleInputChange = (e) => {
    //     setFormData(prevState => ({
    //         ...prevState,
    //         ...(e.target.name === 'configuration' ? 
    //         {['configuration']:{["configId"]:e.target.value}}:
    //         { [e.target.name]: e.target.value } )
    //       }));
    // };

    const getConfigurationLabel = (configuration) => {
        switch (configuration) {
            case 'AUTOMATIC':
                return 'Select Carrier Automatically';
            case 'MANUAL':
                return 'Select Carrier Manually';
            // case 'CONFIG_3':
            //     return 'Configuration 3 Label'; // Change this to your desired label
            // case 'CONFIG_4':
            //     return 'Configuration 4 Label'; // Change this to your desired label
            // case 'CONFIG_5':
            //     return 'Configuration 5 Label'; // Change this to your desired label
            // default:
            //     return 'Unknown Configuration';
        }
    };
    

    return (
        <>
        <Header/>
        <form className= "container"onSubmit={handleSubmit} style={{ backgroundColor: ' #e8f2e7', padding: '20px' }}>
                <div className="mb-3">
                    <label className="form-label" style={{ textAlign: 'left' }}>Work Flow Name:</label>
                    <input
                        type="text"
                        className="form-control"
                        name="workFlowName"
                        placeholder="Enter Work Flow Name"
                        value={formData.workFlowName}
                        onChange={handleInputChange}
                        />
                </div>
                    <div className="mb-3">
                        <label className="form-label" style={{ textAlign: 'left' }}>Type of Load:</label>
                    <div>
                    <div className="form-check form-check-inline">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="loadType"
                            value="LCL"
                            onChange={handleInputChange}
                        />
                        <label className="form-check-label">LCL</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="loadType"
                            value="FCL"
                            onChange={handleInputChange}
                        />
                        <label className="form-check-label">FCL</label>
                    </div>
                </div>
            </div>
            <div className="mb-3">
                <label className="form-label" style={{ textAlign: 'left' }}>Cost:</label>
                    <input
                        type="number"
                        className="form-control"
                        name="cost"
                        placeholder="Enter Cost"
                        value={formData.cost}
                        onChange={handleInputChange}
                        pattern="[0-9]*"  // Accepts only numeric values
                        title="Please enter only numbers"  // Error message for non-numeric input
                />
            </div>

            <div className="mb-3">
                <label className="form-label" style={{ textAlign: 'left' }}>Configuration:</label>
                <select
                    className="form-select"
                    name="configuration"
                    value={formData.configuration.configId || ''}
                    onChange={handleInputChange}
                >
                    <option value="">Select Configuration</option>
                    {configuration.map((config) => (
                        <option key={config.configId} value={config.configId}>
                            {getConfigurationLabel(config.configuration)}
                        </option>)
                    )}
                    {/* // <option value="manual">Select Carrier Manually</option> */}
                </select>
            </div>
            <button type="submit" className="btn btn-primary">Save</button>
        </form>
        </>
    );
};

export default Configuration;
