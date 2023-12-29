import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../CSS/WorkOrderList.css';

const WorkOrderList = () => {
  const [workOrders, setWorkOrders] = useState([]);

  useEffect(() => {
    // Fetch work orders from the specified endpoint
    const fetchWorkOrders = async () => {
      try {
        const response = await axios.get('http://localhost:8080/workorder');
        setWorkOrders(response.data); // Set work orders received from the API
      } catch (error) {
        console.error('Error fetching work orders:', error);
      }
    };

    fetchWorkOrders();
  }, []);

  const handleDelete = (workOrderId) => {
    // Handle delete functionality here based on work order ID
    // You can make an API call to delete the work order using the workOrderId
    console.log(`Delete Work Order with ID: ${workOrderId}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'UNASSIGNED':
        return 'text-danger';
      case 'ASSIGNED':
        return 'text-secondary';
      case 'REJECTED':
        return 'text-danger';
      case 'ACCEPTED':
        return 'text-success';
      default:
        return 'text-dark';
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Work Orders</h2>
      <table className="custom-table">
        <thead>
          <tr>
            <th className="custom-table-header">Work Order ID</th>
            <th className="custom-table-header">Origin</th>
            <th className="custom-table-header">Destination</th>
            <th className="custom-table-header">Status</th>
            <th className="custom-table-header">Item Type</th>
            <th className="custom-table-header">Actions</th>
          </tr>
        </thead>
        <tbody>
          {workOrders.map((order, index) => (
            <tr key={order.workOrderId} className={index % 2 === 0 ? 'bg-light' : 'bg-secondary-light'}>
              <td>{order.workOrderId}</td>
              <td>{order.route?.origin?.city}</td>
              <td>{order.route?.destination?.city}</td>
              <td className={`custom-status ${getStatusColor(order.workOrderStatus)}`}>{order.workOrderStatus}</td>
              <td>{order.itemType}</td>
              <td>
                <button className="btn btn-danger" onClick={() => handleDelete(order.workOrderId)}>
                  <i className="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WorkOrderList;
