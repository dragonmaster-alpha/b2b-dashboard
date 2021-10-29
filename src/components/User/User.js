import React, { useState, useEffect } from 'react';
import Modal from "react-bootstrap/Modal";
import { useTranslation } from 'react-i18next';
import ReactPaginate from 'react-paginate';

// react-bootstrap components
import {Table, Container, Row, Col} from "react-bootstrap";
import config from '../../config'
import UserRow from "./UserRow"
import UserService from "../../services/UserService"
import VenueService from "../../services/VenueService"

function User() {
  const { t, i18n } = useTranslation();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => {setShow(true);  setMail(""); setEditFlag(false);}
  const [pageNumber, setPageNumber] = useState(0);
  const [pageLimit, setPageLimit] = useState(config.pageLimitOption1);
  const [venueItems, setVenueItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [items, setItems] = useState([]);
  const [mail, setMail] = useState('');
  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);
  const [coData, setCoData] = useState(null);
  const [editFlag, setEditFlag] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [permissions, setPermissions] = useState([
    {
      "venueId": 0,
      "venueShow": false,
      "venueName": "",
      "role": "",
      "roleShow": false
    }
  ])
  const userService = new UserService();
  const venueService = new VenueService();

  const fetchUser = () => {
    setIsLoaded(false);
    userService.retrieveItems(pageNumber, pageLimit).then(result => {
        if (result) {
          setItems(result.data.items); setTotal(result.data.total); 
        }
        setIsLoaded(true);
      }
    );
  }
 
  useEffect(() => {
    fetchUser();  
  }, [pageLimit, pageNumber])

  useEffect(() => {
    venueService.retrieveItems(pageNumber, config.pageUnlimitValue).then(result => {
      if (result)
        setVenueItems(result.data.items);
      }
    );
  }, [])
  
  const handleEdit = (index) => {
    const data = items.find(item => item.id === index);
    setCoData(data)
    setShow(true);
    setEditFlag(true);
    setMail(data.mail);
    let permissions_ = data.permissions;
    let temp = [];
    let emptyFlag = true;
    permissions_.map((permission) =>{
        let dd = {
          "venueId": permission.venue.id,
          "venueShow": false,
          "venueName": permission.venue.name,
          "role": permission.role,
          "roleShow": false
        }
        temp.push(dd);
        emptyFlag = false;
      }
    )
    if (emptyFlag) {
      temp.push({
        "venueId": 0,
        "venueShow": false,
        "venueName": "",
        "role": "",
        "roleShow": false
      });
    }
    setPermissions(temp);
  };

  const selectVenueOption = (index, id, name) => {
    let permissions_ = permissions;
    permissions_[index].venueName = name;
    permissions_[index].venueId = id;
    setPermissions(permissions_);
    dropDownHide();
  }

  const selectRoleOption = (index, name) => {
    let permissions_ = permissions;
    permissions_[index].role = name;
    setPermissions(permissions_);
    dropDownHide();
  }

  const venueDropDownShow = (index) => {
    let permissions_ = permissions;
    if (permissions_[index].venueShow == true) {
      dropDownHide();
      permissions_[index].venueShow = false;
    }
    else {
      dropDownHide();
      permissions_[index].venueShow = true;
    }

    setPermissions(permissions_);
    forceUpdate();
  }
  
  const roleDropDownShow = (index) => {
    let permissions_ = permissions;
    if (permissions_[index].roleShow == true) {
      dropDownHide();
      permissions_[index].roleShow = false;
    }
    else {
      dropDownHide();
      permissions_[index].roleShow = true;
    }
    setPermissions(permissions_);
    forceUpdate();
  }

  const dropDownHide = () => {
    let permissions_ = permissions;
    {permissions_.map(function(permission){
        permission.roleShow = false;
        permission.venueShow = false;
    })}
    setPermissions(permissions_);
    forceUpdate();  
  }

  const addNewRow = () => {
    let permissions_ = permissions;
    let emptyFlag = false;
    {permissions_.map(function(permission){
        if (permission.role == "" || permission.venueName=="") {
          emptyFlag = true;
        }
    })}
    if (!emptyFlag) {
      permissions_.push({
        "venueId": 0,
        "role": "",
        "venueShow": false,
        "venueName": "",
        "roleShow": false
      });
      setPermissions(permissions_);
      forceUpdate();
    }
    else {
      alert ("You cannot add new row without empt values");
      return;
    }
  }

  const removeRow = (index) => {
    let permissions_ = permissions;
    permissions_.splice(index, 1);
    setPermissions(permissions_);
    forceUpdate();
  }

  const addNewUser = () => {
    if (editFlag == false) {
      setIsLoaded(false);
      let jsonData = {
        mail: mail,
        permissions: permissions
      }
      userService.createItem(jsonData).then(result => {  
        if (result) {
          fetchUser();
          setShow(false);
        }
      }
      );

    }
    else {
      setIsLoaded(false);
      let jsonData = {
        permissions: permissions,
        id: coData.id
      }
      userService.editItem(jsonData).then(result => { 
        if (result) {
          fetchUser();
          setShow(false);
        }
        }
      );
    }
  }

  const handleChange = (e) => {
    let limit;
    if (e.target.value == 0){
      limit = config.pageLimitOption1;
    }
    else if (e.target.value == 1){
      limit = config.pageLimitOption2;
    }
    else {
      limit = total;
    }
    setPageNumber(0);
    setPageLimit(limit);
  }

  const handlePageClick = (data) => {
    let selected = data.selected;
    setPageNumber(selected);
  };

  const handleRemoveVenue = (id, index) => {
    const data = items.find(item => item.id === id);
    let permissions_ = data.permissions;
    permissions_.splice(index, 1);
    let temp = [];
    permissions_.map((permission) =>{
        let dd = {
          "venueId": permission.venue.id,
          "venueShow": false,
          "venueName": permission.venue.name,
          "role": permission.role,
          "roleShow": false
        }
        temp.push(dd);
      }
    )
    setIsLoaded(false);
    let jsonData = {
      permissions: temp,
      id: id
    }

    userService.editItem(jsonData).then(result => {  
        if (result) {
        fetchUser();
        setIsLoaded(true);
        }
      }
    );
  }

  return (
    <>
    {isLoaded==false? 
        <div className="text-center loading"> <img src={require("assets/img/loading.gif").default}/></div> 
        :         <div></div>}
        <div style={{"overflowY":"hidden"}}></div>
      <button variant="primary" className="button-field add_user" onClick={handleShow} ><img className="user_img" src={require("assets/img/element/users.png").default} alt="..."/>{t('new_user')}</button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header className="modal_header" closeButton>
          <Modal.Title className="modal_title">{t('new_user')}</Modal.Title>
        </Modal.Header>
        <Modal.Body >
          <div className="mail_div">
            <div>{t('mail')}</div>
            <input onChange={event => setMail(event.target.value)} value={mail} onClick={dropDownHide} className="fullWidth form-field" type="text"/>
          </div>       
          
            <div className="button-field" onClick={addNewRow}> Venu Role +</div>
          
          <div className="venueRoleBox">
            {permissions.map((permission, index)=>
              <div className="venue_div" key={index} style={{"display":"flex", "justifyContent":"space-between"}}>
                <div className="position-relative">
                  <div>{t('venue')}</div>
                  <input onClick={()=>venueDropDownShow(index)} value={permission.venueName} className="width-200px form-field" type="text" readOnly/>
                  <button  onClick={()=>venueDropDownShow(index)} className="arrow_button"><span className="nc-icon nc-stre-down"></span></button>
                  <div className={permission.venueShow ? 'handy-dropdown-box' : 'hidden'}>
                        {venueItems.map(item => 
                            <div className="handy-dropdown-item" key={item.id} onClick={() => selectVenueOption(index, item.id, item.name)}> {item.name} </div>  
                        )}
                  </div>
                </div>
                <div className="position-relative">
                  <div>{t('role')}</div>
                  <input onClick={()=>roleDropDownShow(index)} value={permission.role} className="width-200px form-field" type="text" readOnly/>
                  <button  onClick={()=>roleDropDownShow(index)} className="arrow_button"><span className="nc-icon nc-stre-down"></span></button>            
                  <div className={permission.roleShow ? 'handy-dropdown-box' : 'hidden'}>
                        {config.roleItems.map(item => 
                            <div key={item.name} className="handy-dropdown-item" onClick={() => selectRoleOption(index, item.name)}> {item.name} </div>  
                        )}
                  </div>          
                </div>
                <button onClick={()=>removeRow(index)} className={index==0? "arrow_button disabled": "arrow_button"} style={{"marginTop":"5%"}} disabled={index==0? "true":""}>-</button>
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer className="modal_footer">          
          <div className="button-field user_add" onClick={addNewUser}>
            {t('add')}
          </div>
        </Modal.Footer>
      </Modal>

      <Container fluid>
        <Row>
          <Col md="8">
            <div>
              <Table className="user_table">                  
                <thead>
                  <tr className="table_head">
                    <td className="mail_title">                        
                      <div style={{"display": "flex", "justifyContent":"space-between" }}>
                        <span>{t('mail')}</span>
                        <span className="nc-icon nc-stre-up"></span>
                      </div>
                      <input className="fullWidth form-field" type="text"/>                        
                    </td>
                    <td className="venue_title">
                      <div style={{"display": "flex", "justifyContent":"space-between" }}>
                        <span>{t('venue')}</span>
                        <span className="nc-icon nc-stre-up"></span>
                      </div>                        
                      <input className="fullWidth form-field" type="text"/>   
                    </td>
                    <td className="edit_title"></td>
                  </tr>
                </thead>
                <tbody>  
                  {items.map(item =>
                    <UserRow item={item} key={item.id} handleEdit={handleEdit} handleRemoveVenue={handleRemoveVenue}></UserRow>
                  )} 
                </tbody>
                <tfoot className="user_table_footer">
                <tr>
                    <td colSpan={9}>
                    <div className="pagination_group">
                          <div className="pagination-number-style">
                              <div className="company_page_size_div">
                                <label className="page_size_label">{t('page_size')}</label>
                                <select className="page_size_select" onChange={handleChange}> 
                                  <option value="0">10</option>
                                  <option value="1">100</option>
                                  <option value="2">{t('all')}</option>
                                </select>
                              </div>
                              <div style={{"display": "flex", "justifyContent":"space-between"}}>
                                
                              </div>
                          </div>
                        <div>
                          <ReactPaginate
                            previousLabel={"← Previous"}
                            nextLabel={"Next →"}
                            pageCount={Math.ceil(total/pageLimit)}
                            marginPagesDisplayed={config.marginPagesDisplayed}
                            pageRangeDisplayed={config.pageRangeDisplayed}
                            onPageChange={handlePageClick}
                            containerClassName={"pagination"}
                            previousLinkClassName={"pagination__link"}
                            nextLinkClassName={"pagination__link"}
                            disabledClassName={"pagination__link--disabled"}
                            activeClassName={"pagination__link--active"}
                            forcePage={pageNumber}
                          />
                          </div>
                      </div>
                     
                    </td>                      
                  </tr>                     
                </tfoot>
              </Table>
             </div>
          </Col>
        </Row>
      </Container>
    </>
  );
 
}

export default User;
