import React, { useState, useEffect } from "react";
import config from '../../config'
import VenueService from "../../services/VenueService"
import VenueSettingModal from "../Venue/VenueSettingModal"
import SettingService from "../../services/SettingService"

import {
  Card,
  Container,
  Row,
  Col
} from "react-bootstrap";
import { useTranslation } from 'react-i18next';
import { history } from '../Auth/helpers';
import './Home.css'
                                                
function VenueStatus(){
  const {t, i18n} = useTranslation();
  const [show_option, setOptionShow] = useState(false);
  const handleOptionClose = () => setOptionShow(false);
  const [headerColor, setHeaderColor] = useState("");
  const [textColor, setTextColor] = useState("");
  const [editId, setEditId] = useState(0);
  const [editURL, setEditURL] = useState("");
  const [pageNumber, setPageNumber] = useState(0);
  const [pageLimit, setPageLimit] = useState(config.pageLimitOption1);
  const [venueSumamries, setVenueSummaries] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [settingData, setSettingData] = useState({});
  const [selectedFile, setSelectedFile] = useState();

  const venueService = new VenueService();
  const settingService = new SettingService();
  useEffect(() => {
    fetchVenuesSummaries() // Fetch venues data when component is mounted
    setIsLoaded(false);
    settingService.retrieveThresolds().then(result => {
      if (result) 
        setSettingData(result.data);
      setIsLoaded(true);
    }
  );
  }, [pageNumber, pageLimit])
  
  const fetchVenuesSummaries = () => {
    setIsLoaded(false);
    venueService.retrieveSummaryItems(pageNumber, config.pageUnlimitValue).then(result => {
      if (result)
        setVenueSummaries(result.data.items);
      setIsLoaded(true);
    });
    
  }

  const showDetail = (id) => {
    localStorage.setItem('selectedVenueId', id);
    var selectedVenue = venueSumamries.find((element) => {
      return element.id === id;
    })
    localStorage.setItem('selectedVenue', JSON.stringify(selectedVenue));
    history.push('/venueoverview');
  }
  
  const setOptions = (index) =>{
    venueService.getItem(index).then(result => {
      if (result){
      setHeaderColor(config.settingsVenueInit.headerColor);
      setTextColor(config.settingsVenueInit.textColor);
      setEditURL("");
      if (Object.prototype.hasOwnProperty.call(result.data, "settings")) {
        setHeaderColor(result.data.settings.headerColor);
        setTextColor(result.data.settings.textColor);
      }
      setEditId(index);     
      setEditURL(result.data.settings.logo);   
      setSelectedFile(null);
      setOptionShow(true);
    }
    });
  }

  const submitSettings = (formData) => {
    venueService.editItemSetting(editId, formData).then(result => {  
      if (result)
      fetchVenuesSummaries();
        setOptionShow(false);
      }
    );
  }

  const calcSettingValue = (value, key) => {
     if (settingData.indoor) {
      if (value >= settingData.indoor[key].great)
        return require("assets/img/element/settings/great.png").default
      else if (value >= settingData.indoor[key].good)
        return require("assets/img/element/settings/good.png").default
      else if (value >= settingData.indoor[key].acceptable)
        return require("assets/img/element/settings/acceptable.png").default
      else if (value >= settingData.indoor[key].poor)
        return require("assets/img/element/settings/poor.png").default
      else if (value >= settingData.indoor[key].verypoor)
        return require("assets/img/element/settings/verypoor.png").default
     }
     return require("assets/img/element/settings/good.png").default
  }

  const getStatus = (value) => {
    if (settingData.indoor) {
      if (value >= settingData.indoor.score.great)
        return t('status_great');
      else if (value >= settingData.indoor.score.good)
      return t('status_good');
      else if (value >= settingData.indoor.score.acceptable)
      return t('status_acceptable');
      else if (value >= settingData.indoor.score.poor)
      return t('status_poor');
      else if (value >= settingData.indoor.score.verypoor)
      return t('status_verypoor');
    }
    return "-";
  }

    return(
      <>
      {isLoaded==false? 
        <div className="text-center loading"> <img src={require("assets/img/loading.gif").default}/></div> 
        :         <div></div>}

      {venueSumamries.map((venueSummary) =>
          //  <Col key={venueSummary.id} xs={12} sm={12} md={6} lg={3} style={{"display":"flex", "justifyContent":"center"}}>
        <Card >
          <Card.Header>
            <span className="d-flex">
                <Card.Title as="h5" className="venue_text">
                  {venueSummary.name}
                </Card.Title>
                <span className="ml-auto justify-content-start">                   
                  <img className="imgBox admin-home-box-pencil-justify" src={require("assets/img/element/edit.png").default} onClick= {() => setOptions(venueSummary.id)} alt="..."/>                  
                </span>                             
            </span>               
            <hr></hr>
          </Card.Header>
          
          <Card.Body className="pt-0" onClick={() => showDetail(venueSummary.id)}>
              <div style={{"display": "flex", "marginBottom": "20px"}}>
              <img className="venue-img" src={venueSummary.summary && "score" in venueSummary.summary? calcSettingValue(venueSummary.summary.score, "score"): require("assets/img/element/grey.png").default} alt="..."/>     
                <div>
                  <div>{t('planetWatch_score')}</div>
                  <span className="quality">{venueSummary.summary && "score" in venueSummary.summary? venueSummary.summary.score: "-"}</span>
                  <span> | </span>
                  <span className="status"> {venueSummary.summary && "score" in venueSummary.summary? getStatus(venueSummary.summary.score): "-"}</span>
                </div>
              </div>
              
              <div className="d-flex justify-content-between mb-2">
                  <img className="status-img" src={venueSummary.summary && "temp" in venueSummary.summary? calcSettingValue(venueSummary.summary.temp, "temp"): require("assets/img/element/grey.png").default} alt="..."/>                  
                  <span className="text-venue-home">{t('temperature')} (°C)</span>
                  <span className="value">{venueSummary.summary && "temp" in venueSummary.summary? venueSummary.summary.temp.toFixed(2) : "-"}</span>
                  <img className="alert-img" src={require("assets/img/element/alert1.png").default} alt="..."/>                  
              </div>
              <div className="d-flex justify-content-between mb-2">
                  <img className="status-img" src={venueSummary.summary && "humidity" in venueSummary.summary? calcSettingValue(venueSummary.summary.humidity, "humidity"): require("assets/img/element/grey.png").default} alt="..."/>
                  <span className="text-venue-home">{t('humidity')} (%)</span>
                  <span className="value">{venueSummary.summary &&  "humidity" in venueSummary.summary? venueSummary.summary.humidity.toFixed(2) : "-"}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                  <img className="status-img" src={venueSummary.summary &&  "co2" in venueSummary.summary? calcSettingValue(venueSummary.summary.co2, "co2"): require("assets/img/element/grey.png").default} alt="..."/>
                  <span className="text-venue-home">CO<sub>2</sub> (ppm)</span>
                  <span className="value">{venueSummary.summary && "co2" in venueSummary.summary? venueSummary.summary.co2.toFixed(2) : "-"}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                  <img className="status-img" src={venueSummary.summary && "voc" in venueSummary.summary? calcSettingValue(venueSummary.summary.voc, "voc"): require("assets/img/element/grey.png").default} alt="..."/>
                  <span className="text-venue-home">TVOCs (ppb)</span>
                  <span className="value">{venueSummary.summary && "voc" in venueSummary.summary? venueSummary.summary.voc.toFixed(2) : "-"}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                  <img className="status-img" src={venueSummary.summary && "pm25" in venueSummary.summary? calcSettingValue(venueSummary.summary.pm25, "pm25"):
                  require("assets/img/element/grey.png").default} alt="..."/>
                  <span className="text-venue-home">P.M.25 (ug/m<sup>3</sup>)</span>
                  <span className="value">{venueSummary.summary && "pm25" in venueSummary.summary? venueSummary.summary.pm25.toFixed(2) : "-"}</span>
              </div>
              {/* <div className="d-flex justify-content-between mb-2">
                  <img className="status-img" src={venueSummary.summary && "light" in venueSummary.summary? require("assets/img/element/settings/acceptable.png").default: require("assets/img/element/grey.png").default} alt="..."/>
                  <span className="text-venue-home">{t('light')} (lx)</span>
                  <span className="value">{venueSummary.summary && "light" in venueSummary.summary? venueSummary.summary.light.toFixed(2) : "-"}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                  <img className="status-img" src={venueSummary.summary && "noise" in venueSummary.summary? require("assets/img/element/settings/good.png").default: require("assets/img/element/grey.png").default} alt="..."/>
                  <span className="text-venue-home">{t('noise')} (dB)</span>
                  <span className="value">{venueSummary.summary && "noise" in venueSummary.summary? venueSummary.summary.noise.toFixed(2) : "-"}</span>
              </div> */}
          </Card.Body>
        </Card>
    // </Col>
      )}
      <VenueSettingModal handleOptionClose={handleOptionClose} show_option={show_option} headerColor={headerColor} textColor={textColor} t={t} submitSettings={submitSettings} editURL={editURL} />
    </>
    );
}

function Home() {  
  return (
    <>
      <Container fluid>      
         <Row>
          <VenueStatus/>          
        </Row>
      </Container>
    </>
  );
}

export default Home;
