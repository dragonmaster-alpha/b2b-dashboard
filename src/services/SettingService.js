import config from '../config';
import PromiseService from './PromiseService'

class SettingService {
  constructor() {
    this.promiseService = new PromiseService();
  }

  getUser() {
    return JSON.parse(localStorage.getItem('user'));    
  }

  async retrieveThresolds() {
    return this.promiseService.authToken().then((res) => {
      const requestOptions = {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer '+ this.getUser().accessToken 
        }
      }
      const APIURL = config.apiUrl + '/settings/thresholds'
      return this.promiseService.getServiceResult(APIURL, requestOptions)
      .then((res) => {
        return res
      })
    });
  }

  async saveThresolds(newItem) {
    
    const requestOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+ this.getUser().accessToken
      },
      body: JSON.stringify(newItem)
    };
    const APIURL = config.apiUrl + '/settings/thresholds'
    return this.promiseService.getServiceResult(APIURL, requestOptions)
    .then((res) => {
      return res
    })
  }
}

export default SettingService;