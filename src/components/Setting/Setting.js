import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import {Button, Table, Container, Row, Col} from "react-bootstrap";
import "../../assets/css/setting.css";
import { useTranslation } from 'react-i18next';
import config from '../../config'
import SettingService from "../../services/SettingService"

function Setting() {
  const {t, i18n} = useTranslation();
  const [modalShow, setModalShow] = useState(false);
  const [resetShow, setResetShow] = useState(false);
  const [resetHp, setResetHp] = useState("");
  const [resetStandard, setResetStandard] = useState("");
  const [valueGreat, setValueGreat] = useState("");
  const [valueGood, setValueGood] = useState("");
  const [valueAcceptable, setValueAcceptable] = useState("");
  const [valuePoor, setValuePoor] = useState("");
  const [valueVeryPoor, setValueVeryPoor] = useState("");
  const [settingData, setSettingData] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const statusThresholds = ["score", "temp", "humidity", "co2", "voc", "pm25", "light", "noise"];
  const [modalLabel , setModalLabel] = useState('');
  const statusEnvironment = [/*"outdoor",*/ "indoor"]; // Temporary disabled outdoor...
  const settingService = new SettingService();

  useEffect(() => {
    fetchSettings();
  }, [])

  const fetchSettings = () => {
    setIsLoaded(false);
    settingService.retrieveThresolds().then(result => {
        if (result) 
          setSettingData(result.data);
        setIsLoaded(true);
      }
    );
  }

  const saveSetting = () => {
    settingService.saveThresolds(settingData).then(result => {
      if (result)
        alert("result saved successfully");
      }
    ); 
  }

  const [gvalue, setGValue] = useState(""); 
  const [gdoor_value, setGDoorValue] = useState("");
  const showEditModal = (value, door_value) => 
  {
    setModalLabel(value);
    if ([statusThresholds[3], statusThresholds[4], statusThresholds[5]].includes(value)){
      setResetShow(true);
      setResetHp(settingData[door_value][value].resetHP);
      setResetStandard(settingData[door_value][value].resetStandard);
    }
    else 
      setResetShow(false);

    setValueGreat(settingData[door_value][value]? settingData[door_value][value].great:0);
    setValueGood(settingData[door_value][value]? settingData[door_value][value].good:0);
    setValueAcceptable(settingData[door_value][value]? settingData[door_value][value].acceptable:0);
    setValuePoor(settingData[door_value][value]? settingData[door_value][value].poor:0);
    setValueVeryPoor(settingData[door_value][value]? settingData[door_value][value].veryPoor:0);
    setGValue(value);
    setGDoorValue(door_value);
    setModalShow(true); 
  }
  const closeEditModal = () => setModalShow(false);

  const handleSettingModalClose = () => {
    settingData[gdoor_value][gvalue].resetHP = resetHp;
    settingData[gdoor_value][gvalue].resetStandard = resetStandard;

    settingData[gdoor_value][gvalue].great = parseInt(valueGreat);
    settingData[gdoor_value][gvalue].good = valueGood;
    settingData[gdoor_value][gvalue].acceptable = valueAcceptable;
    settingData[gdoor_value][gvalue].poor = valuePoor;
    settingData[gdoor_value][gvalue].veryPoor = valueVeryPoor;
    setModalShow(false);
  }

  return (
    <>
      {isLoaded==false? 
        <div className="text-center"> <img src={require("assets/img/loading.gif").default}/></div>
        : 
        <div>
      <Container fluid>
        <Row>
        <Col md="8">
            <div className="display-flex">
            {statusEnvironment.map(statusItem => 
            <div key={statusItem}>
              {/*<div className="status-item"> {statusItem} </div>*/}
              <Table className="setting_table">                  
                <thead>
                  <tr className="table_head">
                    <td className="value_tr">                        
                      {t('value')}                                                      
                    </td>
                    <td className="reset_tr">                      
                      {t('reset_standard')}                      
                    </td>                    
                    <td className="hp_tr">                      
                      {t('reset_hp')}                      
                    </td>                    
                    <td className="edit_title"></td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{t('air_quality_index')}</td>                      
                    <td></td>
                    <td></td>
                    <td className="text-center"><img onClick={() => showEditModal(statusThresholds[0], statusItem)} className="imgBox" src={require("assets/img/element/edit.png").default} alt="..."/></td>
                  </tr>
                  <tr>
                    <td>{t('temperature')} (°C)</td>                      
                    <td></td>
                    <td></td>
                    <td className="text-center"><img onClick={() => showEditModal(statusThresholds[1], statusItem)} className="imgBox" src={require("assets/img/element/edit.png").default} alt="..."/></td>
                  </tr>
                  <tr>
                    <td>{t('humidity')} (%)</td>                      
                    <td></td>
                    <td></td>
                    <td className="text-center"><img onClick={() => showEditModal(statusThresholds[2], statusItem)} className="imgBox" src={require("assets/img/element/edit.png").default} alt="..."/></td>
                  </tr>
                  <tr>                      
                    <td>CO<sub>2</sub> (ppm)</td>                      
                    <td>
                      <input onChange={event => {settingData[statusItem][statusThresholds[3]].resetStandard = event.target.value; setSettingData(JSON.parse(JSON.stringify(settingData)));}}  value={settingData[statusItem][statusThresholds[3]].resetStandard} className="setting_input" placeholder="217"/>
                    </td>
                    <td>
                      <input onChange={event => {settingData[statusItem][statusThresholds[3]].resetHP = event.target.value; setSettingData(JSON.parse(JSON.stringify(settingData)));}}  value={settingData[statusItem][statusThresholds[3]].resetHP} className="setting_input" placeholder="173"/>
                    </td>
                    <td className="text-center"><img onClick={() => showEditModal(statusThresholds[3], statusItem)} className="imgBox" src={require("assets/img/element/edit.png").default} alt="..."/></td>
                  </tr>
                  <tr>
                    <td>TVOCs (ppb)</td>
                    <td>
                      <input onChange={event => {settingData[statusItem][statusThresholds[4]].resetStandard = event.target.value; setSettingData(JSON.parse(JSON.stringify(settingData)));}}  value={settingData[statusItem][statusThresholds[4]].resetStandard} className="setting_input" placeholder="1000"/>
                    </td>
                    <td>
                      <input onChange={event => {settingData[statusItem][statusThresholds[4]].resetHP = event.target.value; setSettingData(JSON.parse(JSON.stringify(settingData)));}}  value={settingData[statusItem][statusThresholds[4]].resetHP} className="setting_input" placeholder="600"/>
                    </td>
                    <td className="text-center"><img onClick={() => showEditModal(statusThresholds[4], statusItem)} className="imgBox" src={require("assets/img/element/edit.png").default} alt="..."/></td>
                  </tr>
                  <tr>                      
                    <td>P.M.25 (ug/m<sup>3</sup>)</td>                      
                    <td>
                      <input onChange={event => {settingData[statusItem][statusThresholds[5]].resetStandard = event.target.value; setSettingData(JSON.parse(JSON.stringify(settingData)));}}  value={settingData[statusItem][statusThresholds[5]].resetStandard}  className="setting_input" placeholder="35"/>
                    </td>
                    <td>
                      <input onChange={event => {settingData[statusItem][statusThresholds[5]].resetHP = event.target.value; setSettingData(JSON.parse(JSON.stringify(settingData)));}}  value={settingData[statusItem][statusThresholds[5]].resetHP} className="setting_input" placeholder="12.5"/>
                    </td>
                    <td className="text-center"><img onClick={() => showEditModal(statusThresholds[5], statusItem)} className="imgBox" src={require("assets/img/element/edit.png").default} alt="..."/></td>
                  </tr>
                  {/* <tr>                      
                    <td>{t('light')} (lx)</td>                      
                    <td></td>
                    <td></td>
                    <td className="text-center"><img onClick={() => showEditModal(statusThresholds[6], statusItem)} className="imgBox" src={require("assets/img/element/edit.png").default} alt="..."/></td>
                  </tr>
                  <tr>                      
                    <td>{t('noise')} (dB)</td>                      
                    <td></td>
                    <td></td>
                    <td className="text-center"><img onClick={() => showEditModal(statusThresholds[7], statusItem)} className="imgBox" src={require("assets/img/element/edit.png").default} alt="..."/></td>
                  </tr> */}
                </tbody>
                <tfoot className={statusItem=="outdoor"? "display-none":"setting_table_footer"}>
                  <tr>
                    <td colSpan="4">
                      <button className="button-field setting_save_btn" onClick={saveSetting}>{t('save')}</button>
                    </td>
                  </tr>                    
                </tfoot>
              </Table>
              </div>
            )}
             </div>
          </Col>
        </Row>
      </Container>
      </div>
    }
      <Modal className="set_index" show={modalShow} onHide={closeEditModal}>
        <Modal.Header className="modal_header" closeButton>
          <Modal.Title className="modal_title">{modalLabel}</Modal.Title>
        </Modal.Header>
        <Modal.Body>          
          <div className="venue_div" style={{"display":"flex", "flexDirection":"column", "justifyContent":"center"}}>
            <div className={resetShow? "": "display-none"}>
              <div>{t('reset_standard')}</div>
              <input value={resetStandard} onChange={event => setResetStandard(event.target.value)} className="reset_input" type="text"/>
              <div>{t('reset_hp')}</div>
              <input value={resetHp} onChange={event => setResetHp(event.target.value)} className="reset_input" type="text"/>            
            </div>
            <div>{t('from(included)')}</div>
            <div className="index_row">
              <img className="option_status_img" src={require("assets/img/element/settings/great.png").default} alt="..."/>
              <input value={valueGreat} onChange={event => setValueGreat(event.target.value)} className="index_input" type="text" placeholder=" great"/>
            </div>            
            <div className="index_row">
              <img className="option_status_img" src={require("assets/img/element/settings/good.png").default} alt="..."/>              
              <input value={valueGood} onChange={event => setValueGood(event.target.value)} className="index_input" type="text" placeholder=" good"/>
            </div>                          
            <div className="index_row">
              <img className="option_status_img" src={require("assets/img/element/settings/acceptable.png").default} alt="..."/>
              <input value={valueAcceptable} onChange={event => setValueAcceptable(event.target.value)} className="index_input" type="text"  placeholder=" acceptable"/>
            </div>
            <div className="index_row">
              <img className="option_status_img" src={require("assets/img/element/settings/poor.png").default} alt="..."/>
              <input value={valuePoor} onChange={event => setValuePoor(event.target.value)} className="index_input" type="text"  placeholder=" poor"/>
            </div>
            <div className="index_row">
              <img className="option_status_img" src={require("assets/img/element/settings/verypoor.png").default} alt="..."/>
              <input value={valueVeryPoor} onChange={event => setValueVeryPoor(event.target.value)} className="index_input" type="text" placeholder=" veryPoor"/>
            </div>            
          </div>
        </Modal.Body>
        <Modal.Footer className="modal_footer">          
          <Button className="index_save_btn" onClick={handleSettingModalClose}>
          {t('save')}
          </Button>
        </Modal.Footer>
      </Modal>

    </>
  );
}

export default Setting;
