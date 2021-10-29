import React, { useState, useEffect } from "react";
import { Breakpoint } from 'react-socks';
import '../../assets/scss/overview.scss';
import { Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-daterangepicker/daterangepicker.css';
import { history } from '../Auth/helpers';
import {
    CircularProgressbar,
  } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import VenueService from "../../services/VenueService"
import Modal from "react-bootstrap/Modal";
import {Button} from "react-bootstrap";
import SensorService from "services/SensorService";
import SettingService from "services/SettingService";
import App from "./VenueApp"
import moment from 'moment';
import randomColor from "randomcolor";
import aq from '../../assets/img/element/lamp.png';
import aw from '../../assets/img/element/awair.png';
import wa from '../../assets/img/element/wiseair.png';
import ab from '../../assets/img/element/sensor.png';

function detail(){  
  history.push('/venueoverviewdetail');
}


const sideScroll = (element, speed, distance, step) => {
  let scrollAmount = 0;
  const slideTimer = setInterval(() => {
    element.scrollLeft += step;
    scrollAmount += Math.abs(step);
    if (scrollAmount >= distance) {
      clearInterval(slideTimer);
    }
  }, speed);
};  


export default function Venueview() {
  const { t, i18n } = useTranslation();
  const contentWrapper = React.useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [venueSummary, setVenueSummary] = useState({});
  const [sensors, setSensors] = useState([]);
  const [show, setShow] = useState(false);
  const [labels, setLabels] = useState(["score", "temp", "humidity", "co2", "voc",  "pm25"]);
  const [lastSensor, setLastSensor] = useState({});
  const [friendlyName, setFriendlyName] = useState("");
  const [selectedSensorId, setSelectedSensorId] = useState(0);
  const [selectedSensorIds, setSelectedSensorIds] = useState([]);
  const [selectedSensors, setSelectedSensors] = useState([]);
  const [unixStart, setUnixStart] = useState(0);
  const [unixEnd, setUnixEnd] = useState(0);
  const [unixStart2, setUnixStart2] = useState(0);
  const [unixEnd2, setUnixEnd2] = useState(0);
  const [initStartDate, setInitStartDate] = useState('2/20/2021');
  const [initEndDate, setInitEndDate] = useState('3/11/2021');
  const [sensorsData, setSensorsData] = useState([]);
  const [btnNumber, setBtnNumber] = useState(-1);
  const [oneDayFlag, setOneDayFlag] = useState(false);
  const [settingData, setSettingData] = useState({});
  const [classes, setClasses] = useState("sensor_group");
  const venueService = new VenueService();
  const sensorService = new SensorService();
  const settingService = new SettingService();

  useEffect(() => {    
    var unixStartDate = new Date(initStartDate).getTime() / 1000
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;
    setInitEndDate(today);
    var endTomorrowDate = moment(today, "MM/DD/YYYY").add(1, 'days');
    var unixEndDate = moment(endTomorrowDate, 'MM/DD/YYYY').unix()
  
    setUnixStart(unixStartDate);
    setUnixStart2(unixStartDate);
    setUnixEnd(unixEndDate);
    setUnixEnd2(unixEndDate);

    settingService.retrieveThresolds().then(result => {
        if (result) 
          setSettingData(result.data);
        setIsLoaded(true);
      }
    );
    fetchVenueSensors();
  }, [initEndDate])  

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

  const fetchVenueSensors = () => {
    var selectedVenueId = localStorage.getItem("selectedVenueId");
    setIsLoaded(false);
    var venue = JSON.parse(localStorage.getItem("selectedVenue"));
    setVenueSummary(venue);
    venueService.retrieveVenueSensors(selectedVenueId, 0, 10000).then(result => {
      if (result) {
        setSensors(result.data);
        if (result.data.length <= 8)
          setClasses("sensor_group height1");
        else if (result.data.length <= 12) 
          setClasses("sensor_group height2");
        else 
          setClasses("sensor_group");
      }
      setIsLoaded(true);
    });
  }

  const handleClose = () => {
    setShow(false);
  }

  const handleSensorEdit =  (id, friendlyName) => {
    setFriendlyName(friendlyName);
    setSelectedSensorId(id);
    setShow(true);
  }

  const handlePickerEvent = (event, picker) => {  
    
    if (selectedSensorId == 0) {
      alert("Click Sensors to retrive sensors data")
      return
    }
    var startDate = picker.startDate.format("YYYY.MM.DD");
    var endDate = picker.endDate.format("YYYY.MM.DD");

    if (startDate==endDate) 
      setOneDayFlag(true);
    else 
      setOneDayFlag(false);

    var endTomorrowDate = moment(endDate, "YYYY.MM.DD").add(1, 'days');

    var unixStartDate = moment(startDate, 'YYYY.MM.DD').unix()  
    var unixEndDate = moment(endTomorrowDate, 'YYYY.MM.DD').unix()

    setUnixStart(unixStartDate);
    setUnixEnd(unixEndDate);
    if (unixStart2 == 0) 
      setUnixStart2(unixStartDate);
    if (unixEnd2 == 0) 
      setUnixEnd2(unixEndDate);
    var queryParams = "?";
    labels.map(val => {
      queryParams += "val=" + val + "&";
    })
    var sensorIds = selectedSensorIds;
    sensorIds.map(val => {
      queryParams += "sen=" + val + "&";
    })
    queryParams += "start=" + unixStartDate + "&end=" + unixEndDate + "&start2=" + unixStart2 + "&end2=" + unixEnd2;

    if (btnNumber == 0) 
      queryParams += "&fun=benchmark";
    else if (btnNumber == 1)
      queryParams += "&fun=daily";
    else if (btnNumber == 2)
      queryParams += "&fun=combine";

    setIsLoaded(false);
    sensorService.retrieveSensorsData(queryParams).then(result => {
      if (result)
        setSensorsData(result.data);
      setIsLoaded(true);
    })
  }

  
  const handlePicker2Event = (event, picker) => {  
    
    if (selectedSensorId == 0) {
      alert("Click Sensors to retrive sensors data")
      return
    }
    var startDate = picker.startDate.format("YYYY.MM.DD");
    var endDate = picker.endDate.format("YYYY.MM.DD");

    if (startDate==endDate) 
      setOneDayFlag(true);
    else 
      setOneDayFlag(false);

    var endTomorrowDate = moment(endDate, "YYYY.MM.DD").add(1, 'days');

    var unixStartDate = moment(startDate, 'YYYY.MM.DD').unix()  
    var unixEndDate = moment(endTomorrowDate, 'YYYY.MM.DD').unix()

    setUnixStart2(unixStartDate);
    setUnixEnd2(unixEndDate);
    if (unixStart2 == 0) 
      setUnixStart(unixStartDate);
    if (unixEnd2 == 0) 
      setUnixEnd(unixEndDate);

    var queryParams = "?";
    labels.map(val => {
      queryParams += "val=" + val + "&";
    })
    var sensorIds = selectedSensorIds;
    sensorIds.map(val => {
      queryParams += "sen=" + val + "&";
    })
    queryParams += "start=" + unixStart + "&end=" + unixEnd + "&start2=" + unixStartDate + "&end2=" + unixEndDate;

    if (btnNumber == 0) 
      queryParams += "&fun=benchmark";
    else if (btnNumber == 1)
      queryParams += "&fun=daily";
    else if (btnNumber == 2)
      queryParams += "&fun=combine";

    setIsLoaded(false);
    sensorService.retrieveSensorsData(queryParams).then(result => {
      if (result)
        setSensorsData(result.data);
      setIsLoaded(true);
    })
  }

  const sensorClick = (id, name) => {
    var sensorIds = selectedSensorIds
    var flag = false;
    for (var k = 0; k< sensorIds.length; k++) {
      if (sensorIds[k] == id) {
        sensorIds.splice(k, 1);
        flag = true;
      }
    }
    if (!flag) {
      sensorIds.push(id);
    }
    setSelectedSensorIds(sensorIds);
    setSelectedSensorId(id);
    var selected = []
    sensorIds.map((sensorId) => {
      var filtered = sensors.filter(x=> x.id == sensorId);
      if (filtered.length >= 1)
        selected.push(filtered[0]);
    })
    
    if (sensorIds.length > 0)
       setLastSensor(sensors.filter(x => sensorIds[sensorIds.length-1] == x.id)[0]);
    flag = false;
    selected.map((item) => {
      if (btnNumber > 0) {
        item.borderColor = 'blue';
      }
      else {
        if (flag) {
          var ff = false;
          for (var k = 0; k< selectedSensors.length; k++) {
            if (selectedSensors[k].id == item.id) {
              if (selectedSensors[k].borderColor)
                if (item.borderColor != 'blue') {
                  item.borderColor = selectedSensors[k].borderColor;
                  ff = true;
                }
            }
          }
          if (!ff) 
            item.borderColor = randomColor();
        }
        else {
          item.borderColor = 'blue';
          flag = true;
        }
      }
    })

    setSelectedSensors(selected);
    var queryParams = "?";
    labels.map(val => {
      queryParams += "val=" + val + "&";
    })
    sensorIds.map(val => {
      queryParams += "sen=" + val + "&";
    })
    queryParams += "start=" + unixStart + "&end=" + unixEnd + "&start2=" + unixStart2 + "&end2=" + unixEnd2;
    if (btnNumber == 0) 
      queryParams += "&fun=benchmark";
    else if (btnNumber == 1)
      queryParams += "&fun=daily";
    else if (btnNumber == 2)
      queryParams += "&fun=combine";
    
    if (sensorIds.length == 0) {
      setSensorsData([]);
      return;
    }
    setIsLoaded(false);
    sensorService.retrieveSensorsData(queryParams).then(result => {
      if (result)
        setSensorsData(result.data);
      else {
        setSensorsData([]);
      }
      setIsLoaded(true);
    })
  }

  const save = () => {
    var selectedVenueId = localStorage.getItem("selectedVenueId");
    setIsLoaded(false);
    var newItem = {
      friendlyName: friendlyName
    }
    venueService.editFriendlyName(selectedVenueId, selectedSensorId, newItem).then(result => {
      setIsLoaded(true);
      setShow(false);
      if (result) 
        fetchVenueSensors();
    });
  }

  const clickBtn = (number) => {
    
    if (selectedSensorId == 0) {
      alert("Click Sensors to retrive sensors data")
      return
    }
    var isClickedSelf = false;
    if (btnNumber == number) {
      setBtnNumber(-1);
      isClickedSelf = true;
    }
    else {
      setBtnNumber(number);
    }

    var flag = false;
    let selected = selectedSensors;
    selected.map((item) => {
      if ((number > 0) && !isClickedSelf){
        item.borderColor = 'blue';
      }
      else {
        if (flag) {
          var ff = false;
          for (var k = 0; k< selectedSensors; k++) {
            if (selectedSensors[k].id == item.id) {
              if (selectedSensors[k].borderColor)
                if (item.borderColor != 'blue') {
                  item.borderColor = selectedSensors[k].borderColor;
                  ff = true;
                }
            }
          }
          if (!ff) 
            item.borderColor = randomColor();
        }
        else {
          item.borderColor = 'blue';
          flag = true;
        }
      }
    })
    setSelectedSensors(selected);

    var queryParams = "?";
    labels.map(val => {
      queryParams += "val=" + val + "&";
    })
    var sensorIds = selectedSensorIds;
    sensorIds.map(val => {
      queryParams += "sen=" + val + "&";
    })
    queryParams += "&start=" + unixStart + "&end=" + unixEnd + "&start2=" + unixStart2 + "&end2=" + unixEnd2;
    if (!isClickedSelf) {
      if (number == 0) 
        queryParams += "&fun=benchmark";
      else if (number == 1)
        queryParams += "&fun=daily";
      else if (number == 2)
        queryParams += "&fun=combine";
    }

    setIsLoaded(false);
    sensorService.retrieveSensorsData(queryParams).then(result => {
      if (result)
        setSensorsData(result.data);
      else {
        setSensorsData([]);
      }
      setIsLoaded(true);
    })
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

  const chartRenderer = () => {
    return (
      <div className="chart_div">
      <div className="chart">
      <span className="chart-label"> Score </span>
        <App labels={labels} labelIndex={0} oneDayFlag={oneDayFlag} selectedSensors={selectedSensors} sensorsData={sensorsData} settingData={settingData}/>
      </div>
      <div className="chart2">
      <span className="chart-label"> Temperature (°C) </span>
        <App labels={labels} labelIndex={1} oneDayFlag={oneDayFlag} selectedSensors={selectedSensors} sensorsData={sensorsData} settingData={settingData} />
      </div>
      <div className="chart">
      <span className="chart-label"> Humidity (%) </span>
        <App labels={labels} labelIndex={2} oneDayFlag={oneDayFlag} selectedSensors={selectedSensors} sensorsData={sensorsData} settingData={settingData} />
      </div>
      <div className="chart2">
      <span className="chart-label"> CO<sub>2</sub> (ppm) </span>
        <App labels={labels} labelIndex={3} oneDayFlag={oneDayFlag} selectedSensors={selectedSensors} sensorsData={sensorsData}  settingData={settingData}/>
      </div>
      <div className="chart">
      <span className="chart-label"> TVOCs (ppb) </span>
        <App labels={labels} labelIndex={4} oneDayFlag={oneDayFlag} selectedSensors={selectedSensors} sensorsData={sensorsData} settingData={settingData} />
      </div>
     <div className="chart2">
        <span className="chart-label"> P.M.25 (ug/m<sup>3</sup>) </span>
        <App labels={labels} labelIndex={5}  oneDayFlag={oneDayFlag} selectedSensors={selectedSensors} sensorsData={sensorsData}  settingData={settingData}/>
      </div>
     </div>
    )
  }

  return (
    <>
     {isLoaded==false? 
        <div className="text-center loading"> <img src={require("assets/img/loading.gif").default}/></div> 
        :         <div></div>}
    <div className="editFriendly">
    <Modal className="profile_modal" show={show} onHide={handleClose}>
          <Modal.Header className="modal_header" closeButton>
              <Modal.Title className="modal_title">{t('editFriendlyName')}</Modal.Title>
          </Modal.Header>
          <Modal.Body>            
            <div className="profile_div">            
                <div>{t('friendlyName')}</div>
                <div className="profile_row">                       
                    <input  onChange={event => setFriendlyName(event.target.value)} value={friendlyName} className="profile_input" type="text"/>
                </div>        
            </div>          
          </Modal.Body>
          <Modal.Footer className="modal_footer">                      
            <Button className="profile_save_btn margin-top-20px" onClick={save}>
            {t('save')}
            </Button>              
          </Modal.Footer>
      </Modal>
      </div>
      <Breakpoint large up>
        <div className="venue_content">
          <div className="sensor_view">
            <div className="venue_status">
              <Card className="state">
                <Card.Header>
                  <span className="d-flex">
                    <Card.Title as="h4" className="venue_name">
                      {lastSensor.name? lastSensor.name: "-"}
                    </Card.Title>
                  </span>
                  <hr></hr>
                </Card.Header>

                <Card.Body className="pt-0">
                  <div style={{ display: 'flex', marginBottom: '10px' }}>
                    <img
                      className="state_img"
                      src={lastSensor.summary && "score" in lastSensor.summary? calcSettingValue(lastSensor.summary.score, "score"): require("assets/img/element/grey.png").default} alt="..."/>  
                    <div style={{ marginTop: '-3px' }}>
                      <div className="label">{t('planetWatch_score')}</div>
                      <span className="index">{lastSensor.summary && "score" in lastSensor.summary? lastSensor.summary.score: "-"}</span>
                      <span> | </span>
                      <span className="condition">{lastSensor.summary && "score" in lastSensor.summary? getStatus(lastSensor.summary.score): "-"}</span>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between mb-2">
                    <img
                      className="status-img"
                      src={lastSensor.summary && "temp" in lastSensor.summary? calcSettingValue(lastSensor.summary.temp, "temp"): require("assets/img/element/grey.png").default} alt="..."/>             
                    <span className="text-venue-home">{t('temperature')} (°C)</span>
                    <span className="indexvalue">{lastSensor.summary && "temp" in lastSensor.summary?  lastSensor.summary.temp.toFixed(2) : "-"}</span>
                    <img
                      className="alert-img"
                      src={require('assets/img/element/alert1.png').default}
                      alt="..."
                    />
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <img
                      className="status-img"
                      src={lastSensor.summary && "humidity" in lastSensor.summary?  calcSettingValue(lastSensor.summary.humidity, "humidity"): require("assets/img/element/grey.png").default} alt="..."/>
                    <span className="text-venue-home">{t('humidity')} (%)</span>
                    <span className="indexvalue">{lastSensor.summary && "humidity" in lastSensor.summary? lastSensor.summary.humidity.toFixed(2) : "-"}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <img
                      className="status-img"
                      src={lastSensor.summary && "co2" in lastSensor.summary? calcSettingValue(lastSensor.summary.co2, "co2"): require("assets/img/element/grey.png").default} alt="..."/>
                    <span className="text-venue-home">
                      CO<sub>2</sub> (ppm)
                    </span>
                    <span className="indexvalue">{lastSensor.summary && "co2" in lastSensor.summary? lastSensor.summary.co2.toFixed(2) : "-"}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <img
                      className="status-img"
                      src={lastSensor.summary && "voc" in lastSensor.summary? calcSettingValue(lastSensor.summary.voc, "voc"): require("assets/img/element/grey.png").default} alt="..."/>
                    <span className="text-venue-home">TVOCs (ppb)</span>
                    <span className="indexvalue">{lastSensor.summary && "voc" in lastSensor.summary? lastSensor.summary.voc.toFixed(2) : "-"}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <img
                      className="status-img"
                      src={lastSensor.summary && "pm25" in lastSensor.summary? calcSettingValue(lastSensor.summary.pm25, "pm25"):
                      require("assets/img/element/grey.png").default} alt="..."/>
                    <span className="text-venue-home">
                      P.M.25 (ug/m<sup>3</sup>)
                    </span>
                    <span className="indexvalue">{lastSensor.summary && "pm25" in lastSensor.summary? lastSensor.summary.pm25.toFixed(2) : "-"}</span>
                  </div>
                </Card.Body>
              </Card>
            </div>
            <div className="sensorList_div">
              <button id="slideBack" className={sensors.length > 0? "left_btn":"display-none"} onClick={() => {sideScroll(contentWrapper.current, 10, 250, -10);}}>
                <span className="nc-icon nc-stre-left"></span>
              </button>
              <div  className={classes}>
              {sensors.map(sensor =>
                <div className={selectedSensorIds.includes(sensor.id)? "sensor_card sensor_card_border": "sensor_card"} onClick={() => sensorClick(sensor.id, sensor.name)}>
                  <div className="card_div">
                    <div className="part_top">
                      <img
                        className="lamp"
                        src={aw}
                        alt="..."
                      />
                      <span className="camera_name">{sensor.friendlyName}</span>
                      <img
                        onClick = {() => handleSensorEdit(sensor.id, sensor.friendlyName)}
                        className="sensor_edit"
                        src={require('assets/img/element/edit.png').default}
                        alt="..."
                      />
                    </div>
                    <div className="part_bottom">
                      <span className="camera_number">{sensor.name}: <bold>{sensor.summary? sensor.summary.in.score: 0}</bold></span>
                        <img
                          className="symbol"
                          src={sensor.summary ? calcSettingValue(sensor.summary.in.score, "score"): require("assets/img/element/grey.png").default} alt="..."/>   
                    </div>
                  </div>
                </div>
                  )}
                  </div>  
              <button id="slide" className={sensors.length > 0? "right_btn":"display-none"}  onClick={() => {sideScroll(contentWrapper.current, 10, 250, 10);}}>
                <span className="nc-icon nc-stre-right"></span>
              </button>
            </div>
          </div>

          <div className="timeline_div">
            <span className="timeline_title">{t('timeline')}</span>
            <div className="button_div">
              <div className="datepicker">
                <i className="far fa-calendar-alt"></i>
                <DateRangePicker
                  initialSettings={{
                    startDate: '2/20/2021',
                    endDate: {initEndDate}
                  }}
                  dateFormat="d MMM yyyy"
                  onApply={handlePickerEvent}
                >
                  <input type="text" className="form-control" />
                </DateRangePicker>
                <span className="datepicker-icon nc-icon nc-stre-down"></span>
              </div>

              <div className="button_area">
                <button onClick={() => clickBtn(0)} className={btnNumber==0? "button-field clicked":"button-field"}>{t('benchmark')}</button>
                <button onClick={() => clickBtn(1)} className={btnNumber==1? "button-field clicked":"button-field"}>30 {t('minutes')}</button>
                <button onClick={() => clickBtn(2)} className={btnNumber==2? "button-field clicked":"button-field"}>{t('combine')}</button>
                <span className="interval">{t('interval')} :</span>
                <span className="hour">2 hr</span>
              </div>
            </div>

            <div className={btnNumber==0? "":"display-none"} style={{"marginTop":"20px"}}>
            <span className="timeline_title">{t('timeline')}2</span>
              <div className="datepicker" style={{"width":"240px"}}>
                <i className="far fa-calendar-alt"></i>
                <DateRangePicker
                  initialSettings={{
                    startDate: '2/20/2021',
                    endDate: {initEndDate}
                  }}
                  dateFormat="d MMM yyyy"
                  onApply={handlePicker2Event}
                >
                  <input type="text" className="form-control" />
                </DateRangePicker>
                <span className="datepicker-icon nc-icon nc-stre-down"></span>
              </div>
              </div>
            <div className={selectedSensors.length > 10? "timeline_detail overflow-x-scroll": "timeline_detail" }>
              {selectedSensors.map((selectedSensor)=> 
                <span  style={{"borderColor":selectedSensor.borderColor}} className="borderLeft">{selectedSensor.name}</span>
                  )}
            </div>
          </div>

          {chartRenderer()}
        </div>
      </Breakpoint>
      <Breakpoint medium>
        <div className="main_content">
          <div className="venue_list">
          {sensors.map(sensor =>
            <Card className={sensor.id == selectedSensorId? "sensor_card sensor_card_border": "sensor_card"} onClick={() => sensorClick(sensor.id, sensor.name)}>
              <span className="sensor_name">{sensor.name}</span>
              <div className="main_area">
                <CircularProgressbar className="a1" value={72} text={72} />
                <div className="unit">
                    <img
                      className="status-img"
                      src={require('assets/img/element/settings/great.png').default}
                      alt="..."
                    />
                    <div className="temp">Temp</div>
                    <div className="number">{sensor.summary && sensor.summary.temp? sensor.summary.temp.toFixed(2): "-"}</div>
                    <div className="index">°C</div>
                </div>
                <div className="unit">
                    <img
                      className="status-img"
                      src={require('assets/img/element/settings/poor.png').default}
                      alt="..."
                    />
                    <div className="temp">{t('humidity')}</div>
                    <div className="number">{sensor.summary && sensor.summary.humidity? sensor.summary.humidity.toFixed(2): "-"}</div>
                    <div className="index">%</div>
                </div>
                <div className="unit">
                    <img
                      className="status-img"
                      src={require('assets/img/element/settings/acceptable.png').default}
                      alt="..."
                    />
                    <div className="temp">CO<sub>2</sub></div>
                    <div className="number">{sensor.summary && sensor.summary.co2? sensor.summary.co2.toFixed(2): "-"}</div>
                    <div className="index">ppm</div>
                </div>
                <div className="unit">
                    <img
                      className="status-img"
                      src={require('assets/img/element/settings/good.png').default}
                      alt="..."
                    />
                    <div className="temp">TVOCs</div>
                    <div className="number">{sensor.summary && sensor.summary.voc? sensor.summary.voc.toFixed(2): "-"}</div>
                    <div className="index">ppb</div>
                </div>
                <div className="unit">
                    <img
                      className="status-img"
                      src={require('assets/img/element/settings/acceptable.png').default}
                      alt="..."
                    />
                    <div className="temp">PM2.5</div>
                    <div className="number">{sensor.summary && sensor.summary.pm25? sensor.summary.pm25.toFixed(2): "-"}</div>
                    <div className="index">ug/m<sup>3</sup></div>
                </div>
              </div>
            </Card> )}
          </div>
        </div>  

        <div className="timeline_div">
            <span className="timeline_title">{t('timeline')}</span>
            <div className="button_div">
              <div className="datepicker">
                <i className="far fa-calendar-alt"></i>
                <DateRangePicker
                  initialSettings={{
                    startDate: '2/20/2021',
                    endDate: '3/11/2021'
                  }}
                  onApply={handlePickerEvent}
                >
                  <input type="text" className="form-control" />
                </DateRangePicker>
                <span className="datepicker-icon nc-icon nc-stre-down"></span>
              </div>
              <div className="button_area">
                <button onClick={() => clickBtn(0)} className={btnNumber==0? "button-field clicked":"button-field"}>{t('benchmark')}</button>
                <button onClick={() => clickBtn(1)} className={btnNumber==1? "button-field clicked":"button-field"}>30 {t('minutes')}</button>
                <button onClick={() => clickBtn(2)} className={btnNumber==2? "button-field clicked":"button-field"}>{t('combine')}</button>
                <span className="interval">{t('interval')} :</span>
                <span className="hour">2 hr</span>
              </div>
            </div>
            <div className={btnNumber==0? "":"display-none"} style={{"marginTop":"20px"}}>
            <span className="timeline_title">{t('timeline')}2</span>
              <div className="datepicker" style={{"width":"240px"}}>
                <i className="far fa-calendar-alt"></i>
                <DateRangePicker
                  initialSettings={{
                    startDate: '2/20/2021',
                    endDate: {initEndDate}
                  }}
                  dateFormat="d MMM yyyy"
                  onApply={handlePicker2Event}
                >
                  <input type="text" className="form-control" />
                </DateRangePicker>
                <span className="datepicker-icon nc-icon nc-stre-down"></span>
              </div>
              </div>
            <div className={selectedSensors.length > 5? "timeline_detail overflow-x-scroll": "timeline_detail"}>
              {selectedSensors.map((selectedSensor)=> 
                <span className="camera_span" style={{"borderColor":selectedSensor.borderColor}}>{selectedSensor.name}</span>
                  )}
            </div>
          </div>

         
          {chartRenderer()}
      </Breakpoint>
      <Breakpoint small down>
        <div className="main_content">
          <div className="venue_list">
          {sensors.map(sensor =>
            <Card className={sensor.id == selectedSensorId? "sensor_card sensor_card_border": "sensor_card"} onClick={() => sensorClick(sensor.id, sensor.name)}>
              <span className="sensor_name">{sensor.name}</span>
              <div className="main_area">
                <CircularProgressbar className="a1" value={72} text={72} />
                <div className="unit">
                    <img
                      className="status-img"
                      src={require('assets/img/element/settings/great.png').default}
                      alt="..."
                    />
                    <div className="temp">Temp</div>
                    <div className="number">{sensor.summary && sensor.summary.temp? sensor.summary.temp.toFixed(2): "-"}</div>
                    <div className="index">°C</div>
                </div>
                <div className="unit">
                    <img
                      className="status-img"
                      src={require('assets/img/element/settings/poor.png').default}
                      alt="..."
                    />
                    <div className="temp">{t('humidity')}</div>
                    <div className="number">{sensor.summary && sensor.summary.humidity? sensor.summary.humidity.toFixed(2): "-"}</div>
                    <div className="index">%</div>
                </div>
                <div className="unit">
                    <img
                      className="status-img"
                      src={require('assets/img/element/settings/acceptable.png').default}
                      alt="..."
                    />
                    <div className="temp">CO<sub>2</sub></div>
                    <div className="number">{sensor.summary && sensor.summary.co2? sensor.summary.co2.toFixed(2): "-"}</div>
                    <div className="index">ppm</div>
                </div>
                <div className="unit">
                    <img
                      className="status-img"
                      src={require('assets/img/element/settings/good.png').default}
                      alt="..."
                    />
                    <div className="temp">TVOCs</div>
                    <div className="number">{sensor.summary && sensor.summary.voc? sensor.summary.voc.toFixed(2): "-"}</div>
                    <div className="index">ppb</div>
                </div>
                <div className="unit">
                    <img
                      className="status-img"
                      src={require('assets/img/element/settings/acceptable.png').default}
                      alt="..."
                    />
                    <div className="temp">PM2.5</div>
                    <div className="number">{sensor.summary && sensor.summary.pm25? sensor.summary.pm25.toFixed(2): "-"}</div>
                    <div className="index">ug/m<sup>3</sup></div>
                </div>
              </div>
            </Card> )}
          </div>
        </div>
        
        <div className="timeline_div">
            <span className="timeline_title">{t('timeline')}</span>
            <div className="button_div">
              <div className="datepicker">
                <i className="far fa-calendar-alt"></i>
                <DateRangePicker
                  initialSettings={{
                    startDate: '2/20/2021',
                    endDate: '3/11/2021'
                  }}
                  onApply={handlePickerEvent}
                >
                  <input type="text" className="form-control" />
                </DateRangePicker>
                <span className="datepicker-icon nc-icon nc-stre-down"></span>
              </div>
              <div className="button_area">
                <button onClick={() => clickBtn(0)} className={btnNumber==0? "button-field clicked":"button-field"}>{t('benchmark')}</button>
                <button onClick={() => clickBtn(1)} className={btnNumber==1? "button-field clicked":"button-field"}>30 {t('minutes')}</button>
                <button onClick={() => clickBtn(2)} className={btnNumber==2? "button-field clicked":"button-field"}>{t('combine')}</button>
                <span className="interval">{t('interval')} :</span>
                <span className="hour">2 hr</span>
              </div>
            </div>
            <div className={btnNumber==0? "":"display-none"} style={{"marginTop":"20px"}}>
            <span className="timeline_title">{t('timeline')}2</span>
              <div className="datepicker" style={{"width":"240px"}}>
                <i className="far fa-calendar-alt"></i>
                <DateRangePicker
                  initialSettings={{
                    startDate: '2/20/2021',
                    endDate: {initEndDate}
                  }}
                  dateFormat="d MMM yyyy"
                  onApply={handlePicker2Event}
                >
                  <input type="text" className="form-control" />
                </DateRangePicker>
                <span className="datepicker-icon nc-icon nc-stre-down"></span>
              </div>
              </div>
            <div className={selectedSensors.length > 3? "timeline_detail overflow-x-scroll": "timeline_detail"}>
              {selectedSensors.map((selectedSensor)=> 
                <span className="camera_span" style={{"borderColor":selectedSensor.borderColor}}>{selectedSensor.name}</span>
                  )}
            </div>
          </div>

          {chartRenderer()}
      </Breakpoint>
    </>
  );
}
