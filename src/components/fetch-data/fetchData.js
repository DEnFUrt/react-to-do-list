//import CheckData from '../check-data';

export default class FetchData {
  constructor(property) {
    this.userID = property.userID;
    this.type = property.type;
    this.patch = this._setPatch();
  }

  _setPatch() {
    let patch = '';
    switch (this.type) {
      case 'getUserTest':
          patch = 'https://my-json-server.typicode.com/DEnFUrt/json-repo/users';
        break;
      case 'getDataTest':
          patch = 'https://my-json-server.typicode.com/DEnFUrt/json-repo/dirtyData';
        break;
      case 'getUser':
          patch = 'https://api.jsonbin.io/b/5ea583bc2940c704e1dee18d/latest';
        break;
      case 'putUser':
          patch = 'https://api.jsonbin.io/b/5ea583bc2940c704e1dee18d';
        break;
      // case 'delData':
      //     patch = `https://api.jsonbin.io/b/${this.userID}`;
      //   break;
      case 'getData':
          patch = `https://api.jsonbin.io/b/${this.userID}/latest`;
        break;
      case 'putData':
      case 'delData':
          patch = `https://api.jsonbin.io/b/${this.userID}`;
        break;
      case 'postData':
          patch = `https://api.jsonbin.io/b/`;
        break;
      default:
        break;
    }
    return patch;
  }

  async getFetchData() {
    //this._setPatch();
    console.log(this.patch);
    let result;
    try {
      console.log('!!!!START SELECT GET FETCH!!!!', this.patch)

      // let response = await fetch('https://api.jsonbin.io/b/5e95fa4f435f5604bb41556e/latest');
      let response = await fetch(this.patch);
      result = await response.json();
    } catch(error) {
      console.log(error.message);
    }
    return result;
  }

  async putFetchData(data) {
    return
    //this._setPatch();
    let result;
    const putData = {dirtyData : data};
    console.log('!!!!START PUT FETCH!!!!')
    try {
      //let response = await fetch('https://api.jsonbin.io/b/5e95fa4f435f5604bb41556e', {
        let response = await fetch(this.patch, {
        method: 'PUT',
        body:  JSON.stringify(putData),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      });
      result = await response.json();
      //console.log('Результат отправки данных на сервер: ', result);
    } catch(error) {
      console.error('Ошибка отправки данных на сервер: ', error.message);
    }
    return result;
  } 
}