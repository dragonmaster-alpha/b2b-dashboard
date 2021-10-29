import React, {useState, useEffect} from "react";
import Modal from "react-bootstrap/Modal";
import { SketchPicker } from 'react-color';
import '../../assets/scss/TagsInput.scss';

function VenueSettingModal(props) {
    const [backgroundColor, setBackgroundColor] = useState("#ffffff");
    const [headerColor, setHeaderColor] = useState("");
    const [textColor, setTextColor] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [editURL, setEditURL] = useState("");
    const [colorOption, setColorOption] = useState(0);
    const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);
    const fileChangeHandler = (event) => {
		setSelectedFile(event.target.files[0]);
        setEditURL("");
	};

    useEffect(() => {
        setHeaderColor(props.headerColor);
        setBackgroundColor(props.backgroundColor);
        setTextColor(props.textColor);
        setEditURL(props.editURL);
        forceUpdate();
      }, [props.headerColor, props.textColor, props.editURL])

    const handleChangeComplete = (color) => {
        setBackgroundColor(color.hex);
        if (colorOption == 0) {
          setHeaderColor(color.hex);
        }
        else {
          setTextColor(color.hex);
        }
    };

    const submitSettings = (e) => {
        let data = {headerColor:headerColor, textColor:textColor}
        let formData = new FormData();
        formData.append('data', JSON.stringify(data));
        if (selectedFile != null) {
            formData.append('logo', selectedFile);
        }
        props.submitSettings(formData);
    }

    return (
        <Modal show={props.show_option} onHide={props.handleOptionClose}>
            <Modal.Header className="modal_header" closeButton>
                <Modal.Title className="modal_title">{props.t('option')}</Modal.Title>
            </Modal.Header>
            <Modal.Body >
                <div style={{"display":"flex"}}>
                <div style={{"display":"flex", "flexDirection":"column"}}>
                    <div className="venue_div">
                    <div style={{"color": headerColor, "fontSize":"1.8rem", "fontWeight":"bold"}}>{props.t('header_color')}</div>
                    <input readOnly value={headerColor} onClick={()=> {setColorOption(0);setBackgroundColor(headerColor);}} className="form-field" type="text"/>
                    </div>
                    <div className="venue_div">          
                    <div style={{"color": textColor, "fontSize":"1.7rem", "fontFamily":"serif"}}>{props.t('text_color')}</div>            
                    <input value={textColor} onClick={()=> {setColorOption(1);setBackgroundColor(textColor);}} className="form-field" type="text"/>           
                    <div className="preColorBox" style={{"color": textColor}}> </div>
                    </div>
                    <div className="venue_div">
                    <div>{props.t('add_logo')}</div>
                    <div className="upload_div">
                        <input  className="upload_btn"  type="file" name="file" onChange={fileChangeHandler} readOnly/>
                        <img className="width-100px"  src={editURL==""? (selectedFile!=null? URL.createObjectURL(selectedFile):""): editURL}/>
                    </div>
                    </div>
                </div>
                <div className="color_panel">
                    <SketchPicker color={backgroundColor} onChangeComplete={ handleChangeComplete }/>
                </div>
                </div>
            </Modal.Body>
            <Modal.Footer className="modal_footer">       
                <div className="button-field user_add" onClick={submitSettings}>
                {props.t('update')}
                </div>
            </Modal.Footer>
        </Modal>
    )
}

export default VenueSettingModal;