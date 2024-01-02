import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import "../CSS/Configuration.css";

const Configuration = () => {
  const [formData, setFormData] = useState({
    workFlowName: "",
    loadType: "",
    cost: "",
    configuration: "",
    createWorkOrder: "",
  });

  const [configuration, setConfigurations] = useState([]);
  const [animateFields, setAnimateFields] = useState({
    stepOne: true,
    stepTwo: false,
    stepThree: false,
    stepFour: false,
    stepFive: false,
  });

  useEffect(() => {
    setAnimateFields((prevState) => ({
      ...prevState,
      stepOne: true,
    }));
  }, []);

  const getConfigurationLabel = (configuration) => {
    switch (configuration) {
      case "AUTOMATIC":
        return "Select Carrier Automatically By Least Cost";
      case "MANUAL":
        return "Select Carrier Manually";
      // case 'CONFIG_3':
      //     return 'Configuration 3 Label'; // Change this to your desired label
      // case 'CONFIG_4':
      //     return 'Configuration 4 Label'; // Change this to your desired label
      // default:
      //     return 'Unknown Configuration';
    }
  };

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.loadType ||
      !formData.cost ||
      !formData.configuration ||
      !formData.workFlowName ||
      !formData.createWorkOrder
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/workflow",
        formData
      );
      console.log("Data sent successfully:", response.data);
      navigate("/workorder");
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  useEffect(() => {
    const fetchConfigurations = async () => {
      try {
        const response = await axios.get("http://localhost:8080/config");
        console.log(response.data);
        setConfigurations(response.data);
      } catch (error) {
        console.error("Error fetching configurations:", error);
      }
    };
    fetchConfigurations();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    setFormData((prevState) => ({
      ...prevState,
      [name]: name === "configuration" ? { configId: value } : value,
    }));
  
    if (name === "workFlowName") {
      setAnimateFields((prevState) => ({
        ...prevState,
        stepTwo: true,
      }));
    } else if (name === "createWorkOrder") {
      setAnimateFields((prevState) => ({
        ...prevState,
        stepThree: true,
      }));
    } else if (name === "loadType") {
      setAnimateFields((prevState) => ({
        ...prevState,
        stepFour: true,
      }));
    } else if (name === "cost") {
      setAnimateFields((prevState) => ({
        ...prevState,
        stepFive: true,
      }));
    }
  };
  

  return (
    <>
      <Header />
      <form
        className="container"
        onSubmit={handleSubmit}
        style={{ backgroundColor: "#e8f2e7", padding: "20px" }}
      >
        <div>
          <h2> Step 1: Work Flow Name </h2>
          <div
            className={`mb-3 animated-form-field ${
              animateFields.stepOne ? "animated" : ""
            }`}
          >
            <label className="form-label" style={{ textAlign: "left" }}>
              Work Flow Name:
            </label>
            <input
              type="text"
              className="form-control"
              name="workFlowName"
              placeholder="Enter Work Flow Name"
              value={formData.workFlowName}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {animateFields.stepTwo && (
          <div>
            <h2>Step 2: Create Work Order</h2>
            <div
              className={`mb-3 animated-form-field ${
                animateFields.stepTwo ? "animated" : ""
              }`}
            >
              <label className="form-label" style={{ textAlign: "left" }}>
                Create Work Order:
              </label>
              <select
                className="form-select"
                name="createWorkOrder"
                onChange={handleInputChange}
                value={formData.createWorkOrder}
              >
                <option value="">Select Action</option>
                <option value="createManually">Create Work Order</option>
              </select>
            </div>
          </div>
        )}

        {animateFields.stepThree && (
          <div>
            <h2>Step 3: Load Type </h2>
            <div
              className={`mb-3 animated-form-field ${
                animateFields.stepThree ? "animated" : ""
              }`}
            >
              <label className="form-label" style={{ textAlign: "left" }}>
                Type of Load:
              </label>
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
          </div>
        )}

        {animateFields.stepFour && (
          <div>
            <h2> Step 4: Cost</h2>
            <div
              className={`mb-3 animated-form-field ${
                animateFields.stepFour ? "animated" : ""
              }`}
            >
              <label className="form-label" style={{ textAlign: "left" }}>
                Cost:
              </label>
              <input
                type="number"
                className="form-control"
                name="cost"
                placeholder="Enter Cost"
                value={formData.cost}
                onChange={handleInputChange}
                pattern="[0-9]*"
                title="Please enter only numbers"
              />
            </div>
          </div>
        )}

        {animateFields.stepFive && (
          <div>
            <h2>Step 5: Select Configuration</h2>
            <div
              className={`mb-3 animated-form-field ${
                animateFields.stepFive ? "animated" : ""
              }`}
            >
              <label className="form-label" style={{ textAlign: "left" }}>
                Configuration:
              </label>
              <select
                className="form-select"
                name="configuration"
                value={formData.configuration.configId || ""}
                onChange={handleInputChange}
              >
                <option value="">Select Configuration</option>
                {configuration.map((config) => (
                  <option key={config.configId} value={config.configId}>
                    {getConfigurationLabel(config.configuration)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {animateFields.stepFive && (
          <button
            type="submit"
            className={`btn btn-primary animated-form-field ${
              animateFields.stepFive ? "animated" : ""
            }`}
          >
            Save
          </button>
        )}
      </form>
    </>
  );
};

export default Configuration;
