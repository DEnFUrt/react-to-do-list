import React, {Component} from 'react';

import './app-header.css';

export default class AppHeader extends Component {

  constructor(props) {
    super(props);
    this.state = {
      //value : '',
      userID : '',
    }

    this.onValueChange = this.onValueChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(e) {
    e.preventDefault();
  }

  onValueChange(e) {
    const select = e.target;

    this.setState({
      //value : select.value,
      userID : select[select.selectedIndex].value
    }, () => this.props.onChangeUser(this.state.userID));
  }

  addSelectOptions(listUsers) {
    const select =  document.getElementById('exampleSelect');
    while (select.options.length > 1) {
      select.options[select.options.length - 1].remove();
    }

    listUsers.forEach(element => {  
      const newOption = new Option(element.name, element.userID);
      select.append(newOption);
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.listUsers !== prevProps.listUsers) {
      this.addSelectOptions(this.props.listUsers);
      console.log('this.props.listUsers: ', this.props.listUsers);
    }
  }

  componentDidMount() {
    //this.onGetUsers();
    
  }

  render() {
    const {liked, allPosts, onAddUser, onDelUser} = this.props;
    //const {userID, value} = this.state;
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
                //value = {value}
                onChange = {this.onValueChange}
              >
                <option style = {{display: "none"}}></option>
              </select>
            </div>
            <div className = "col-auto my-1">  
              <button
                type = "button"
                className = "btn btn-outline-secondary"
                onClick = {() => onAddUser()}
              >
                Добавить
              </button>
            </div>
            <div className = "col-auto my-1"> 
              <button
                type = "button"
                className = "btn btn-outline-secondary"
                onClick = {() => onDelUser()}
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
