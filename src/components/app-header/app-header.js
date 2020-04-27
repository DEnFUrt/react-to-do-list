import React, {Component} from 'react';
import CheckData from '../check-data';
import FetchData from '../fetch-data';

import './app-header.css';

export default class AppHeader extends Component {
  listKeyObj = ['name', 'pass', /* 'userID' */];

  constructor(props) {
    super(props);
    this.state = {
      value : '',
      userID : '',
    }

    this.onValueChange = this.onValueChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(e) {
    e.preventDefault();
    console.log(this.state.value)
  }

  onValueChange(e) {
    const select = e.target;

    this.setState({
      value : select.value,
      userID : select[select.selectedIndex].value
    }, () => this.props.onChangeUser(this.state.userID));
  }

  addSelectOptions(listUsers) {
    const select =  document.getElementById('exampleSelect');

    listUsers.forEach(element => {  
      const newOption = new Option(element.name, element.userID);
      select.append(newOption);
    });
  }

  onGetUsers() {
    const getUsers = new FetchData({userID: '', type: 'getUserTest'});
    getUsers.getFetchData()
      .then(
        result => {
          const listUsers = new CheckData(this.listKeyObj).clearData(result);
          console.log('listUsers: ', listUsers);
          listUsers ? this.addSelectOptions(listUsers) : 
            alert('Ошибка обработки списка пользователей');
        })
      .catch(
        error => alert(`Ошибка получения списка пользователей - ${error.message}`)
      )
  }

  componentDidMount() {
    this.onGetUsers();
  }

  render() {
    const {liked, allPosts} = this.props;
    return (
      <div className = "app-header d-flex">
        <form
          onSubmit = {this.onSubmit}
        >      
          <label className = "mr-sm-2 lead">Выберите пользователя</label>
          <div className = "form-row align-items-center">  
            <div className = "col-auto my-1">
              <select
                className = "custom-select mr-sm-2" 
                id = "exampleSelect"
              value = {this.state.value}
                onChange = {this.onValueChange}
              >
                <option style = {{display: "none"}}></option>
              </select>
            </div>
            <div className = "col-auto my-1">  
              <button
                type = "submit"
                className = "btn btn-outline-secondary"
              >
                Добавить
              </button>
            </div>
            <div className = "col-auto my-1"> 
              <button
                type = "button"
                className = "btn btn-outline-secondary"
              >
                Удалить
              </button>
            </div>
          </div>  
        </form>
        <h2>Записей - {allPosts}, из них понравилось - {liked}</h2>
      </div>
    )
  }
}
