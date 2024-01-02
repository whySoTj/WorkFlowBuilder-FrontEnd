import React, { useState, useEffect } from "react";
import axios from "axios";
import "../CSS/WorkOrderList.css";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Table,
} from "reactstrap";

const WorkOrderList = () => {
  const [workOrders, setWorkOrders] = useState([]);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState(null);
  const [confirmModal, setConfirmModal] = useState(false);
  const [deleteOrderId, setDeleteOrderId] = useState(null);

  useEffect(() => {
    const fetchWorkOrders = async () => {
      try {
        const response = await axios.get("http://localhost:8080/workorder");
        setWorkOrders(response.data);
      } catch (error) {
        console.error("Error fetching work orders:", error);
      }
    };
    fetchWorkOrders();
  }, []);

  const handleDelete = (workOrderId) => {
    if (!confirmModal) {
      setConfirmModal(true);
      setDeleteOrderId(workOrderId);
      // Open the confirmation modal
    }
  };

  const deleteWorkOrder = async () => {
    if (deleteOrderId) {
      try {
        await axios.delete(`http://localhost:8080/workorder/${deleteOrderId}`);
        console.log(`Deleted Work Order with ID: ${deleteOrderId}`);
        const response = await axios.get("http://localhost:8080/workorder");
        setWorkOrders(response.data);
      } catch (error) {
        console.error("Error deleting work order:", error);
      }
    }
    setDeleteOrderId(null);
    setConfirmModal(false);
    setSelectedWorkOrder(null); // Clear selected work order after delete
    setShowDetailsModal(false); // Clear selected work order after delete
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "UNASSIGNED":
        return "btn btn-outline-danger";
      case "ASSIGNED":
        return "btn btn-outline-success";
      case "REJECTED":
        return "btn btn-outline-danger";
      case "ACCEPTED":
        return "btn btn-outline-success";
      case "CARRIERNOTFOUND":
        return "btn btn-outline-danger";
      default:
        return "btn-secondary";
    }
  };
  const getStatusText = (status) => {
    switch (status) {
      case "CARRIERNOTFOUND":
        return "CARRIER NOT FOUND";
      default:
        return status;
    }
  };

  const handleClick = (workOrderId) => {
    const selectedOrder = workOrders.find(
      (order) => order.workOrderId === workOrderId
    );

    if (!confirmModal && selectedOrder) {
      setSelectedWorkOrder(selectedOrder);
      setShowDetailsModal(true);
    } else {
      setShowDetailsModal(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Work Orders List</h2>
      <Table className="custom-table" striped>
        <thead>
          <tr>
            <th className="custom-table-header">Work Order ID</th>
            <th className="custom-table-header">Origin</th>
            <th className="custom-table-header">Destination</th>
            <th className="custom-table-header">Flow Name</th>
            <th className="custom-table-header">Status</th>
            <th className="custom-table-header">Item Type</th>
            <th className="custom-table-header">Actions</th>
          </tr>
        </thead>
        <tbody>
          {workOrders.map((order, index) => (
            <tr
              key={order.workOrderId}
              className={index % 2 === 1 ? "bg-light" : "bg-secondary-light"}
              onClick={() => handleClick(order.workOrderId)}
            >
              <td>{order.workOrderId}</td>
              <td>{order.route?.origin?.city}</td>
              <td>{order.route?.destination?.city}</td>
              <td>{order.workFlow?.workFlowName}</td>
              <td>
                <button
                  type="button"
                  className={`btn ${getStatusColor(
                    order.workOrderStatus
                  )} btn-custom-size`}
                  onClick={() => handleClick(order.workOrderId)}
                  style={{minWidth:"120px"}}
                >
                  {order.workOrderStatus}
                </button>
              </td>

              <td>{order.itemType}</td>
              <td>
                <div className="trash-icon-button">
                  <button
                    className="btn btn-danger"
                    onClick={() => {
                      setConfirmModal(true);
                      setDeleteOrderId(order.workOrderId);
                    }}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Detailed Modal */}
      <Modal
        isOpen={showDetailsModal && !confirmModal} // Only show if confirmModal is false
        toggle={() => setShowDetailsModal(false)}
      >
        <ModalHeader toggle={() => setShowDetailsModal(false)}>
          Work Order Details
        </ModalHeader>
        <ModalBody>
          {selectedWorkOrder && (
            <div>
              <p>
                <strong>ID:</strong> {selectedWorkOrder.workOrderId}
              </p>
              <p>
                <strong>Origin:</strong> {selectedWorkOrder.route?.origin?.city}
              </p>
              <p>
                <strong>Destination:</strong>{" "}
                {selectedWorkOrder.route?.destination?.city}
              </p>
              <p>
                <strong>Status:</strong> {selectedWorkOrder.workOrderStatus}
              </p>
              <p>
                <strong>Carrier Name:</strong>{" "}
                {selectedWorkOrder.carrierName || "No Carrier"}
              </p>
              <p>
                <strong>Item Type:</strong> {selectedWorkOrder.itemType}
              </p>
              <p>
                <strong>Load Type:</strong>{" "}
                {selectedWorkOrder.workFlow?.loadType}
              </p>
              <p>
                <strong>Cost :</strong> {selectedWorkOrder.cost}
              </p>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setShowDetailsModal(false)}>
            Close
          </Button>
        </ModalFooter>
      </Modal>

      {/* Confirmation Modal for deleting work order */}
      {confirmModal && (
        <Modal isOpen={!showDetailsModal} toggle={() => setConfirmModal(false)}>
          <ModalHeader>Delete Work Order</ModalHeader>
          <ModalBody>
            Are you sure you want to delete this Work Order?
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={() => deleteWorkOrder()}>
              Delete
            </Button>
            <Button color="secondary" onClick={() => setConfirmModal(false)}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </div>
  );
};

export default WorkOrderList;
