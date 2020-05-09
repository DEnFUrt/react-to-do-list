import React, {Component} from 'react';

import './app-header.css';

export default class AppHeader extends Component {

  constructor(props) {
    super(props);
    this.state = {
        userID : '',
        userName: ''
    }

    this.select = React.createRef();
    this.onValueChange = this.onValueChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(e) {
    e.preventDefault();
  }

  onValueChange(e) {
    const select = e.target;
  
    this.setState({
      userID : select.value,
      userName: select[select.selectedIndex].textContent
    }, () => this.props.onChangeUser(this.state.userID));
  }

  addSelectOptions(listUsers) {
    const select = this.select.current;
    while (select.options.length > 1) {
      select.options[select.options.length - 1].remove();
    }

    listUsers.forEach(element => {  
      const newOption = new Option(element.name, element.userID);
      select.append(newOption);
    });

  }

  componentDidUpdate(prevProps) {
    const {listUsers, userID : propsUserID} = this.props;
    if (listUsers !== prevProps.listUsers) {
      this.addSelectOptions(listUsers);

      const options = [...this.select.current.options];
      const name = options.filter(option => option.value === propsUserID)[0].textContent;

      this.setState(
        state => state.userID !== propsUserID ?
          {userID : propsUserID, userName: name} : null
      )
    }
  }

  render() {
    const {liked, allPosts, onUser} = this.props;
    const {userID, userName} = this.state;
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
                ref = {this.select}
                value = {userID}
                onChange = {this.onValueChange}
              >
                <option style = {{display: "none"}}></option>
              </select>
            </div>
            <div className = "col-auto my-1">  
              <button
                id = "btnAdd"
                type = "button"
                className = "btn btn-outline-secondary"
                onClick = {(e) => onUser({e})}
              >
                Добавить
              </button>
            </div>
            <div className = "col-auto my-1"> 
              <button
                id = "btnDel"
                type = "button"
                className = "btn btn-outline-secondary"
                onClick = {(e) => onUser({e, userName})}
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
