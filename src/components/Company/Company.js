import React, { useState, useEffect } from "react";
import ReactPaginate from 'react-paginate';

// react-bootstrap components
import {Table, Container, Row, Col} from "react-bootstrap";
import { useTranslation } from 'react-i18next';
import CompanyRow from "./CompanyRow"
import CompanyModal from "./CompanyModal"
import CompanyService from "../../services/CompanyService"
import config from '../../config'

function Company() {
  const {t, i18n} = useTranslation();
  const [show, setShow] = useState(false);
  const [editFlag, setEditFlag] = useState(false);
  const [coData, setCoData] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageLimit, setPageLimit] = useState(config.pageLimitOption1);
  const [total, setTotal] = useState(false);
  const [items, setItems] = useState([]);
  const handleClose = () => setShow(false);
  const companyService = new CompanyService();
  const handleAdd = () => {
    setShow(true);
    setEditFlag(false);
  }

  const handleEdit = (index) => {
    const data = items.find(item => item.id === index);
    setCoData(data)
    setShow(true);
    setEditFlag(true);
  };

  useEffect(() => {
    fetchCompanies() // Fetch companies data when component is mounted
  }, [pageLimit, pageNumber])

  const fetchCompanies = () => {
    setIsLoaded(false);
    companyService.retrieveItems(pageNumber, pageLimit).then(result => {
        if (result) {
          setTotal(result.data.total);
          setItems(result.data.items);
        }
          setIsLoaded(true);
        }
    );
  }

  const createCompany = (data) => {
    companyService.createItem(data).then(result => {  
      if (result)
        fetchCompanies();
        handleClose();
      }
    );
  }

  const editCompany = (data) => {
    companyService.editItem(data).then(result => {  
      if (result)
      fetchCompanies();
      handleClose();
      }
    );
  }

  const handlePageClick = (data) => {
    let selected = data.selected;
    setPageNumber(selected);
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

  return (
    <>
  
  {isLoaded==false? 
        <div className="text-center loading"> <img src={require("assets/img/loading.gif").default}/></div> 
        :         <div></div>}
        <div style={{"overflowY":"hidden"}}>

      <button className="button-field add_company" onClick={handleAdd}><img className="company_img" src={require("assets/img/element/companies.png").default} alt="..."/>{t('new_company')}</button>

      <Container fluid>
        <Row>
          <Col md="10">
              <Table className="company_table">                  
                <thead>
                  <tr className="table_head">
                    <td className="business_title">                        
                      <div style={{"display": "flex", "justifyContent":"space-between" }}>
                        <span>{t('business_name')}</span>
                        <span className="nc-icon nc-stre-up"></span>
                      </div>                        
                      <input className="width-200px form-field" type="text"/>                        
                    </td>
                    <td className="street_title">
                      <div style={{"display": "flex", "justifyContent":"space-between" }}>
                        <span>{t('street')}</span>
                        <span className="nc-icon nc-stre-up"></span>
                      </div>                        
                      <input className="width-200px form-field" type="text"/>   
                    </td>
                    <td className="post_title">
                      <div style={{"display": "flex", "justifyContent":"space-between" }}>
                        <span>{t('post.code')}</span>
                        <span className="nc-icon nc-stre-up"></span>
                      </div>                        
                      <input className="width-80px form-field" type="text"/>   
                    </td>
                    <td className="city_title">
                      <div style={{"display": "flex", "justifyContent":"space-between" }}>
                        <span>{t('city')}</span>
                        <span className="nc-icon nc-stre-up"></span>
                      </div>                        
                      <input className="width-80px form-field" type="text"/>   
                    </td>
                    <td className="country_title">
                      <div style={{"display": "flex", "justifyContent":"space-between" }}>
                        <span>{t('country')}</span>
                        <span className="nc-icon nc-stre-up"></span>
                      </div>                        
                      <input className="width-80px form-field" type="text"/>   
                    </td>
                    <td className="vat_title">
                      <div style={{"display": "flex", "justifyContent":"space-between" }}>
                        <span>{t('vat_number')}</span>
                        <span className="nc-icon nc-stre-up"></span>
                      </div>                        
                      <input className="width-150px form-field" type="text"/>   
                    </td>
                    <td className="phone_title">
                      <div style={{"display": "flex", "justifyContent":"space-between" }}>
                        <span>{t('phone')}</span>
                        <span className="nc-icon nc-stre-up"></span>
                      </div>                        
                      <input className="width-80px form-field" type="text"/>   
                    </td>
                    <td className="company_mail_title">
                      <div style={{"display": "flex", "justifyContent":"space-between" }}>
                        <span>{t('mail')}</span>
                        <span className="nc-icon nc-stre-up"></span>
                      </div>                        
                      <input className="width-150px form-field" type="text"/>   
                    </td>
                    <td className="edit_title"></td>
                  </tr>
                </thead>
                <tbody>                     
                  {items.map(item =>
                    <CompanyRow key={item.id} item={item} handleEdit={handleEdit}></CompanyRow>
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
                
          </Col>
        </Row>
          
      </Container>
      </div>

      
      <CompanyModal show={show} editFlag={editFlag} t={t} parentMethod={handleClose} editCompany={editCompany} createCompany={createCompany} data={coData}/>
    </>
  );
}

export default Company;
