import React, {Component} from 'react';

import './search-panel.css';

export default class SearchPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      term : '',
    }
    this.onUpdateSearch = this.onUpdateSearch.bind(this);
    this.onClearSearch = this.onClearSearch.bind(this);
  }

  settedState(term) {
    this.setState({term});
    this.props.onUpdateSearch(term);
  }

  onUpdateSearch(e) {
    this.settedState(e.target.value);
  }

  onClearSearch() {
    this.settedState('');
  }

  render() {
    return (
      <div className = "input-group">
        <input
          className = "form-control search-input"
          type = "text"
          placeholder = "Поиск по записям"
          onChange = {this.onUpdateSearch}
          value = {this.state.term}
        />
        <div className = "input-group-append">
          <span 
            className = "input-group-text btn-custom"
            onClick = {this.onClearSearch}
          >Очистить</span>
        </div>
      </div>
    )
  }
}
