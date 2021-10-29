import React, { useState } from "react";
import { Navbar, Container, Nav} from "react-bootstrap";
import "../../assets/css/header.css";
import { history } from '../Auth/helpers';
import { useTranslation } from 'react-i18next';
import Modal from "react-bootstrap/Modal";
import {Button} from "react-bootstrap";
import {
  Menu,
  MenuList,
  MenuButton,
  MenuItem,
} from "@reach/menu-button";
import "@reach/menu-button/styles.css";
import UserService from "../../services/UserService"

function logOut(){
  localStorage.removeItem('user');
  history.push('/login');
}

export function Header() {
  const { t, i18n } = useTranslation();
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [phone, setPhone] = useState("");
  const userService = new UserService();

  const fetchUserProfile = () => {
      userService.getProfile().then(result => {  
        if (result) {
          setName(result.data.name); 
          setSurname(result.data.surname);
          setPhone(result.data.phone);
        }
        setShow(true); 
        }
      );
  }

  const save = () => {
    let jsonData = {
      name: name,
      surname: surname,
      phone: phone
    }
    userService.editProfile(jsonData).then(() => {  
        setShow(false);
      }
    );
  }

  const handleClose = () => setShow(false);
  const handleShow = () => {
    fetchUserProfile();
  };  
  const changeLanguage = (event) => {
    i18n.changeLanguage(event.target.value)
  }
   
  return (    
    <Navbar bg="light" expand="lg" className="navbar-custom">
        <Modal className="profile_modal" show={show} onHide={handleClose}>
          <Modal.Header className="modal_header" closeButton>
              <Modal.Title className="modal_title">{t('profile')}</Modal.Title>
          </Modal.Header>
          <Modal.Body>            
            <div className="profile_div">            
                <div>{t('name')}</div>
                <div className="profile_row">                       
                    <input  onChange={event => setName(event.target.value)} value={name}  className="profile_input" type="text"/>
                </div>
                <div>{t('surname')}</div>
                <div className="profile_row">                       
                    <input  onChange={event => setSurname(event.target.value)} value={surname} className="profile_input" type="text"/>
                </div>
                <div>{t('phone_number')}</div>
                <div className="profile_row">                       
                    <input  onChange={event => setPhone(event.target.value)} value={phone} className="profile_input" type="text"/>
                </div>                    
            </div>          
          </Modal.Body>
          <Modal.Footer className="modal_footer">                      
            <Button className="profile_save_btn" onClick={save}>
            {t('save')}
            </Button>              
          </Modal.Footer>
      </Modal>
      <Container fluid>
        <div className="language-select">
          <select
            className="custom-select"            
            onChange={changeLanguage}
          >
            <option value="en" name="language" defaultValue>English</option>
            <option value="it" name="language">Italian</option>
          </select>
        </div>        
        <Navbar.Collapse id="basic-navbar-nav">          
          <Nav className="ml-auto" navbar>
            <Nav.Item>          
                <div className="info">                  
                  <div className="company">{t('company')}</div>
                  <div className="user">{t('superAdmin')}</div>                  
                </div>              
            </Nav.Item>                      
          </Nav>
          <Menu>
            <MenuButton className="arrow"><span className="nc-icon nc-stre-down"></span></MenuButton>
            <MenuList>
              <MenuItem onSelect={handleShow}>{t('profile')}</MenuItem>
              <MenuItem onSelect={logOut}>{t('logout')}</MenuItem>
            </MenuList>
          </Menu>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
