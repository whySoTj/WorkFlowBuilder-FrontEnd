import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button } from "reactstrap";
import { useNavigate } from "react-router-dom";
import '../CSS/WorkOrderList.css'

const CarriersList = () => {
  const [assignedCarriers, setAssignedCarriers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssignedCarriers = async () => {
      try {
        const response = await axios.get("http://localhost:8080/assignedCarriers");
        setAssignedCarriers(response.data);
      } catch (error) {
        console.error("Error fetching assigned carriers:", error);
      }
    };
    fetchAssignedCarriers();
  }, []);

  const handleAccept = async (workOrderId) => {
    // Handle logic for accepting the carrier with the specific workOrderId
    try {
      const routeResponse = await axios.get(`http://localhost:8080/accept/${workOrderId}`); 
      // const response = await axios.get("http://localhost:8080/accept/");
    } catch (error) {
      console.error("Error fetching assigned carriers:", error);
    }
    
    console.log(`Accepted WorkOrder ID: ${workOrderId}`);
  };

  const handleReject = async (workOrderId) => {
    // Handle logic for rejecting the carrier with the specific workOrderId
    try {
      const routeResponse = await axios.get(`http://localhost:8080/reject/${workOrderId}`);
        
      // const response = await axios.get("http://localhost:8080/accept/");
    } catch (error) {
      console.error("Error fetching assigned carriers:", error);
    }
    console.log(`Rejected WorkOrder ID: ${workOrderId}`);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Assigned Carriers List</h2>
      <Table className="custom-table" striped>
        <thead className="table-header">
          <tr className="table-dark">
            <th>WorkOrder ID</th>
            <th>Carrier ID</th>
            <th>Carrier Name</th>
            <th>Cost</th>
            {/* <th>Delivery</th> */}
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {assignedCarriers.map((carrier) => (
            <tr key={carrier.workOrderId}>
              <td>{carrier.workOrderId}</td>
              <td>{carrier.carrierId}</td>
              <td>{carrier.carrierName}</td>
              <td>{carrier.cost}</td>
              {/* <td>{carrier.deliveryIn}</td> */}
              <td>{carrier.workOrderAssignableCarrierEnum}</td>
              <td>
                <Button
                  color="success"
                  onClick={() => handleAccept(carrier.workOrderId)}
                >
                  Accept
                </Button>{' '}
                <Button
                  color="danger"
                  onClick={() => handleReject(carrier.workOrderId)}
                >
                  Reject
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default CarriersList;
