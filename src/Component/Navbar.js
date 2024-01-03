import React, { useState } from 'react';
import { Navbar, Nav, NavItem, Button } from 'reactstrap';
import { FaTruck } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';

const CustomNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeButton, setActiveButton] = useState('');

  const handleNavClick = (path, buttonName) => {
    navigate(path);
    setActiveButton(buttonName);
  };

  const handleCarrierSelection = () => {
    navigate('/carriers');
    setActiveButton('carriers');
  };

  const isActive = (pathname) => {
    return location.pathname === pathname ? 'active-inherit' : '';
  };

  return (
    <Navbar color="primary" dark expand="md">
      <Nav className="mr-auto" navbar>
        <NavItem>
          <Button
            color="inherit"
            style={{ color: 'white' }}
            onClick={() => handleNavClick('/', 'createFlow')}
            className={isActive('/') + ' ' + (activeButton === 'createFlow' ? 'active' : '')}
          >
            Create Flow
          </Button>
        </NavItem>
        <NavItem>
          <Button
            color="inherit"
            style={{ color: 'white' }}
            onClick={() => handleNavClick('/workorder', 'createWorkOrder')}
            className={isActive('/workorder') + ' ' + (activeButton === 'createWorkOrder' ? 'active' : '')}
          >
            Create Work Order
          </Button>
        </NavItem>
        <NavItem>
          <Button
            color="inherit"
            style={{ color: 'white' }}
            onClick={() => handleNavClick('/workorderlist', 'workOrderList')}
            className={isActive('/workorderlist') + ' ' + (activeButton === 'workOrderList' ? 'active' : '')}
          >
            Work Order List
          </Button>
        </NavItem>
        <NavItem>
          <Button
            color="inherit"
            style={{ color: 'white' }}
            onClick={() => handleNavClick('/workflowlist', 'workFlowList')}
            className={isActive('/workflowlist') + ' ' + (activeButton === 'workFlowList' ? 'active' : '')}
          >
            Work Flow List
          </Button>
        </NavItem>
      </Nav>
      <NavItem>
        <Button
          color="primary"
          onClick={handleCarrierSelection}
          className={activeButton === 'carriers' ? 'active' : ''}
        >
          <FaTruck style={{ marginRight: '5px' }} />
          Carriers
        </Button>
      </NavItem>
    </Navbar>
  );
};

export default CustomNavbar;
