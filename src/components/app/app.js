import React, {Component} from 'react';
import AppHeader from '../app-header';
import SearchPanel from '../search-panel';
import PostStatusFilter from '../post-status-filter';
import PostList from '../post-list';
import PostAddForm from '../post-add-form';
import Modal from '../modal';
import CheckData from '../check-data';
import FetchData from '../fetch-data';
import {addId, setDateStapm, ModalOptions} from '../data-utils';
import Spinner from '../spinner';

import './app.css';

export default class App extends Component {
  listKeyObjData = ['label', 'important', 'like', 'dateStamp', 'edit'];
  listKeyObjUser = ['name', 'pass', 'userID'];
  modalOptions = {};

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

    this.spinner = React.createRef();
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
  
  /* Блок методов для учетных записей пользователей */

  onGetUsers() {
    this.spinner.current.onToggleShow();
    
    const getUsers = new FetchData({userID: '', type: 'getUser'});
  
    getUsers.getFetchData()
      .then(
        result => {
          const listUsers = new CheckData(this.listKeyObjUser).clearData(result.users);
          listUsers ? this.setState(
              state => state.listUsers = listUsers
            ) : 
            this.onAlertModal('Ошибка обработки списка пользователей');
        })
      .catch(
        error => this.onAlertModal(`Ошибка получения списка пользователей - ${error.message}`)
      )
      .finally(
        () => this.spinner.current.onToggleHide()
      )
  }
  
  onPutUsers(newListUsers, userID = '') {
    const putUsers = new FetchData({userID: '', type: 'putUser'});
    
    putUsers.putFetchData(newListUsers, 'user')
    .then(
      result => {
        if (result.success) {
          this.onChangeUser(userID);
        }
      }
    )
    .catch(
      error => this.onAlertModal(`Ошибка обновления данных - ${error.message}`)
    )
    .finally(
      () => this.onGetUsers()
    )
  }

  onAddUser({value}) {
    /* 
    Получить имя юзера через модальное окно +
    Создать под него пустую date +
    Получить обратно id date +
    Создать запись в базе users +
    Обновить список users +
    установить селект на нового юзера + 
    */

    this.onToggleModal(false);
    
    const newUser = value;
    
    if (newUser === null || newUser.length < 5) {
      return
    }
    
    this.spinner.current.onToggleShow();
    
    const {listUsers} = this.state;
    const addData = new FetchData({userID: '', type: 'postData'});
    
    addData.postFetchData()
    .then(
      result => {
        if (result.success) {
          const userID = result.id;
          const newItemUser = {
            name : newUser,
            pass : '123456',
            userID : userID,
          }
          const newListUsers = [...listUsers, newItemUser];
          
          this.onPutUsers(newListUsers, userID)
        }
      }
    )
    .catch(
      error => {
        this.spinner.current.onToggleHide()
        this.onAlertModal(`Ошибка добавления пользователя - ${error.message}`)
      }
    )
  }

  onDelUser() {
    /*
    Получить id юзера из state +
    Удалить запись из базы users +
    Удалить data по id юзера +
    вернуть сообщение в модальном окне что юзер удален +
    */

    this.onToggleModal(false);
    
    const {userID, listUsers} = this.state;
    
    if (!userID) {
      return;
    }
    
    this.spinner.current.onToggleShow();
    
    const delData = new FetchData({userID, type: 'delData'});
    
    delData.delFetchData()
      .then(
        result => {
          if (result.success) {
            const newListUsers = listUsers.filter(item => item.userID !== userID);
            this.onPutUsers(newListUsers);
            this.onGetData();
            this.onAlertModal('Пользователь удален!');
          }
        }
      )
      .catch(
        error => this.onAlertModal(`Ошибка удаления пользователя - ${error.message}`)
      )
      .finally(
        () => this.spinner.current.onToggleHide()
      )
  }

  /* Блок методов для работы с данными на сервере*/

  onGetData(userID) {
    if (!userID) {
      this.setState(({data}) => ({data : []}));
      return
    }
    
    this.spinner.current.onToggleShow();
    
    const getData = new FetchData({userID, type: 'getData'});
    
    getData.getFetchData()
      .then(
        result => {
          const cleanData = new CheckData(this.listKeyObjData).clearData(result.dirtyData);
          const fullData = addId(cleanData);
          this.setState(({data}) => ({data : fullData}));
        }
      )
      .catch(
        error => this.onAlertModal(`Ошибка получения данных - ${error.message}`)
      )
      .finally(
        () => this.spinner.current.onToggleHide()
      )
  }

  onPutData(userID, data) {
    this.spinner.current.onToggleShow();
    
    const putData = new FetchData({userID, type: 'putData'});
    
    putData.putFetchData(data, 'data')
      .then(
        result => {
          console.log('Результат отправки данных на сервер: ', result);
        }
      )
      .catch(
        error => this.onAlertModal(`Ошибка обновления данных - ${error.message}`)
      )
      .finally(
        () => this.onGetData(userID)
      )
  }

  /* Блок методов для удаления/добавления/редактирования записей */

  addItem(value) {
    const newItem = {
      label : value,
      important : false,
      like : false,
      edit : false,
      id : Date.now() + Math.random(0.5),
      dateStamp : setDateStapm(),
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
    const newLabel = value || oldItem.label;

    if (newLabel.trim().length > 4 && newLabel !== oldItem.label) {
      const newItem = {...oldItem, label: newLabel, edit: true};
      const newData = [...data.slice(0, index), newItem, ...data.slice(index + 1)];

      this.onPutData(userID, newData);
    }
  }

  deleteItem(id) {
    const {data, userID} = this.state;
    const newData = data.filter(item => item.id !== id);
    
    this.onPutData(userID, newData);
  }

  /* Блок модулей для управления состоянием записей */

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

  onToggleLiked(id) {
    const {data, userID} = this.state;
    const newData = data.map(
      item => item.id === id ? {...item, like: !item.like} : item
    );

    this.onPutData(userID, newData);
  }

  onUpdateSearch(term) {
    this.setState({term});
  }

  onFilterSelect(filter) {
    this.setState({filter});
  }

  onChangeUser(userID) {
    /*
    Изменить userID в state +
    Записать в localStorage активного пользователя + 
    */
    this.setState(
      state => state.userID !== userID ? {userID} : null,
      () => localStorage.setItem('userID', this.state.userID)
    );
    
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

  filterPost(items, {filter}) {
    switch (filter) {
      case 'like':
        return items.filter(item => item.like);

      default:
        return items;
    }
  }

  /* Блок методов для модального окна */

  onOpenModal({e, id, userName}) {
    const target = e.nativeEvent.target;
    
    if (target.tagName === 'SPAN') {
      const {data} = this.state;
      const oldItem = data.find(item => item.id === id);
    
      this.modalOptions = new ModalOptions({
        modalTitle: 'Редактировать запись',
        cancelTitle: 'Закрыть',
        actionTitle: 'Сохранить',
        isValue: oldItem.label,
        isId: id,
        onClose: this.onToggleModal,
        onAction: this.editItem,
        isBody: true,
        isFooter: true,
      });
    } 
    
    if (target.tagName === 'BUTTON' && target.id === 'btnAdd') {
      this.modalOptions = new ModalOptions({
        modalTitle: 'Добавить пользователя',
        cancelTitle: 'Закрыть',
        actionTitle: 'Добавить',
        onClose: this.onToggleModal,
        onAction: this.onAddUser,
        isBody: true,
        isFooter: true,
      });
    } else if (target.tagName === 'BUTTON' && target.id === 'btnDel') {
      this.modalOptions = new ModalOptions({
        modalTitle: 'Удалить пользователя',
        cancelTitle: 'Закрыть',
        actionTitle: 'Удалить',
        isValue: userName,
        onClose: this.onToggleModal,
        onAction: this.onDelUser,
        isBody: true,
        isFooter: true,
        inputReadOnly: true,
      });
    }

    this.onToggleModal(true);
  }

  onAlertModal(message) {
    this.modalOptions = new ModalOptions({
      modalTitle: message,
      onClose: this.onToggleModal,
    });
    
    this.onToggleModal(true);
  }

  onToggleModal(flag) {
    this.setState(
      ({isModal}) => isModal !== flag ? {isModal : flag} : null      
    )
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.userID !== prevState.userID) {
      this.onGetData(this.state.userID);
    }
  }

  componentDidMount() {
    /* 
    Получить список пользователей с сервера
    Получить сохраненного пользователя из localStorage
    Установить этого пользователя активным 
    */
    this.onGetUsers();

    const storUserID = localStorage.getItem('userID');

    if (storUserID) {
      this.onChangeUser(storUserID);
    } 
  }

  render() {
    const visiblePost = this.filterPost(this.searchPost(this.state), this.state);

    return ( 
      <div className = "app container-fluid">
        <AppHeader
          onChangeUser = {this.onChangeUser}
          onUser = {this.onOpenModal}
          listUsers = {this.state.listUsers}
          userID = {this.state.userID}
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
          onDelete = {this.deleteItem}
          onToggleImportant = {this.onToggleImportant}
          onToggleLiked = {this.onToggleLiked}
        />
        <PostAddForm
          onAdd = {this.addItem}
        />
        {this.state.isModal &&
          <Modal 
            propsModal = {this.modalOptions}
            isModal = {this.state.isModal}
          >
          </Modal>
        }
        {<Spinner ref = {this.spinner} />}
      </div>
    )
  }
}