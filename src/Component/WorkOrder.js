import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, {Toaster}from "react-hot-toast";

import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table,
  Button,
} from "reactstrap";
import { useLocation } from "react-router-dom";

const WorkOrder = () => {
  const [formData, setFormData] = useState({
    workFlow:{workFlowId: " "},
    origin: "",
    destination: "",
    capacity: "",
    hazmat: false,
    itemType: "",
    route: "",
  });
  const [originOptions, setOriginOptions] = useState([]);
  const [destinationOptions, setDestinationOptions] = useState([]);
  const [disableDestination, setDisableDestination] = useState(true);
  const [workflowOptions, setWorkflowOptions] = useState([]);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState(null);
  const [confirmModal, setConfirmModal] = useState(false);
  const [selectedCarrierId, setSelectedCarrierId] = useState(null);
  const [workOrderId, setWorkOrderId] = useState(null);
const location=useLocation();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === "checkbox" ? checked : value;

    if (name === "workFlow") {
      setFormData((prevState) => ({
        ...prevState,
        [name]: { workFlowId: value },
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
    if (name === "origin") {
      getDestinationData(value, inputValue);
      setDisableDestination(false);
    }
  };

  const getDestinationData = async (locationId, city) => {
    try {
      const response = await axios.get(
        "http://localhost:8080/route/destination",
        {
          params: { locationId, city },
        }
      );
      const destinationData = response.data;
      setDestinationOptions(destinationData);
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };
  const handleCarrierSelect = async (carrierId) => {
    setSelectedCarrierId(carrierId);
    setConfirmModal(true);
  };

  // Manual selection of carriers
  const handleConfirm = async () => {
    try {
      // Assuming you have access to workOrderId and selectedCarrierId here
      const response = await axios.get(
        "http://localhost:8080/selectcarrier/" + workOrderId +"/"+selectedCarrierId);
        console.log(response.data)
      // Perform any actions needed after successful selection
      // ...
      toast.success("Carrier has been selected");
    } catch (error) {
      console.error("Error selecting carrier:", error);
    }
    setConfirmModal(false);
    setShowDetailsModal(false);
  };

  const handleSubmit = async (originId, destinationId, e) => {
    e.preventDefault();
    try {
      const routeResponse = await axios.get("http://localhost:8080/getroute", {
        params: { originId, destinationId },
      });

      const payload = {
        ...formData,
        route: { routeId: routeResponse.data.routeId },
      };

      const response = await axios.post(
        "http://localhost:8080/workorder",
        payload
      );
      const workFlowId = response.data.workFlow.workFlowId;
      console.log(workFlowId);
      const workOrderId = response.data.workOrderId;
      setWorkOrderId(workOrderId);
      try {
        const workflowResponse = await axios.get(
          "http://localhost:8080/workflow"
        );
        console.log(workflowResponse);
        const workFlowResponseId =
          workflowResponse.data[workFlowId - 1].workFlowId;
        console.log(workFlowResponseId);
        const workFlowResponseName =
          workflowResponse.data[workFlowId - 1].configuration.configuration;
        console.log(workFlowResponseName);
        if (
          workFlowId === workFlowResponseId &&
          (workFlowResponseName === "AUTOMATIC"||workFlowResponseName==="FASTDELIVERY")
        ) {
          toast.success("Work Order has been successfully created");
          console.log(response.data);
          // setSelectedWorkOrder(modalDataResponse.data);
          // setShowDetailsModal(true);
        }
      } catch (error) {
        console.error("Error fetching workflow data:", error);
      }
      // const workFlowId = response.data.workFlow.workFlowId;
      // console.log(workFlowId);
      // const workOrderId = response.data.workOrderId;
      // setWorkOrderId(workOrderId);

      const modalDataResponse = await axios.get(
        "http://localhost:8080/savedlist/" + workOrderId
      );
      console.log(modalDataResponse.data);
      try {
        const workflowResponse = await axios.get(
          "http://localhost:8080/workflow"
        );

        const workFlowResponseId =
          workflowResponse.data[workFlowId - 1].workFlowId;
        console.log(workFlowResponseId);

        const workFlowResponseName =
          workflowResponse.data[workFlowId - 1].configuration.configuration;
        console.log(workFlowResponseName);

        if (
          workFlowId === workFlowResponseId &&
          workFlowResponseName === "MANUAL" &&
          modalDataResponse.data.length!==0
        ) {
          setSelectedWorkOrder(modalDataResponse.data);
          setShowDetailsModal(true);
        }else if (workFlowId === workFlowResponseId &&
            workFlowResponseName === "MANUAL" &&
            modalDataResponse.data.length===0) {
            toast.error("No Carrier Found")
        }
      } catch (error) {
        console.error("Error fetching workflow data:", error);
      }

      setFormData({
        workFlow: "",
        origin: "",
        destination: "",
        capacity: "",
        hazmat: false,
        itemType: "",
        route: "",
      });
      setDisableDestination(true);
    } catch (error) {
      console.error("Error creating work order:", error);
    }
    
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        
        console.log(location.state);
        setFormData(prevState=>({
            ...prevState,
            workFlow:{workFlowId: location.state==null?4:location.state},
        }))
        const originResponse = await axios.get("http://localhost:8080/route");
        const originData = originResponse.data.map((data) => data.origin);
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
        let finalOriginData = removeDuplicatesByKey(originData, "locationId");
        setOriginOptions(finalOriginData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchWorkflowOptions = async () => {
      try {
        const workflowResponse = await axios.get(
          "http://localhost:8080/workflow"
        );
        setWorkflowOptions(workflowResponse.data);
      } catch (error) {
        console.error("Error fetching workflow data:", error);
      }
    };

    fetchData();
    fetchWorkflowOptions();
  }, []);

  return (
    <div className="container mt-5">
      <h2>Work Order</h2>
      <form
        onSubmit={(e) => handleSubmit(formData.origin, formData.destination, e)}
      >
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
            {destinationOptions.map((destination) => (
              <option
                key={destination.locationId}
                value={destination.locationId}
              >
                {destination.city}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="capacity" className="form-label">
            Capacity:
          </label>
          <input
            type="number"
            className="form-control"
            id="capacity"
            name="capacity"
            placeholder="Enter capacity (Kg)"
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
            value={formData.workFlow.workFlowId || ""}
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
                checked={formData.itemType === "NORMAL"}
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
                checked={formData.itemType === "FRAGILE"}
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
                checked={formData.itemType === "HAZMAT"}
                onChange={handleInputChange}
              />
              <label className="form-check-label">Hazmat</label>
            </div>
          </div>
        </div>
        <button type="submit" className="btn btn-primary">
          Create Work Order
        </button>
      </form>

      {/* Modal for carrier selection confirmation */}
      <Modal isOpen={confirmModal} toggle={() => setConfirmModal(false)}>
        <ModalHeader>Select Carrier Confirmation</ModalHeader>
        <ModalBody>
          Are you sure you want to select this Carrier for the Work Order?
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={handleConfirm}>
            Confirm
          </Button>
          <Button color="secondary" onClick={() => setConfirmModal(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* Modal */}
      <Modal
        isOpen={showDetailsModal}
        toggle={() => setShowDetailsModal(false)}
      >
        <ModalHeader toggle={() => setShowDetailsModal(false)}>
          Select Carrier:
        </ModalHeader>
        <ModalBody>
          <Table striped>
            <thead>
              <tr>
                {/* <th>Route Carrier ID</th> */}
                {/* <th>Capacity</th> */}
                <th>Carrier ID</th>
                <th>Cost</th>
                <th>Delivery Time(Days)</th>
                <th>Carrier Name</th>
                {/* <th>Item Type</th> */}
                {/* <th>Load Type</th> */}
              </tr>
            </thead>
            <tbody>
              {selectedWorkOrder &&
                selectedWorkOrder.map((order, index) => (
                  <tr key={index}>
                    {/* <td>{order.routeCarrierId}</td> */}
                    {/* <td>{order.capacity}</td> */}
                    <td>{order.carrier.carrierId}</td>
                    <td>{order.cost}</td>
                    <td>{order.deliverIn}</td>
                    <td>{order.carrier.carrierName}</td>
                    <td>
                      <Button
                        color="primary"
                        onClick={() =>
                          handleCarrierSelect(order.carrier.carrierId)
                        }
                      >
                        Select
                      </Button>
                    </td>
                    {/* <td>{order.itemType}</td> */}
                    {/* <td>{order.loadType}</td> */}
                    {/* Add other details */}
                    {/* ... */}
                  </tr>
                ))}
            </tbody>
          </Table>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setShowDetailsModal(false)}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
      <Toaster />
    </div>
  );
};

export default WorkOrder;
