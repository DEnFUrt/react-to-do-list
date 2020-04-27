export default class CheckData {
  constructor(listKeyObj) {
    this.listKeyObj = listKeyObj;
  }

  _checkObj(obj) {
    let result = true;
    const listKeys = Object.keys(obj);

    this.listKeyObj.forEach(key => {
      if (!listKeys.includes(key)) {
        result = false;
      }
    });

    return result;
  }

  clearData(dirtyData) {
    return dirtyData.filter(item => {
      let result = false;

      if (typeof item === 'object' &&
        this._checkObj(item)) {
        result = true;
      }
      return result;
    });
  }
}