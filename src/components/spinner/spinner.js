import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import './spinner.css';

export default class Spinner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShow: null,
    }

    this.elemSpinner = document.createElement('div');
  }

  onToggleShow() {
    this.setState(
      state => !state.isShow ? {isShow: true} : null
    )
  }

  onToggleHide() {
    this.setState(
      state => state.isShow ? {isShow : false} : null
    )
  }

  componentDidMount() {
    document.body.append(this.elemSpinner);
    this.setState({isShow: false});
  }

  componentWillUnmount() {
    this.elemSpinner.remove();
  }

  render() {
    return ReactDOM.createPortal(
      this.state.isShow ? (
        <div className = "parent-spinner">
          <div className="d-flex justify-content-center">
            <div className="spinner-border" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        </div>
      ) : null, 
      this.elemSpinner
    )     
  }

}