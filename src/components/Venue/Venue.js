import React, { useState, useEffect } from "react";
import ReactPaginate from 'react-paginate';
// react-bootstrap components
import {Table, Container, Row, Col} from "react-bootstrap";

import { useTranslation } from 'react-i18next';
import config from '../../config'
import VenueRow from "./VenueRow"
import VenueModal from "./VenueModal"
import VenueSettingModal from "./VenueSettingModal"
import VenueService from "../../services/VenueService"
import CompanyService from "../../services/CompanyService"
import SensorService from "../../services/SensorService"

function Venue() {
  const {t, i18n} = useTranslation();
  const [show, setShow] = useState(false);
  const [show_option, setOptionShow] = useState(false);

  const handleOptionClose = () => setOptionShow(false);
  const [headerColor, setHeaderColor] = useState("");
  const [textColor, setTextColor] = useState("");
  const [editFlag, setEditFlag] = useState(false);
  const [coData, setCoData] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSensorLoaded, setIsSensorLoaded] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageLimit, setPageLimit] = useState(config.pageLimitOption1);
  const [total, setTotal] = useState(false);
  const [items, setItems] = useState([]);
  const [editId, setEditId] = useState(0);
  const [editURL, setEditURL] = useState("");
  const [companyItems, setCompanyItems] = useState([]);
  const [sensors, setSensors] = useState([]);
  const [selectedFile, setSelectedFile] = useState();
  const handleClose = () => setShow(false);

  const [tags, setTags] = useState([]);  
  const [errors, setErrors] = useState({});
  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);
  const venueService = new VenueService();
  const companyService = new CompanyService();
  const sensorService = new SensorService();

  const handleAdd = () => {
    setShow(true);
    setEditFlag(false);
  }

  const handleEdit = (index) => {
    setIsLoaded(false);
    venueService.getItem(index).then(result => {
        setIsLoaded(isSensorLoaded);
        var localTags = [];
        if (result) {
          setCoData(result.data);
          
          for (var k= 0; k< result.data.sensors.length; k++) {
              var sensor = sensors.filter(t=> t.id === result.data.sensors[k]["id"]);
              if (sensor.length>0)
                localTags.push(sensor[0].sensor_id);
          }
        }
        setTags(localTags);
        setShow(true);
        setEditFlag(true);
        forceUpdate();
      }
    );
  };

  useEffect(() => {
    fetchVenues() // Fetch venues data when component is mounted
  }, [pageLimit, pageNumber])

  useEffect(() => {
    fetchSensors();
    fetchCompanies();
  }, [])

  const fetchSensors = () => {
    setIsSensorLoaded(false);
    sensorService.retrieveItems().then(result => {
        if (result)
          setSensors(result.data); 
        setIsSensorLoaded(true); setIsLoaded(true);
      }
    );
  }

  const fetchCompanies = () => {
    setIsLoaded(false);
    companyService.retrieveItems(pageNumber, config.pageUnlimitValue).then(result => {
          if (result)
            setCompanyItems(result.data.items);
          setIsLoaded(true);
        }
    );
  }

  const fetchVenues = () => {
    setIsLoaded(false);
    venueService.retrieveItems(pageNumber, pageLimit).then(result => {
        if (result) {
          setTotal(result.data.total);
          setItems(result.data.items);}
          setIsLoaded(true);
        }
    );
  }

  const createVenue = (data) => {
    venueService.createItem(data).then(result => {  
      if (result)
        fetchVenues();
      handleClose();
    }
    );
  }

  const editVenue = (data) => {
    venueService.editItem(data).then(result => { 
      if (result)
        fetchVenues();
      handleClose();
    }
    );
  }

  const handlePageClick = (data) => {
    setPageNumber(data.selected);
  };

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

  const changeHandler = (name, value) => {
    if(name === 'tags') {
      setTags(value);
      if(value.length > 0 && errors.tags) {
        setErrors(prev => {
          const prevErrors = {...prev};
          delete prevErrors.tags;
          return prevErrors;
        });
      }
    }
  }

  const submitSettings = (formData) => {
    venueService.editItemSetting(editId, formData).then(result => {  
        fetchVenues();
        setOptionShow(false);
      }
    );
  }

  const setOptions = (index) =>{
    const data = items.find(item => item.id === index);
    setHeaderColor(config.settingsVenueInit.headerColor);
    setTextColor(config.settingsVenueInit.textColor);
    if (Object.prototype.hasOwnProperty.call(data, "settings")) {
      setHeaderColor(data.settings.headerColor);
      setTextColor(data.settings.textColor);
    }
    setEditId(index);

    setEditURL(data.settings.logo);
    setSelectedFile(null);
    setOptionShow(true);
  }


  return (
    <>
 {isLoaded==false? 
        <div className="text-center loading"> <img src={require("assets/img/loading.gif").default}/></div> 
        :         <div></div>}
        <div>
    <button className="button-field add_venue" onClick={handleAdd}><img className="venue_img" src={require("assets/img/element/venues.png").default} alt="..."/>{t('new_venue')}</button>

      <Container fluid>
        <Row>
          <Col md="8">
            <div>
              <Table className="venue_table">                  
                <thead>
                  <tr className="table_head">
                    <td className="venue_td">                        
                      <div style={{"display": "flex", "justifyContent":"space-between" }}>
                        <span>{t('venue_name')}</span>
                        <span className="nc-icon nc-stre-up"></span>
                      </div>                        
                      <input className="fullWidth form-field" type="text"/>                        
                    </td>
                    <td className="company_td">
                      <div style={{"display": "flex", "justifyContent":"space-between" }}>
                        <span>{t('company_name')}</span>
                        <span className="nc-icon nc-stre-up"></span>
                      </div>                        
                      <input className="fullWidth form-field" type="text"/>   
                    </td>
                    <td className="domain_td">
                      <div style={{"display": "flex", "justifyContent":"space-between" }}>
                        <span>{t('domain')}</span>
                        <span className="nc-icon nc-stre-up"></span>
                      </div>                        
                      <input className="fullWidth form-field" type="text"/>   
                    </td>
                    <td className="sensor_td">
                      <div style={{"display": "flex", "justifyContent":"space-between" }}>
                        <span>{t('sensor_count')}</span>
                        <span className="nc-icon nc-stre-up"></span>
                      </div>                        
                      <input className="fullWidth form-field" type="text"/>   
                    </td>                    
                    <td className="edit_title"></td>
                  </tr>
                </thead>
                <tbody>     
                  {items.map(item =>
                    <VenueRow key={item.id} item={item}  setOptions={setOptions} handleEdit={handleEdit}></VenueRow>
                  )}
                </tbody>
                <tfoot className="company_table_footer">
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
  </div> 
  
      
    <VenueModal forceUpdate={forceUpdate} tags={tags} errors={errors} changeHandler={changeHandler} show={show} editFlag={editFlag} t={t} parentMethod={handleClose} editVenue={editVenue} createVenue={createVenue} data={coData} companyItems={companyItems} sensors={sensors}/>

<VenueSettingModal handleOptionClose={handleOptionClose} show_option={show_option} headerColor={headerColor} textColor={textColor} t={t} submitSettings={submitSettings} editURL={editURL} />

    </>
  );
}

export default Venue;
