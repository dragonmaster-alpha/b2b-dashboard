import config from '../config';
import PromiseService from './PromiseService'

class UserService {

  constructor() {
    this.promiseService = new PromiseService();
  }

  getUser() {
    return JSON.parse(localStorage.getItem('user'));    
  }

  async retrieveItems(pageNumber, pageLimit) {
    return this.promiseService.authToken().then((res) => {
      var requestOptions = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+ this.getUser().accessToken
        }
      }
      return this.promiseService.getServiceResult(config.apiUrl + '/users?page=' + pageNumber + '&limit=' + pageLimit,
          requestOptions)
        .then((res) => {
          return res
        })
    });
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
    return this.promiseService.getServiceResult(config.apiUrl + '/users', requestOptions)
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

    return this.promiseService.getServiceResult(config.apiUrl + '/users/' + newItem["id"] + "/permissions", requestOptions)
      .then((res) => {
        return res
      })
  }
  
  async getProfile() {
    
    const requestOptions = {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer '+ this.getUser().accessToken 
      }
    }
    return this.promiseService.getServiceResult(config.apiUrl + '/users/me', requestOptions)
      .then((res) => {
        return res
      })
  }

  async editProfile(newItem) {
    
    const requestOptions = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+ this.getUser().accessToken
        },
        body: JSON.stringify(newItem)
    };
    return this.promiseService.getServiceResult(config.apiUrl + '/users/me', requestOptions)
      .then((res) => {
        return res
      })
  }
}

export default UserService;