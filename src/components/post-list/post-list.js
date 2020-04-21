import React, {Component} from 'react';
import PostListItem from '../post-list-item';

import './post-list.css';

export default class PostList extends Component {
  
  createPostListItems() {
    const {posts, onDelete, onEditLabel, onToggleImportant, onToggleLiked} = this.props;
    const elements = posts.map(post => {
      const {id, ...postProps} = post;
      return (
        <li key = {id} className = "list-group-item">
          <PostListItem 
            {...postProps}
            onEditLabel = {() => onEditLabel(id)}
            onDelete = {() => onDelete(id)}
            onToggleImportant = {() => onToggleImportant(id)}
            onToggleLiked = {() => onToggleLiked(id)}
          />
        </li>
      )
    });
    return elements;
  }

  isLoaded() {
    return this.props.posts.length > 0;
  }

  render() {
    if (this.isLoaded()) {
    const elements = this.createPostListItems();
    return (
      <ul className="app-list list-group">
        {elements}
      </ul>
    )
    }
    return <h1>Записей не найдено...</h1>;
  }
}
