import React, {Component} from 'react';

import './post-list-item.css';

export default class PostListItem extends Component {

  setClasses() {
    const {important, like, edit} = this.props;
    let classNames = 'app-list-item row justify-content-between';

    if (important) {
      classNames += ' important';
    }

    if (like) {
      classNames += ' like';
    }

    if (edit) {
      classNames += ' edit';
    }

    return classNames;
  }

  render() {
    const {label, dateStamp, onDelete, onEditLabel, onToggleImportant, onToggleLiked} = this.props;
        
    return (
      <div className = {this.setClasses()}>
        <span
          className = "col-1 app-list-item-label-custom"
        >
          {dateStamp}
        </span>
        <span 
          className = "col app-list-item-label"
          onClick = {onEditLabel}
        >
          {label}
          <i
            className = "fa fa-pencil"
          ></i>
        </span>
        <div className = "col-2 d-flex justify-content-center align-items-center"> 
          <button 
            type = "button"
            className = "btn-star btn-sm"
            onClick = {onToggleImportant}
          >
            <i className = "fa fa-star"></i>
          </button>
          <button
            type = "button"
            className = "btn-trash btn-sm"
            onClick = {onDelete}
          >
            <i className = "fa fa-trash-o"></i>
          </button>
          <i
            className = "fa fa-heart"
            onClick = {onToggleLiked}
          ></i>
        </div>
      </div>
    )
  }
}
