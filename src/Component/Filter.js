import React, { useState } from "react";
import {
  Button,
  Input,
  InputGroup,
  InputGroupText,
  FormGroup,
  Label,
  Col,
  Row,
  Container,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import axios from "axios";

const ApiCallComponent = () => {
  const [endpoints, setEndpoints] = useState([{ endpoint: "", method: "GET" }]);
  const [jsonResponse, setJsonResponse] = useState("");
  const [actions, setActions] = useState([{ type: null, filterQuery: "" }]);
  const [dropdownOpen, setDropdownOpen] = useState([false]);

  const toggleDropdown = (index) => {
    const updatedDropdownOpen = [...dropdownOpen];
    updatedDropdownOpen[index] = !updatedDropdownOpen[index];
    setDropdownOpen(updatedDropdownOpen);
  };

  const handleEndpointChange = (index, key, value) => {
    const updatedEndpoints = [...endpoints];
    updatedEndpoints[index][key] = value;
    setEndpoints(updatedEndpoints);
  };

  const handleMakeApiCall = async () => {
    const getData = async () => {
      if (endpoints[endpoints.length - 2].method === "POST")
        return await axios.post(
          `${endpoints[endpoints.length - 2].endpoint}`,
          jsonResponse
        );
      else {
        const response = await axios.get(
          `${endpoints[endpoints.length - 2].endpoint}`
        );
        return response;
      }
    };
    try {
      const data = await getData();
      console.log(data);
      setJsonResponse(JSON.stringify(data.data, null, 2));
    } catch {
      console.error("Error querying data");
    }
  };

  const handleAddAction = () => {
    setActions([...actions, { type: null, filterQuery: "" }]);
    // setEndpoints([...endpoints, { endpoint: "", method: "GET" }]);
    setDropdownOpen([...dropdownOpen, false]); // Add a new dropdown state for each new action
  };

  const handleActionTypeChange = (index, value) => {
    const updatedActions = [...actions];
    updatedActions[index].type = value;
    setActions(updatedActions);
    if (value == "apiCall")
      setEndpoints([...endpoints, { endpoint: "", method: "GET" }]);
  };

  const handleFilterQueryChange = (index, value) => {
    const updatedActions = [...actions];
    updatedActions[index].filterQuery = value;
    setActions(updatedActions);
  };

  const handleActionExecute = async (index) => {
    const action = actions[index];
    if (action.type === "filterJSON") {
      try {
        const queryResult = await axios.post(
          "http://localhost:8080/jsonQuery",
          {
            data: JSON.parse(jsonResponse),
            jsonPathQuery: action.filterQuery,
          }
        );
        setJsonResponse(JSON.stringify(queryResult.data, null, 2));
        // setFilteredData(JSON.stringify(queryResult.data, null, 2));
      } catch (error) {
        console.error("Error querying data:", error);
        // setFilteredData('Error querying data. Please check your JSONPath query.');
      }
      // const data = await filterJson(JSON.parse(jsonResponse), action.filterQuery);
      // setJsonResponse(JSON.stringify(data, null, 2));
    } else if (action.type === "apiCall") {
      const getData = () => {
        if (endpoints[endpoints.length - 1].method === "POST")
          return axios.post(
            `${endpoints[endpoints.length - 1].endpoint}`,
            jsonResponse
          );
        else axios.get(`${endpoints[endpoints.length - 1].endpoint}`);
      };
      try {
        const data = getData();
        setJsonResponse(JSON.stringify(data.data, null, 2));
      } catch {
        console.error("Error querying data");
      }
    }
  };

  return (
    <Container fluid>
      <Row>
        <Col xs={6}>
          <div style={{ padding: 16 }}>
            <Button
              outline
              color="primary"
              onClick={handleAddAction}
              style={{ marginBottom: 16 }}
            >
              Add Action
            </Button>

            {actions.map((action, index) => (
              <div key={index} style={{ marginBottom: 16 }}>
                <FormGroup>
                  <Label for={`actionType-${index}`}>Action Type</Label>
                  <Input
                    type="select"
                    id={`actionType-${index}`}
                    value={action.type || ""} // Ensure action.type is not null
                    onChange={(e) =>
                      handleActionTypeChange(index, e.target.value)
                    }
                  >
                    <option value="">Select Action Type</option>
                    <option value="filterJSON">Filter JSON</option>
                    <option value="apiCall">API Call</option>
                  </Input>
                </FormGroup>

                {action.type === "filterJSON" && (
                  <div>
                    <InputGroup style={{ marginBottom: 16 }}>
                      <Input
                        placeholder="Filter Query"
                        value={action.filterQuery}
                        onChange={(e) =>
                          handleFilterQueryChange(index, e.target.value)
                        }
                      />
                      <InputGroupText>
                        <Button
                          color="primary"
                          onClick={() => handleActionExecute(index)}
                        >
                          Execute Filter JSON
                        </Button>
                      </InputGroupText>
                    </InputGroup>
                  </div>
                )}

                {action.type === "apiCall" && (
                  <div key={index}>
                    <InputGroup style={{ marginBottom: 16 }}>
                      <Input
                        placeholder="Endpoint"
                        value={endpoints[index].endpoint}
                        onChange={(e) =>
                          handleEndpointChange(
                            index,
                            "endpoint",
                            e.target.value
                          )
                        }
                      />
                      <Dropdown isOpen={dropdownOpen[index]} toggle={() => toggleDropdown(index)}>
                        <DropdownToggle caret color="primary">
                          {endpoints[index].method}{" "}
                          {/* Display the selected method */}
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem
                            onClick={() =>
                              handleEndpointChange(index, "method", "GET")
                            }
                          >
                            GET
                          </DropdownItem>
                          <DropdownItem
                            onClick={() =>
                              handleEndpointChange(index, "method", "POST")
                            }
                          >
                            POST
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                      <InputGroupText>
                        <Button color="primary" onClick={handleMakeApiCall}>
                          Make API Call
                        </Button>
                      </InputGroupText>
                    </InputGroup>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Col>
        <Col xs={6}>
          <div
            style={{
              padding: 16,
              height: "calc(100vh - 64px)",
              overflowY: "auto",
            }}
          >
            <pre style={{ whiteSpace: "pre-wrap" }}>{jsonResponse}</pre>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ApiCallComponent;
