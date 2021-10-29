import config from '../config';
import PromiseService from './PromiseService'

class VenueService {

  constructor() {
    this.promiseService = new PromiseService();
  }

  getUser() {
    return JSON.parse(localStorage.getItem('user'));    
  }

  async getItem(index) {
    return this.promiseService.authToken().then((res) => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer '+ this.getUser().accessToken 
      }
    }
    const APIURL = config.apiUrl + '/venues/' + index
    return this.promiseService.getServiceResult(APIURL, requestOptions)
    .then((res) => {
      return res
    })
  });
  }

  async retrieveItems(pageNumber, pageLimit) {
    return this.promiseService.authToken().then((res) => {
      const requestOptions = {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer '+ this.getUser().accessToken 
        }
      }
      const APIURL = config.apiUrl + '/venues?page=' + pageNumber + '&limit=' + pageLimit
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

    const APIURL = config.apiUrl + '/venues'
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

    const APIURL = config.apiUrl + '/venues/' + newItem["id"]
    return this.promiseService.getServiceResult(APIURL, requestOptions)
    .then((res) => {
      return res
    })
  }

  async editItemSetting(index, formData) {
    return this.promiseService.authToken().then((res) => {
    const requestOptions = {
        method: 'PUT',
        body: formData
    };
    const APIURL = config.apiUrl + '/venues/' + index + "/settings"
    return this.promiseService.getServiceResult(APIURL, requestOptions)
    .then((res) => {
      return res
    })
  });
  }

  async retrieveSummaryItems(pageNumber, pageLimit) {
    return this.promiseService.authToken().then((res) => {
      const requestOptions = {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer '+ this.getUser().accessToken 
        }
      };
      const APIURL = config.apiUrl + '/venues/summary?page=' + pageNumber + '&limit=' + pageLimit
      return this.promiseService.getServiceResult(APIURL, requestOptions)
      .then((res) => {
        return res
      })
    });
  }

  async retrieveVenueSensors(venue_id, pageNumber, pageLimit) {
    return this.promiseService.authToken().then((res) => {
      const requestOptions = {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer '+ this.getUser().accessToken 
        }
      };
      const APIURL = config.apiUrl + '/venues/' + venue_id + '/sensors?page=' + pageNumber + '&limit=' + pageLimit
      return this.promiseService.getServiceResult(APIURL, requestOptions)
      .then((res) => {
        return res
      })
    });
  }

  async editFriendlyName(venueId, sensorId, newItem) {
    return this.promiseService.authToken().then((res) => {
      const requestOptions = {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+ this.getUser().accessToken
          },
          body: JSON.stringify(newItem)
      };
      const APIURL = config.apiUrl + '/venues/' + venueId + "/sensors/" + sensorId
      return this.promiseService.getServiceResult(APIURL, requestOptions)
      .then((res) => {
        return res
      })
    });
  }

}

export default VenueService;