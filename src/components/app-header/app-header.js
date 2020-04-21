import React, {Component} from 'react';
import './app-header.css';

export default class AppHeader extends Component {
  render() {
    const {liked, allPosts} = this.props;
    return (
      <div className="app-header d-flex">
        <h1>Денис Фуртаев</h1>
        <h2>Записей - {allPosts}, из них понравилось - {liked}</h2>
      </div>
    )
  }
}
