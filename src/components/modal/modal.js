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
    this.textInput = React.createRef();

    this.onValueChange = this.onValueChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(e) {
    e.preventDefault();
    const {onAction} = this.props.propsModal;
    
    onAction(this.state);
  }

  focusTextInput() {
    if (this.textInput.current) {
      this.textInput.current.focus();
    };
  }

  createModal() {
    const {isModal} = this.props;

    const modalClass = isModal ? "modal fade show" : "modal fade";
    const modalStyles = isModal ? {display: "block"} : {};
    
    return {modalClass, modalStyles};
  }

  createModalTitle() {
    const {modalTitle, onClose} = this.props.propsModal;
    
    const title = modalTitle ? (
      <div className="modal-header">
        <h5 className="modal-title">{modalTitle}</h5>
        <button 
          type="button" 
          className="close custom-close" 
          data-dismiss="modal"
          onClick = {() => onClose(false)}
          aria-hidden="true">
          <span aria-hidden="true">&times;</span>
          </button>
      </div>
    ) : null;

    return {title};
  }

  createModalBody() {
    const {value} = this.state;
    const {isBody, inputReadOnly} = this.props.propsModal;

    const body = isBody ? (
      <div className = "modal-body">
        <form
          onSubmit = {this.onSubmit}
        >
          <input
            id = "inputModal"
            type = "text"
            ref = {this.textInput}
            className = "form-control"
            onChange = {this.onValueChange}
            value = {value}
            tabIndex = "1"
            readOnly = {inputReadOnly}
          />
        </form>
      </div>
    ) : null;

    return {body};
  }

  createModalFooter() {
    const {isFooter, cancelTitle, actionTitle, onClose} = this.props.propsModal;

    const footer = isFooter ? (
      <div className = "modal-footer">
        <button
          id = "btnClose"
          type = "button"
          tabIndex = "3"
          className = "btn btn-default"
          data-dismiss = "modal"
          onClick = {() => onClose(false)}
          >
            {cancelTitle}
          </button>
        <button
          id = "btnAction"
          type = "button"
          tabIndex = "2"
          className = "btn btn-primary"
          onClick = {this.onSubmit}
          >
            {actionTitle}
          </button>
      </div>
    ) : null;

    return {footer};
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

    this.focusTextInput();
  }

  componentWillUnmount() {
    document.body.classList.remove('modal-open');
    this.elemModal.remove();
  }

  render() {
    const {modalClass, modalStyles} = this.createModal();
    const {title} = this.createModalTitle();
    const {body} = this.createModalBody();
    const {footer} = this.createModalFooter();

    return ReactDOM.createPortal(
      <div 
        className = {modalClass}
        style = {modalStyles}
        data-backdrop="static"
      >
        <div className = "modal-dialog modal-lg modal-dialog-centered">
          <div className = "modal-content">
            {title}
            {body}
            {footer}
          </div>
        </div>
      </div>,
      this.elemModal
    );
  }
}