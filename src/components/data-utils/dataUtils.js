export {addId, setDateStapm, ModalOptions};

function addId(cleanData) {
  cleanData.forEach(item => {
    if (item.id === undefined) {
      item.id = Date.now() + Math.random(0.5)
    }
  });
  return cleanData;
}

function setDateStapm() {
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


class ModalOptions {
  constructor(property) {
    this.modalTitle = property.modalTitle || null; //Заголовок модального окна
    this.cancelTitle = property.cancelTitle || 'Отмена'; //Заголовок кнопки закрытия/отмены действия модального окна
    this.actionTitle = property.actionTitle || 'Сохранить'; //Заголовок кнопки действия модального окна
    this.onClose = property.onClose || null; //Коллбэк закрытия модального окна
    this.onAction = property.onAction || null; //Коллбэк действия модального окна
    this.isValue = property.isValue || ''; //Строка передаваемая в input модального окна
    this.isId = property.isId || ''; //Служебный параметр для стейта модального окна
    this.isBody = property.isBody; //Видимость элемента body модального окна
    this.isFooter = property.isFooter; //Видимость элемента body модального окна
    this.inputReadOnly = property.inputReadOnly; //Запрет редактирования элемента Input модального окна
  }
}
