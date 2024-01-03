import React from "react";
import { Nav, Navbar, NavItem, NavLink, Button } from "reactstrap";
import { FaTruck } from "react-icons/fa";

const CustomNavbar = () => {
    const handleCarrierSelection = () => {
      // Implement your logic for selecting a carrier here
      console.log("Carrier selected!");
    };


  return (
    <Navbar color="primary" dark expand="md">
      <Nav className="mr-auto" navbar>
        <NavItem>
          <NavLink href="/" style={{ color: 'white' }}>Create Flow</NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="/workorder" style={{ color: 'white' }}>Create Work Order</NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="/workorderlist" style={{ color: 'white' }}>Work Order List</NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="/workflowlist" style={{ color: 'white' }}>Work FLow List</NavLink>
        </NavItem>
      </Nav>
      <NavItem>
        <Button color="primary" onClick={handleCarrierSelection}>
          <FaTruck style={{ marginRight: '5px' }} />
          Carriers
        </Button>
      </NavItem>
    </Navbar>
  );
};

export default CustomNavbar;
