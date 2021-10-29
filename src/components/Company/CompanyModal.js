import React, {useState, useEffect} from "react";
import Modal from "react-bootstrap/Modal";
import { useTranslation } from 'react-i18next';

function CompanyModal(props) {
    const [name, setName] = useState('')
    const [vat, setVat] = useState( '')
    const [street, setStreet] = useState( '')
    const [city, setCity] = useState( '')
    const [postalCode, setPostalCode] = useState( '')
    const [country, setCountry] = useState( '')
    const [phone, setPhone] = useState( '')
    const [mail, setMail] = useState( '')
    const [companyId, setCompanyId] = useState('')
    const [btnText, setBtnText] = useState('')

    useEffect(() => {
        if (props.editFlag){
            setBtnText("edit");
            setName(props.data?.name);
            setVat(props.data?.vat);
            setStreet(props.data?.street);
            setCity(props.data?.city);
            setPostalCode(props.data?.postalCode);
            setCountry(props.data?.country);
            setPhone(props.data?.phone);
            setMail(props.data?.mail);
            setCompanyId(props.data?.id);
        }
        else{
            setBtnText("add");
            emptyValues();
        }
    }, [props.data, props.editFlag]);

    const emptyValues = () => {
        setName("");
        setVat("");
        setStreet("");
        setCity("");
        setPostalCode("");
        setCountry("");
        setPhone("");
        setMail("");
        setCompanyId("");
    }

    const bindToParent = () => {
        if ((name =="") || (vat =="") || (street =="") || (city =="") || (postalCode =="") || (country =="") || (phone =="") || (mail =="")){
            alert("Input all fields");
            return;
        }
        let data = {"id":companyId, "name": name, "vat": vat, "street": street, "city": city, "postalCode": postalCode, "country": country, 
                    "phone": phone, "mail": mail}
        if (props.editFlag)
            props.editCompany(data);
        else{
            props.createCompany(data);
            setTimeout(function() { emptyValues(); }, 3000);
        }
    }

    return (
        <Modal show={props.show} onHide={props.parentMethod}>
        <Modal.Header className="modal_header" closeButton>
        <Modal.Title className="modal_title">{props.t('new_company')}</Modal.Title>
        </Modal.Header>
        <Modal.Body >
        <div className="venue_div" style={{"display":"flex", "justifyContent":"space-between"}}>
            <div>
            <div>{props.t('business_name')}</div>
            <input onChange={event => setName(event.target.value)}  className="width-280px form-field" type="text" value={name}/>             
            </div>
            <div>
            <div>{props.t('vat_number')}</div>
            <input onChange={event => setVat(event.target.value)} className="width-280px form-field" type="text" value={vat}/>              
            </div>                        
        </div>
        <div className="venue_div" style={{"display":"flex", "justifyContent":"space-between"}}>
            <div>
            <div>{props.t('street')}</div>
            <input onChange={event => setStreet(event.target.value)} className="width-200px form-field" type="text" value={street}/>             
            </div>
            <div>
            <div>{props.t('city')}</div>
            <input onChange={event => setCity(event.target.value)} className="width-80px form-field" type="text" value={city}/>              
            </div> 
            <div>
            <div>{props.t('post.code')}</div>
            <input onChange={event => setPostalCode(event.target.value)} className="width-80px form-field" type="text" value={postalCode}/>             
            </div>
            <div>
            <div>{props.t('country')}</div>
            <input onChange={event => setCountry(event.target.value)} className="width-80px form-field" type="text" value={country}/>              
            </div>                        
        </div>
        <div className="venue_div" style={{"display":"flex", "justifyContent":"space-between"}}>
            <div>
            <div>{props.t('phone')}</div>
            <input onChange={event => setPhone(event.target.value)} className="width-280px form-field" type="text" value={phone}/>             
            </div>
            <div>
            <div>{props.t('mail')}</div>
            <input onChange={event => setMail(event.target.value)} className="width-280px form-field" type="text" value={mail}/>              
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

export default CompanyModal;