import config from '../config';
import PromiseService from './PromiseService'

class SensorService {
  
  constructor() {
    this.promiseService = new PromiseService();
  }

  getUser() {
    return JSON.parse(localStorage.getItem('user'));    
  }

  async retrieveItems() {
    return this.promiseService.authToken().then((res) => {
      const requestOptions = {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer '+ this.getUser().accessToken 
        }
      }
      const APIURL = config.apiUrl + '/sensors'
      return this.promiseService.getServiceResult(APIURL, requestOptions)
      .then((res) => {
        return res
      })
    })
  }

  async retrieveSensorsData(queryParams) {
    return this.promiseService.authToken().then((res) => {
      const requestOptions = {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+ this.getUser().accessToken
          }
      };
      const APIURL = config.apiUrl + '/sensors/data' + queryParams
      return this.promiseService.getServiceResult(APIURL, requestOptions)
      .then((res) => {
        return res
      })
    });
  }

}

export default SensorService;