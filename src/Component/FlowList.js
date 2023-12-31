import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button } from "reactstrap";
import { useNavigate } from "react-router-dom";
import '../CSS/WorkOrderList.css'

const WorkflowList = () => {
  const [workflowData, setWorkflowData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkflowData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/workflow");
        setWorkflowData(response.data);
      } catch (error) {
        console.error("Error fetching workflow data:", error);
      }
    };
    fetchWorkflowData();
  }, []);

  const handleSelectWorkflow = (workflowId) => {
    // Handle the selection logic for the specific workflow ID
    console.log(`Selected Workflow ID: ${workflowId}`);
    navigate('/popup',{state:workflowId});

  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Workflow List</h2>
      <Table className="custom-table"  striped>
        <thead className="table-header">
        <tr className="table-dark">
            <th>Work Flow Id</th>
            <th>Work Flow Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {workflowData.map((workflow) => (
            <tr key={workflow.workFlowId}>
              <td>{workflow.workFlowId}</td>
              <td>{workflow.workFlowName}</td>
              <td>
                <Button
                  color="primary"
                  onClick={() => handleSelectWorkflow(workflow.workFlowId)}
                >
                  Select
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default WorkflowList;
