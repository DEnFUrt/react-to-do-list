import React, {Component} from 'react';

import './post-status-filter.css';

export default class PostStatusFilter extends Component {
  constructor(props) {
    super(props);
    this.buttons = [
      {name : 'all', label : 'Все'},
      {name : 'like', label : 'Понравилось'},
    ]
  }

  setClassName(name) {
    const active = this.props.filter === name;
    return active ? 'btn btn-info' : 'btn btn-outline-secondary';
  }

  createButtons() {
    const btns = this.buttons.map(({name, label}) => {
      return (
        <button 
          key = {name}
          type = "button" 
          className = {this.setClassName(name)}
          onClick = {() => this.props.onFilterSelect(name)}
        >{label}</button>
      )
    });
    return btns;
  }

  render() {
    const buttons = this.createButtons();
    return (
      <div className="btn-group">
        {buttons}
      </div>
    )
  }
}
