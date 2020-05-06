export default class FetchData {
  constructor(property) {
    this.userID = property.userID;
    this.type = property.type;
    this.patch = this._setPatch();
  }

  _setPatch() {
    let patch = '';
    switch (this.type) {
      case 'getUser':
          patch = 'https://api.jsonbin.io/b/5ea9ad6607d49135ba47c725/latest';
        break;
      case 'putUser':
          patch = 'https://api.jsonbin.io/b/5ea9ad6607d49135ba47c725';
        break;
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
      // return
    const response = await fetch(this.patch);
    return await response.json();
  }

  async putFetchData(data, flag) {
      // return
    let putData = {};
    switch (flag) {
      case 'user':
        putData = {users : data};
        break;
      case 'data':
        putData = {dirtyData : data};
        break;
      default:
        break;
    }

    const response = await fetch(this.patch, {
      method: 'PUT',
      body:  JSON.stringify(putData),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    });
    return await response.json();
  } 

  async delFetchData() {
    const response = await fetch(this.patch, {
      method: 'DELETE',
      headers: {
        "secret-key": "$2b$10$iojraRjHeoC7ojk.sT.pO.eK3HGAwvhoIC0SWZG5PxK24I471qAhC"
      }
    });
    return await response.json();
  }

  async postFetchData() {
    const response = await fetch(this.patch, {
        method: 'POST',
        body:  JSON.stringify({dirtyData : []}),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          "secret-key": "$2b$10$iojraRjHeoC7ojk.sT.pO.eK3HGAwvhoIC0SWZG5PxK24I471qAhC",
          "private": false
        }
      });
      return await response.json();
  }

  /* async getFetchData() {
    return
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
  } */


  /* async putFetchData(data, flag) {
    // return
    let result;
    let putData = {};
    switch (flag) {
      case 'user':
        putData = {users : data};
        break;
      case 'data':
        putData = {dirtyData : data};
        break;
      default:
        break;
    }
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
    } catch(error) {
      console.error('Ошибка отправки данных на сервер: ', error.message);
    }
    return result;
  }  */

  /* async delFetchData() {
    console.log('!!!!START DEL FETCH!!!!')
    console.log(this.patch);
    let result;
    try {
      let response = await fetch(this.patch, {
        method: 'DELETE',
        headers: {
          "secret-key": "$2b$10$iojraRjHeoC7ojk.sT.pO.eK3HGAwvhoIC0SWZG5PxK24I471qAhC"
        }
      });
      result = await response.json();
    } catch(error) {
      console.error('Ошибка удаления данных на сервере: ', error.message);
    }
    return result;
  }
 */

/*   async postFetchData() {
    console.log('!!!!START POST FETCH!!!!')
    console.log(this.patch);
    let result;
    try {
      let response = await fetch(this.patch, {
        method: 'POST',
        body:  JSON.stringify({dirtyData : []}),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          "secret-key": "$2b$10$iojraRjHeoC7ojk.sT.pO.eK3HGAwvhoIC0SWZG5PxK24I471qAhC",
          "private": false
        }
      });
      result = await response.json();
    } catch(error) {
      console.error('Ошибка создания базы данных на сервере: ', error.message);
    }
    return result;
  } */
}