import React from 'react';

import './post-add-form.css';
import { Component } from 'react';

export default class PostAddForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
    }

    this.onValueChange = this.onValueChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onValueChange(e) {
    this.setState({
      text : e.target.value
    });
  }

  onSubmit(e) {
    e.preventDefault();
    const {text} = this.state;
    if (text.trim().length < 5) {
      return
    }
    this.props.onAdd(text);
    this.setState({
      text : '',
    })
  }

  render() {
    return (
      <form 
        className = "bottom-panel d-flex"
        onSubmit = {this.onSubmit}
      >
        <input
          type = "text"
          placeholder = "Добавьте запись (мин. 5 символов)"
          className = "form-control new-post-label"
          onChange = {this.onValueChange}
          value = {this.state.text}
        />
        <button
          type = "submit"
          className = "btn btn-outline-secondary"
        >
          Добавить
        </button>
      </form>
    )
  }
}
