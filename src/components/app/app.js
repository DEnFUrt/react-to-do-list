import React, {Component} from 'react';
import AppHeader from '../app-header';
import SearchPanel from '../search-panel';
import PostStatusFilter from '../post-status-filter';
import PostList from '../post-list';
import PostAddForm from '../post-add-form';
import Modal from '../modal';

import './app.css';

export default class App extends Component {
  listKeyObj = ['label', 'important', 'like', 'dateStamp'];
  tempLabel = '';
  tempId = '';

  constructor(props) {
    super(props);
    this.state = {
      data : [],
      term : '',
      filter : 'all',
      isModal : false,
      titleModal : 'Редактировать запись',
    }

    this.deleteItem = this.deleteItem.bind(this);
    this.addItem = this.addItem.bind(this);
    this.onToggleImportant = this.onToggleImportant.bind(this);
    this.onToggleLiked = this.onToggleLiked.bind(this);
    this.onUpdateSearch = this.onUpdateSearch.bind(this);
    this.onFilterSelect = this.onFilterSelect.bind(this);
    this.editItem = this.editItem.bind(this);
    this.onCloseModal = this.onCloseModal.bind(this);
    this.onOpenModal = this.onOpenModal.bind(this);
  }
  
  checkObj(obj) {
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
    const cleanData = dirtyData.filter(item => {
      let result = false;

      if (typeof item === 'object' &&
        this.checkObj(item)) {
        result = true;
      }
      return result;
    });

    cleanData.forEach(item => {
      if (item.id === undefined) {
        item.id = Date.now() + Math.random(0.5)
      }
    });

    this.setState(({data}) => ({data : cleanData}));
  }
  
  setDateStapm() {
    const addZero = tempDate => {
      switch(true) {
        case tempDate < 0 :
            return '00';
        case tempDate <= 9 :
            return `0${tempDate.toString()}`;
        default :
            return tempDate.toString();
      }
    }

    const dateStamp = new Date();
    return `${addZero(dateStamp.getDate())}.${addZero(dateStamp.getMonth() + 1)}.${dateStamp.getFullYear()} ${addZero(dateStamp.getHours())}:${addZero(dateStamp.getMinutes())}`;
  }

  async getFetchData() {
    try {
      //let response = await fetch('https://api.jsonbin.io/b/5e95fa4f435f5604bb41556e/latest');
      let response = await fetch('https://my-json-server.typicode.com/DEnFUrt/json-repo/dirtyData');
      let result = await response.json();
      console.log('dirtyData: ', result);
      console.log('!!!!START GET FETCH!!!!')
      // this.clearData(result.dirtyData);
      this.clearData(result);
    } catch(error) {
      console.log(error.message);
    }
  }

  async putFetchData(data) {
    const putData = {dirtyData : data};
    console.log('!!!!START PUT FETCH!!!!')
    try {
      let response = await fetch('https://api.jsonbin.io/b/5e95fa4f435f5604bb41556e', {
        method: 'PUT',
        body:  JSON.stringify(putData),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      });
      let result = await response.json();
      console.log('Результат отправки данных на сервер: ', result);
    } catch(error) {
      console.error('Ошибка отправки данных на сервер: ', error.message);
    }
    finally {
      this.getFetchData();
    }
  }

  /* Вариант с промежуточной переменной index (индекс элемента в стейте)
  deleteItem(id) {
    this.setState(({data}) => {
      const index = data.findIndex(elem => elem.id === id);
      const newData = [...data.slice(0, index), ...data.slice(index + 1)];
      return {data : newData}
    });
  } */

  deleteItem(id) {
    const {data} = this.state;
    const newData = data.filter(item => item.id !== id);
    this.putFetchData(newData);
  }

  addItem(value) {
    const newItem = {
      label : value,
      important : false,
      like : false,
      id : Date.now() + Math.random(0.5),
      dateStamp : this.setDateStapm(),
    }
    const {data} = this.state;
    const newData = [...data, newItem];
    //this.putFetchData(newData);
  }
    
/* Вариант с промежуточной переменной 
  addItem(value) {
    const newItem = {
      label : value,
      important : false,
      like : false,
      id : Date.now() + Math.random(0.5), 
    }
  this.setState(({data}) => {
      const newData = [...data, newItem];
      
      return {data : newData}
    });
  }
 */

  editItem({id, value}) {
    this.onCloseModal();
    const {data} = this.state;
    const index = data.findIndex(item => item.id === id);
    const oldItem = data[index];
    //const newLabel = prompt('Edit label', oldItem.label) || oldItem.label;
    const newLabel = value || oldItem.label;
    console.log('newLabel: ', newLabel);
    if (newLabel.trim().length > 4 && newLabel !== oldItem.label) {
      const newItem = {...oldItem, label: newLabel};
      console.log('newItem: ', newItem);
      const newData = [...data.slice(0, index), newItem, ...data.slice(index + 1)];
      console.log('newData: ', newData);

      //this.putFetchData(newData);
    }
  }

/* Вариант с промежуточной переменной index(индекс элемента в стейте), промежуточными переменными 
  для изменения элемента в стейте и нового стейта.
  onToggleImportant(id) {
    this.setState(({data}) => {
      const index = data.findIndex(elem => elem.id === id);
      const oldItem = data[index];
      const newItem = {...oldItem, important: !oldItem.important};
      const newData = [...data.slice(0, index), newItem, ...data.slice(index + 1)];
      
      return {data: newData}
    });
  } */

  onOpenModal(id) {
    const {data} = this.state;
    const oldItem = data.find(item => item.id === id);
    this.tempLabel = oldItem.label;
    this.tempId = id;
    console.log('oldLabel: ', this.tempLabel);
    this.setState(({isModal}) => {
      if (!isModal) {
        return {isModal : true}
      }
    })
  }

  onCloseModal() {
    this.setState(({isModal}) => {
      if (isModal) {
        return {isModal : false}
      }
    })
  }

  onToggleImportant(id) {
    const {data} = this.state;
    const newData = data.map(
      item => item.id === id ? {...item, important: !item.important} : item
      );
    
    //this.putFetchData(newData);
    /* this.setState(({data}) => {
      return {
        data : data.map(
          item => item.id === id ? {...item, important: !item.important} : item
        )
      }
    }); */
  }

  onToggleLiked(id) {
  const {data} = this.state;
  const newData = data.map(
    item => item.id === id ? {...item, like: !item.like} : item
  );

  //this.putFetchData(newData);
    /* this.setState(({data}) => {
      return {
        data : data.map(
          item => item.id === id ? {...item, like: !item.like} : item
        )
      }
    }); */
  }

  countLiked({data}) {
    return data.filter(item => item.like).length;
  }

  countPosts({data}) {
    return data.length;
  }

  searchPost({data : items, term}) {
    if (term.trim().length === 0) {
      return items;
    }

    return items.filter(item => item.label.toUpperCase().includes(term.toUpperCase()));
  }

  onUpdateSearch(term) {
    this.setState({term});
  }

  filterPost(items, {filter}) {
    switch (filter) {
      case 'like':
        return items.filter(item => item.like);

      default:
        return items;
    }
  }

  onFilterSelect(filter) {
    this.setState({filter});
  }

  componentDidMount() {
    this.getFetchData();
  }

  render() {
    const visiblePost = this.filterPost(this.searchPost(this.state), this.state);

    return ( 
      <div className = "app container-fluid">
        <AppHeader 
          liked = {this.countLiked(this.state)}
          allPosts = {this.countPosts(this.state)}
        />
        <div className = "search-panel d-flex">
          <SearchPanel 
            onUpdateSearch = {this.onUpdateSearch}
          />
          <PostStatusFilter
            filter = {this.state.filter}
            onFilterSelect = {this.onFilterSelect}
          />
        </div>
        <PostList
          posts = {visiblePost}
          onEditLabel = {this.onOpenModal}
          //onEditLabel = {this.editItem}
          onDelete = {this.deleteItem}
          onToggleImportant = {this.onToggleImportant}
          onToggleLiked = {this.onToggleLiked}
        />
        <PostAddForm
          onAdd = {this.addItem}
        />
        {this.state.isModal &&
          <Modal 
            isModal = {this.state.isModal}
            isTitle = {this.state.titleModal}
            isValue = {this.tempLabel}
            isId = {this.tempId}
            onClose = {this.onCloseModal}
            onAction = {this.editItem}
          >
          </Modal>
        }
      </div>
    )
  }
}