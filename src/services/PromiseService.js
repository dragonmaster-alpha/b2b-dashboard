import config from '../config';
import { history } from '../components/Auth/helpers';


class PromiseService {
  constructor() {

  }

  getUser() {
    return JSON.parse(localStorage.getItem('user'));    
  }

  async getServiceResult(APIURL, requestOptions) {
    let flag = false;
    var accessToken = "";
    return fetch(APIURL, requestOptions)
    .then((res) => {
        if (res.status == 401) {
          this.authToken().then((res) => {
            flag = true;
            accessToken = res;
          })
        }
        else 
          return res.json()
      })
      .then((result) => {
        if (result) 
          return result['success']? result: this.handleError(result)
        else  {
          if (flag) {
            var requestOptionsNew = requestOptions
            requestOptionsNew.headers = {'Authorization': 'Bearer '+ accessToken}
            // return this.getServiceResultByNewToken(APIURL, requestOptionsNew)
            return fetch(APIURL, requestOptionsNew)
            .then((res) => res.json())
              .then((result) => {
                if (result) 
                  return result['success']? result: this.handleError(result)
                else 
                  return null;})
              .catch((err) => alert(err))
          }
          else
            return null;
        }})
      .catch((err) => alert(err))
  }
  
  getServiceResultByNewToken(APIURL, requestOptions) {
    return fetch(APIURL, requestOptions)
    .then((res) => {
        if (res.status == 401) {
          // history.push("/login");
        }
        else 
          return res.json()
      })
      .then((result) => {
        if (result) 
          return result['success']? result: this.handleError(result)
        else 
          return null;})
      .catch((err) => alert(err))
  }

  async authToken() {
    var refreshToken = this.getUser().refreshToken;
    const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({refresh_token: refreshToken})
    };
    return fetch(config.apiUrl + '/auth/refresh', requestOptions)
        .then(res => {
          if (res.status == 401) {
            history.push('/login');
          }
          else 
            return res.json()
        })
        .then(result => {
          var user = this.getUser();
          if (result && result.data)  {
            if (result.data['access_token']){
              user['accessToken'] = result.data['access_token'];
              user['refreshToken'] = result.data['refresh_token'];
              localStorage.setItem('user', JSON.stringify(user));
              return result.data['access_token'];
            }
          }
        });
  }

  handleResponseError(response) {
    throw new Error("HTTP error, status = " + response.status);
  }
  handleError(result) {
    alert(result['errorMessage']);
  }
}

export default PromiseService;