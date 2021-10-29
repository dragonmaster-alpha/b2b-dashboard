import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import {Button} from "react-bootstrap";
import "../../assets/scss/navbar.scss";
import { history } from '../Auth/helpers';
import { useTranslation } from 'react-i18next';
import { Breakpoint } from "react-socks";
import {
    Menu,
    MenuList,
    MenuButton,
    MenuItem,
  } from "@reach/menu-button";
import "@reach/menu-button/styles.css";
import UserService from "../../services/UserService"
import VenueService from "../../services/VenueService"
import config from '../../config'
import { FaHome, FaUser } from 'react-icons/fa';

function gotoDashboard(){
    history.push('/admin/home');
}

function logOut(){
    localStorage.removeItem('user');
    history.push('/login');
}

export default function Navbar(){    
    const { t } = useTranslation();

    const [show, setShow] = useState(false);
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [phone, setPhone] = useState("");
    const [headerColor, setHeaderColor] = useState("");
    const [textColor, setTextColor] = useState("");
    const [logo, setLogo] = useState("");
    const handleClose = () => setShow(false);
    const handleShow = () =>  {
        fetchUserProfile();       
    }
    const [isLoaded, setIsLoaded] = useState(false);
    const userService = new UserService();
    const venueService = new VenueService();
    
    useEffect(() => {
        var selectedVenueId = localStorage.getItem("selectedVenueId");
        setIsLoaded(false);
        venueService.getItem(selectedVenueId).then(result => {
            if (result){
                setHeaderColor(config.settingsVenueInit.headerColor);
                setTextColor(config.settingsVenueInit.textColor);
                setLogo("");
                if (Object.prototype.hasOwnProperty.call(result.data, "settings")) {
                    setHeaderColor(result.data.settings.headerColor);
                    setTextColor(result.data.settings.textColor);
                    setLogo(result.data.settings.logo);
                }
            }
            setIsLoaded(true);
        });
    }, [])

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

    return(
        <>
              {isLoaded==false? 
        <div className="text-center loading"> <img src={require("assets/img/loading.gif").default}/></div> 
        :         <div>

        <Breakpoint large up>
            <div className="navbar_div" style={{backgroundColor: headerColor}}>                
                <img className="brand_img" src={logo} alt="..." />                
                <div className="img_div">
                    <FaHome className="navhome_img" onClick={gotoDashboard} style={{color: textColor}}/>
                    <Menu>
                        <MenuButton className="user"><FaUser className="navuser_img" style={{color: textColor}}/></MenuButton>
                        <MenuList>
                            <MenuItem onSelect={handleShow}>{t('profile')}</MenuItem>
                            <MenuItem onSelect={logOut}>{t('logout')}</MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </div>

            <Modal className="profile_modal" show={show} onHide={handleClose}>
                <Modal.Header className="modal_header" closeButton>
                    <Modal.Title className="modal_title">{t('profile')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Breakpoint large up>
                        <div className="profile_div">            
                            <div>{t('name')}</div>
                            <div className="profile_row">                       
                                <input  onChange={event => setName(event.target.value)} value={name} className="profile_input" type="text"/>
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
                    </Breakpoint>
                </Modal.Body>
                <Modal.Footer className="modal_footer">
                    <Breakpoint large up>
                        <Button className="profile_save_btn" onClick={save}>
                        {t('save')}
                        </Button>
                    </Breakpoint>
                </Modal.Footer>
            </Modal>    
        </Breakpoint>

        <Breakpoint medium>
            <div className="navbar_div" style={{backgroundColor: headerColor}}>                
                <img className="brand_img" src={logo} alt="..." />                
                <div className="img_div">
                    <FaHome className="navhome_img" onClick={gotoDashboard} style={{color: textColor}}/>
                    <Menu>
                        <MenuButton className="user"><FaUser className="navuser_img" style={{color: textColor}}/></MenuButton>
                        <MenuList>
                            <MenuItem onSelect={handleShow}>{t('profile')}</MenuItem>
                            <MenuItem onSelect={logOut}>{t('logout')}</MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </div>

            <Modal className="profile_modal" show={show} onHide={handleClose}>
                <Modal.Header className="modal_header" closeButton>
                    <Modal.Title className="modal_title">{t('profile')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Breakpoint large up>
                        <div className="profile_div">            
                            <div>{t('name')}</div>
                            <div className="profile_row">                       
                                <input  onChange={event => setName(event.target.value)} value={name} className="profile_input" type="text"/>
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
                    </Breakpoint>
                </Modal.Body>
                <Modal.Footer className="modal_footer">
                    <Breakpoint large up>
                        <Button className="profile_save_btn" onClick={save}>
                        {t('save')}
                        </Button>
                    </Breakpoint>
                </Modal.Footer>
            </Modal>    
        </Breakpoint>
        
        <Breakpoint small down>
            <div className="navbar_div" style={{backgroundColor: headerColor}}>                
                <img className="brand_img" src={logo} alt="..." />                
                <div className="img_div">
                    <FaHome className="navhome_img" onClick={gotoDashboard} style={{color: textColor}}/>
                    <Menu>
                        <MenuButton className="user"><FaUser className="navuser_img" style={{color: textColor}}/></MenuButton>
                        <MenuList>
                            <MenuItem onSelect={handleShow}>{t('profile')}</MenuItem>
                            <MenuItem onSelect={logOut}>{t('logout')}</MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </div>

            <Modal className="profile_modal" show={show} onHide={handleClose}>
                <Modal.Header className="modal_header" closeButton>
                    <Modal.Title className="modal_title">{t('profile')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Breakpoint large up>
                        <div className="profile_div">            
                            <div>{t('name')}</div>
                            <div className="profile_row">                       
                                <input  onChange={event => setName(event.target.value)} value={name} className="profile_input" type="text"/>
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
                    </Breakpoint>
                </Modal.Body>
                <Modal.Footer className="modal_footer">
                    <Breakpoint large up>
                        <Button className="profile_save_btn" onClick={save}>
                        {t('save')}
                        </Button>
                    </Breakpoint>
                </Modal.Footer>
            </Modal>    
        </Breakpoint>
        </div>}
        </>
    );
}