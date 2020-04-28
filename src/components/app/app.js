import React, {Component} from 'react';
import AppHeader from '../app-header';
import SearchPanel from '../search-panel';
import PostStatusFilter from '../post-status-filter';
import PostList from '../post-list';
import PostAddForm from '../post-add-form';
import Modal from '../modal';
import CheckData from '../check-data';
import FetchData from '../fetch-data';

import './app.css';

export default class App extends Component {
  listKeyObjData = ['label', 'important', 'like', 'dateStamp', 'edit'];
  listKeyObjUser = ['name', 'pass', /* 'userID' */];
  titleModal = {
    edit : 'Редактировать запись',
    add : 'Добавить запись',
  };
  tempLabel = '';
  tempId = '';

  constructor(props) {
    super(props);
    this.state = {
      userID : '',
      data : [],
      term : '',
      filter : 'all',
      isModal : false,
      listUsers : {},
    }

    this.deleteItem = this.deleteItem.bind(this);
    this.addItem = this.addItem.bind(this);
    this.onToggleImportant = this.onToggleImportant.bind(this);
    this.onToggleLiked = this.onToggleLiked.bind(this);
    this.onUpdateSearch = this.onUpdateSearch.bind(this);
    this.onFilterSelect = this.onFilterSelect.bind(this);
    this.editItem = this.editItem.bind(this);
    this.onToggleModal = this.onToggleModal.bind(this);
    this.onOpenModal = this.onOpenModal.bind(this);
    this.onChangeUser = this.onChangeUser.bind(this);
    this.onAddUser = this.onAddUser.bind(this);
    this.onDelUser = this.onDelUser.bind(this);
  }
  
  addId(cleanData) {
    cleanData.forEach(item => {
      if (item.id === undefined) {
        item.id = Date.now() + Math.random(0.5)
      }
    });
    return cleanData;
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

  /* async getFetchData(userID) { можно убрать когда все проверю
    try {
      // let response = await fetch('https://api.jsonbin.io/b/5e95fa4f435f5604bb41556e/latest');
      let response = await fetch('https://my-json-server.typicode.com/DEnFUrt/json-repo/dirtyData');
      let result = await response.json();
      console.log('dirtyData: ', result);
      console.log('!!!!START GET FETCH!!!!')
      // const cleanData = new CheckData(this.listKeyObj).clearData(result.dirtyData);
      const cleanData = new CheckData(this.listKeyObj).clearData(result);
      const fullData = this.addId(cleanData);
      console.log('fullData: ', fullData);
      this.setState(({data}) => ({data : fullData}));
    } catch(error) {
      console.log(error.message);
    }
  } */

  onGetUsers() {
    const getUsers = new FetchData({userID: '', type: 'getUserTest'});
    getUsers.getFetchData()
      .then(
        result => {
          const listUsers = new CheckData(this.listKeyObjUser).clearData(result);
          console.log('listUsers: ', listUsers);
          listUsers ? this.setState(state => state.listUsers = listUsers) : 
            alert('Ошибка обработки списка пользователей');
        })
      .catch(
        error => alert(`Ошибка получения списка пользователей - ${error.message}`)
      )
  }

  onGetData(userID) {
    const getData = new FetchData({userID, type: /* 'getData' */ 'getDataTest'});
    getData.getFetchData()
      .then(
        result => {
          const cleanData = new CheckData(this.listKeyObjData).clearData(result/* .dirtyData */);
          const fullData = this.addId(cleanData);
          console.log('fullData: ', fullData);
          this.setState(({data}) => ({data : fullData}));
        }
      )
      .catch(
        error => alert(`Ошибка получения данных - ${error.message}`)
      )
  }

  onPutData(userID, data) {
    const putData = new FetchData({userID, type: 'putData' /* 'getDataTest' */});
    putData.putFetchData(data)
      .then(
        result => {
          console.log('Результат отправки данных на сервер: ', result);
        }
      )
      .catch(
        error => alert(`Ошибка обновления данных - ${error.message}`)
      )
      .finally(
        () => this.onGetData(userID)
      )
  }

  onAddUser() {
    //Получить имя юзера через модальное окно
    //Создать под него пустутю date
    //Получить обратно id date
    //Создать запись в базе users 
    //Обновить список users
    //установить селект на нового юзера
    const newUser = prompt('Введите имя пользователя', '');
    if (newUser === null || newUser.length < 5) {
      return
    }
    console.log('newUser: ', newUser);


  }

  onDelUser() {
    
    //Получить id юзера из state +
    //Удалить запись из базы users +
    //Удалить data по id юзера
    //вернуть сообщение что юзер удален
    console.log('del')
    const {userID} = this.state;
    if (!userID) {
      return;
    }
    const delData = new FetchData({userID, type: /* 'delData' */ 'getDataTest'});
    delData.delFetchData()
      .then(
        result => {
          if (result.success) {
            console.log('Результат отправки данных на сервер: ', result);

          }
        }
      )
      .catch(
        error => alert(`Ошибка обновления данных - ${error.message}`)
      )
      .finally(
        () => this.onGetData(userID)
      )

  }

  /* async putFetchData(data) {
    return
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
  } */

  

  deleteItem(id) {
    const {data, userID} = this.state;
    const newData = data.filter(item => item.id !== id);
    
    this.onPutData(userID, newData);
  }

  addItem(value) {
    const newItem = {
      label : value,
      important : false,
      like : false,
      edit : false,
      id : Date.now() + Math.random(0.5),
      dateStamp : this.setDateStapm(),
    }
    const {data, userID} = this.state;
    const newData = [...data, newItem];
    
    this.onPutData(userID, newData);
  }
    
  editItem({id, value}) {
    this.onToggleModal(false);
    const {data, userID} = this.state;
    const index = data.findIndex(item => item.id === id);
    const oldItem = data[index];
    //const newLabel = prompt('Edit label', oldItem.label) || oldItem.label;
    const newLabel = value || oldItem.label;
    console.log('newLabel: ', newLabel);
        
    if (newLabel.trim().length > 4 && newLabel !== oldItem.label) {
      const newItem = {...oldItem, label: newLabel, edit: true};
      console.log('newItem: ', newItem);
      const newData = [...data.slice(0, index), newItem, ...data.slice(index + 1)];
      console.log('newData: ', newData);

      this.onPutData(userID, newData);
    }
  }

  onOpenModal(id) {
    const {data} = this.state;
    const oldItem = data.find(item => item.id === id);
    this.tempLabel = oldItem.label;
    this.tempId = id;
    console.log('oldLabel: ', this.tempLabel);
    this.onToggleModal(true);
  }

  onToggleModal(flag) {
    this.setState(
      ({isModal}) => isModal !== flag ? {isModal : flag} : null      
    )
  }

  onToggleImportant(id) {
    const {data, userID} = this.state;
    const newData = data.map(
      item => item.id === id ? {...item, important: !item.important} : item
      );
    
      this.onPutData(userID, newData);
    
    /* this.setState(({data}) => {
      return {
        data : data.map(
          item => item.id === id ? {...item, important: !item.important} : item
        )
      }
    }); */
  }

  /* Вариант с промежуточной переменной index(индекс элемента в стейте), промежуточными переменными 
  для изменения элемента в стейте и нового стейта.
  onToggleImportant(id) {
    this.setState(({data}) => {
      const index = data.findIndex(elem => elem.id === id);
      const oldItem = data[index];
      const newItem = {...oldItem, important: !oldItem.important};
      const newData = [...data.slice(0, index), newItem, ...data.slice(index + 1)];
      
      //this.putFetchData(newData);
    });
  } */

  onToggleLiked(id) {
    const {data, userID} = this.state;
    const newData = data.map(
      item => item.id === id ? {...item, like: !item.like} : item
    );

    this.onPutData(userID, newData);
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

  onChangeUser(userID) {
    this.setState(
      state => state.userID !== userID ? {userID} : null
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.userID !== prevState.userID) {
      console.log('Update State', this.state)
      this.onGetData(this.state.userID);
    } else {console.log('NULL')}
  }

  componentDidMount() {
    this.onGetUsers();
  }

  render() {
    const visiblePost = this.filterPost(this.searchPost(this.state), this.state);

    return ( 
      <div className = "app container-fluid">
        <AppHeader
          onChangeUser = {this.onChangeUser}
          onAddUser = {this.onAddUser}
          onDelUser = {this.onDelUser}
          listUsers = {this.state.listUsers}
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
            isTitle = {this.titleModal.edit}
            isValue = {this.tempLabel}
            isId = {this.tempId}
            onClose = {this.onToggleModal}
            onAction = {this.editItem}
          >
          </Modal>
        }
      </div>
    )
  }
}