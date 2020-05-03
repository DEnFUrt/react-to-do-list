import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import './modal.css';

export default class Modal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value : '',
      id : ''
    }
    
    this.elemModal = document.createElement('div');
    
    this.onValueChange = this.onValueChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(e) {
    e.preventDefault();
    const {onAction} = this.props.propsModal;
    
    onAction(this.state);
  }

  createModal() {
    const {isModal} = this.props;
    const {modalTitle, onClose} = this.props.propsModal;
    const modalClass = isModal ? "modal fade show" : "modal fade";
    const modalStyles = isModal ? {display: "block"} : {};
    const title = modalTitle ? (
      <div className="modal-header">
        <h5 className="modal-title">{modalTitle}</h5>
        <button 
          type="button" 
          className="close" 
          data-dismiss="modal"
          onClick = {() => onClose(false)}
          aria-hidden="true">
          <span aria-hidden="true">&times;</span>
          </button>
      </div>
    ) : null;
    return {modalClass, modalStyles, title};
  }

  onValueChange(e) {
    this.setState({value : e.target.value});
  }

  componentDidMount() {
    document.body.classList.add('modal-open');
    this.elemModal.className = 'overlay';
    this.elemModal.style.display = 'block';
    document.body.append(this.elemModal);
    const {isValue = '', isId = ''} = this.props.propsModal;
    this.setState({
      value : isValue,
      id : isId
    });
  }

  componentWillUnmount() {
    document.body.classList.remove('modal-open');
    this.elemModal.remove();
  }

  render() {
    const {value} = this.state;
    const {isBody, isFooter, cancelTitle, actionTitle, onClose} = this.props.propsModal;
    const {inputReadOnly, inputFocus} = this.props.propsModal;
    const {modalClass, modalStyles, title} = this.createModal();

    return ReactDOM.createPortal(
      <div 
        className = {modalClass}
        style = {modalStyles}
        data-backdrop="static"
      >
        <div className = "modal-dialog modal-lg modal-dialog-centered">
          <div className = "modal-content">
            {title}

          {isBody &&
            <div className = "modal-body">
            <form
              onSubmit = {this.onSubmit}
            >
              <input
                type = "text"
                className = "form-control"
                onChange = {this.onValueChange}
                value = {value}
                autoFocus = {inputFocus}
                readOnly = {inputReadOnly}
              />
            </form>
            </div>
          }    
          {isFooter &&
            <div className = "modal-footer">
              <button
                type = "button"
                className = "btn btn-default"
                data-dismiss = "modal"
                onClick = {() => onClose(false)}
                >
                  {cancelTitle}
                </button>
              <button
                type = "button"
                className = "btn btn-primary"
                onClick = {this.onSubmit}
                >
                  {actionTitle}
                </button>
            </div>
          }
          </div>
        </div>
      </div>,
      this.elemModal
    );
  }
}