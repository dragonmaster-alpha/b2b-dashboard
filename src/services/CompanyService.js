import config from '../config';
import PromiseService from './PromiseService'

class CompanyService {
  
  constructor() {
    this.promiseService = new PromiseService();
  }

  getUser() {
    return JSON.parse(localStorage.getItem('user'));    
  }

  async retrieveItems(pageNumber, pageLimit) {
    return this.promiseService.authToken().then((res) => {
      const requestOptions = {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer '+ this.getUser().accessToken 
        }
      }
      const APIURL = config.apiUrl + '/companies?page=' + pageNumber + '&limit=' + pageLimit
      return this.promiseService.getServiceResult(APIURL, requestOptions)
      .then((res) => {
        return res
      })
    })
    
  }
 
  async createItem(newItem) {
    
    const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+ this.getUser().accessToken
        },
        body: JSON.stringify(newItem)
    };
    const APIURL = config.apiUrl + '/companies'
    return this.promiseService.getServiceResult(APIURL, requestOptions)
    .then((res) => {
      return res
    })
  }

  async editItem(newItem) {
    
    const requestOptions = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+ this.getUser().accessToken
        },
        body: JSON.stringify(newItem)
    };
    const APIURL = config.apiUrl + '/companies/' + newItem['id']
    return this.promiseService.getServiceResult(APIURL, requestOptions)
    .then((res) => {
      return res
    })
  }
}

export default CompanyService;