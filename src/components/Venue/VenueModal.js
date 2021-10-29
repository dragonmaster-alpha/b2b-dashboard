import React, {useState, useEffect} from "react";
import Modal from "react-bootstrap/Modal";
import TagsInput from '../resources/TagsInput';
import '../../assets/scss/TagsInput.scss';

function VenueModal(props) {
    const [name, setName] = useState('')
    const [companyName, setCompanyName] = useState('')
    const [domain, setDomain] = useState( '')
    const [sensorIds, setSensorIds] = useState( '')
    const [venueId, setVenueId] = useState('')
    const [btnText, setBtnText] = useState('')
    const [companyShow, setCompanyShow] = useState(false)
    const [sensorShow, setSensorShow] = useState(false)
    const [companyId, setCompanyId] = useState(0);
    const [sensorsData, setSensorsData] = useState([]);
    const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);

    useEffect(() => {
        setSensorShow(false);
        if (props.editFlag){
            setBtnText("edit");
            setName(props.data?.name);
            if (props.data?.company != null) {
                setCompanyName(props.data?.company.name);
                setCompanyId(props.data?.company.id);
            }
            else {
                setCompanyId(0);    
                setCompanyName("");
            }
            setDomain(props.data?.domain);
            let sensorID = []           
            setSensorIds(sensorID);
            setVenueId(props.data?.id);
        }
        else{
            setBtnText("add");
            emptyValues();
        }
        setSensorsData(props.sensors);
        forceUpdate();
    }, [props.data, props.editFlag, props.tags, props.sensors]);

    const emptyValues = () => {
        setName("");
        setCompanyName(""); setSensorIds([]); setDomain("");

        setVenueId("");
        setCompanyId(0);
    }

    const bindToParent = () => {
        if ((name =="") || (domain =="")){
            alert("Input all fields");
            return;
        }
        let tags = props.tags;
        let tt = []
        for (var k = 0; k< tags.length; k++) {
            for (var kk = 0; kk< sensorsData.length; kk++) {
                if (sensorsData[kk]['sensor_id'] == tags[k]) {
                    tt.push(sensorsData[kk]['id']);
                }
            }
        }
        let data = {"id":venueId, "name": name, "companyId": companyId, "domain": domain, "sensorsIds":tt, "tags": props.tags}
        if (props.editFlag)
            props.editVenue(data);
        else{
            props.createVenue(data);
            setTimeout(function() { emptyValues(); }, 3000);
        }
    }

    const seletCompanyOption = (id, name) => {
        setCompanyShow(false);
        setCompanyName(name);
        setCompanyId(id);
    }

    const dropDownShow = () => {
        setCompanyShow(!companyShow);
    }

    const sensorDropDownShow = () => {
        setSensorShow(!sensorShow);
    }

    const addSensor = (id, sensor_id) => {
        let tags = props.tags;
        tags.push(sensor_id);
        props.changeHandler('tags', tags); 
        forceUpdate();
    }

    const tagsExist = (sensor_id) => {
        let tags = props.tags;
        let exist = false;
        for (var k =0; k< tags.length; k++)
            if (tags[k] == sensor_id)
                exist = true;
        
        return exist;
    }

    return (
        <Modal show={props.show} onHide={props.parentMethod}>
        <Modal.Header className="modal_header" closeButton>
          <Modal.Title className="modal_title">{props.t('new_venue')}</Modal.Title>
        </Modal.Header>
        <Modal.Body >
            <div className="venue_div">
                <div>{props.t('venue_name')}</div>
                <input onChange={event => setName(event.target.value)} value={name} className="width-590px form-field" type="text"/>
            </div>          
            <div className="venue_div position-relative">          
                <div>{props.t('company_name')}</div>            
                <input onClick={dropDownShow} value={companyName} className="width-554px form-field" type="text" readOnly/>
                <button className="arrow_button" onClick={dropDownShow}><span className="nc-icon nc-stre-down"></span></button>     

                <div className={companyShow ? 'handy-dropdown-box' : 'hidden'}>
                    {props.companyItems.map(item => 
                        <div key={item.id} className="handy-dropdown-item" onClick={() => seletCompanyOption(item.id, item.name)}> {item.name} </div>  
                    )}
                </div>
            </div>
            <div className="venue_div">
                <div>{props.t('domain')}</div>
                <input  onChange={event => setDomain(event.target.value)} value={domain} className="fullWidth form-field" placeholder="planetwatch.io" type="text"/>
            </div>
            <div className="venue_div position-relative">          
                <div>{props.t('sensors')}</div>
                <div style={{"display": "flex"}}>
                <TagsInput               
                    label="Tags"
                    id="tags"
                    name="tags"
                    placeholder="Add tag"
                    onChange={props.changeHandler}    
                    onClick={sensorDropDownShow}
                    error={props.errors.tags}
                    defaultTags={props.tags}
                />
                <button className="arrow_button" style={{"height":"auto"}}><span className="nc-icon nc-stre-down" onClick={sensorDropDownShow}></span></button>
                <div className={sensorShow ? 'sensor-dropdown-box' : 'hidden'}>
                    {sensorsData.map(item => 
                        <div key={item.id} className="sensor-dropdown-item" > {item.sensor_id} 
                            {tagsExist(item.sensor_id)? <div></div> :
                            <button className="arrow_button float-right" onClick={() => addSensor(item.id, item.sensor_id)}><span >+</span></button>}
                        </div>  
                    )}
                </div>
                </div>
            </div>          
        </Modal.Body>

        <Modal.Footer className="modal_footer"> 
        <div className="button-field user_add" onClick={bindToParent}>
            {props.t(btnText)}
        </div>
        </Modal.Footer>
    </Modal>
    )
}

export default VenueModal;