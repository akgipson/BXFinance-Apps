/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

// Packages
import React from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  Label,
  Input,
  CustomInput,
  TabContent, TabPane
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';

// Components
import FormPassword from '../../components/FormPassword';
import PingAuthN from '../Utils/PingAuthN' /* PING INTEGRATION */
import Session from '../Utils/Session' /* PING INTEGRATION: */
 

// Styles
import "./ModalLoginPassword.scss";

// Data
import data from './data.json';

class ModalLoginPassword extends React.Component {
  constructor() {
    super();
    this.state = {
      isOpen: false,
      activeTab: '1',
      loginMethodUnset: true,
      loginMethodFormGroupClass: '',
      userName: "",                   /* PING INTEGRATION: */
      swaprods: ""                    /* PING INTEGRATION: */
    };
    this.PingAuthN = new PingAuthN(); /* PING INTEGRATION: */
    this.Session = new Session();     /* PING INTEGRATION: */
  }
  onClosed() {
    this.setState({
      activeTab: '1',
      loginMethodUnset: true,
      loginMethodFormGroupClass: ''
    });
  }
  toggle(userName) {
    this.setState({
      isOpen: !this.state.isOpen,
      userName: userName
    });
  }
  toggleTab(tab) {
    /* BEGIN PING INTEGRATION: 
    tab 2 modal is device selection 
    which we don't use so we don't change state. Only call our handler. 
    Tab 4 is forgot username, so send them to PF endpoint. */
    console.log("TOGGLING TAB");
    console.log("STATE", this.state);

    if (tab == '2') {
      this.handleSubmit(tab);
    } else if (tab == '4') {
      window.location.href = process.env.REACT_APP_HOST + data.pfAcctRecoveryURI; /* TODO When SSPR with AuthN API and PID SDK is fixed, this ideally should be switched to a fetch(). */
    } else if (tab == '5') {
      window.location.href = process.env.REACT_APP_HOST + data.pfPwdChangeURI; /* TODO When SSPR with AuthN API and PID SDK is fixed, this ideally should be switched to a fetch(). */
    } else {
      /* END PING INTEGRATION */
      this.setState({ // TODO I dont think we need this anymore.
        activeTab: tab
      });
    }
  }
  setLoginMethod() {
    this.setState({
      loginMethodUnset: false,
      loginMethodFormGroupClass: 'form-group-light'
    });
  }
updatesession() {
  console.log("TEST");
}
  /* BEGIN PING INTEGRATION: */
  // This is used as a callback function to the child component FormPassword.
  handlePswdChange(event) {
    this.setState({ swaprods: event.target.value }, () => {
      console.log("User Input", this.state.swaprods);
    });
  }
  handleSubmit(tab) {
    console.log("HANDLING SUBMIT");
    console.log("STATE", this.state);
    const pswd = tab == '2' ? this.state.swaprods : "WTF?"; //TODO Do we care about the tab param here? Keep?
    const flowResponse = JSON.parse(this.Session.getAuthenticatedUserItem("flowResponse"));

    if (pswd) {
      console.log("pswd", pswd);
      this.PingAuthN.handleAuthNflow({ flowResponse: flowResponse, swaprods: this.state.swaprods })
        .then(response => response.json())
        .then(jsonResults => {
          console.log("jsonResults", jsonResults);
          if (jsonResults.status == "RESUME") {
            this.PingAuthN.handleAuthNflow({flowResponse: jsonResults});
          } else {
            throw "Flow Status Exception: Unexpected status."; //TODO This is probably a corner case, but how do we handle the UI in this error?
          }
        })
        .catch(e => {
          console.error("HANDLEAUTHNFLOW Exception:", e);
        });
    } 
  }
  /* END PING INTEGRATION: */

  render() {
    const closeBtn = <div />;
    return (
      <div>
        <Modal isOpen={this.state.isOpen} toggle={this.toggle.bind(this)} onClosed={this.onClosed.bind(this)} className="modal-login">
          <ModalHeader toggle={this.toggle.bind(this)} close={closeBtn}><img src={process.env.PUBLIC_URL + "/images/logo.svg"} alt="logo" /></ModalHeader>
          <ModalBody>
            <form>
              <TabContent activeTab={this.state.activeTab}>
                <TabPane tabId="1">
                  <h4>{data.titles.welcome}</h4>
                  <FormGroup className="form-group-light">
                    <Label for="username">{data.form.fields.username.label}</Label>
                    <Input type="text" name="username" id="username" value={this.state.userName} placeholder={data.form.fields.username.placeholder} />
                  </FormGroup>
                  <FormGroup className="form-group-light">
                    <Label for="password">{data.form.fields.password.label}</Label>
                    <Input type="password" onChange={this.handlePswdChange.bind(this)} name="password" id="password" placeholder={data.form.fields.password.placeholder} />
                  </FormGroup>
                  {/* <FormPassword setPassword={this.handlePswdChange} name="password" label={data.form.fields.password.label} placeholder={data.form.fields.password.placeholder} /> */}
                  <FormGroup className="form-group-light">
                    <CustomInput type="checkbox" id="remember" label={data.form.fields.remember.label} />
                  </FormGroup>
                  <div className="mb-3">
                    <Button type="button" color="primary" onClick={() => { this.toggleTab('2') }}>{data.form.buttons.next}</Button>
                  </div>
                  <div>
                    <Button type="button" color="link" size="sm" className="text-info pl-0" onClick={() => { this.toggleTab('4'); }}>{data.form.buttons.reset}</Button>
                  </div>
                  <div>
                    <Button type="button" color="link" size="sm" className="text-info pl-0" onClick={() => { this.toggleTab('5'); }}>{data.form.buttons.reset_password}</Button>
                  </div>
                </TabPane>
                <TabPane tabId="2">
                  <h4>{data.titles.login_method}</h4>
                  <FormGroup className={this.state.loginMethodFormGroupClass}>
                    <div>
                      <CustomInput type="radio" id="login_method_email" name="login_method" label={data.form.fields.login_method.options.email} className="form-check-inline" onClick={this.setLoginMethod.bind(this)} />
                      <CustomInput type="radio" id="login_method_text" name="login_method" label={data.form.fields.login_method.options.text} className="form-check-inline" onClick={this.setLoginMethod.bind(this)} />
                      <CustomInput type="radio" id="login_method_faceid" name="login_method" label={data.form.fields.login_method.options.faceid} className="form-check-inline" onClick={this.setLoginMethod.bind(this)} />
                    </div>
                  </FormGroup>
                  <div className="mb-4 text-center">
                    <Button type="button" color="primary" disabled={this.state.loginMethodUnset} onClick={() => { this.toggleTab('3'); }}>{data.form.buttons.login}</Button>
                  </div>
                  <div className="text-center">
                    <Button type="button" color="link" size="sm" className="text-info" onClick={this.toggle.bind(this)}>{data.form.buttons.help}</Button>
                  </div>
                </TabPane>
                <TabPane tabId="3">
                  <div className="mobile-loading" style={{backgroundImage: `url(${process.env.PUBLIC_URL}/images/login-device-outline.jpg)`}}>
                    <div className="spinner">
                      <FontAwesomeIcon icon={faCircleNotch} size="3x" className="fa-spin" />
                    </div>
                    <p>{data.mobile.loading}</p>
                  </div>
                  <div className="mt-4 text-center">
                    <Button type="button" color="link" size="sm" className="text-info" onClick={this.toggle.bind(this)}>{data.form.buttons.help}</Button>
                  </div>
                </TabPane>
                <TabPane tabId="4">
                  <h4>{data.form.buttons.recover_username}</h4>
                  <FormGroup className="form-group-light">
                    <Label for="email">{data.form.fields.email.label}</Label>
                    <Input type="text" name="email" id="email" placeholder={data.form.fields.email.placeholder} />
                  </FormGroup>
                  <div className="mb-3">
                    <Button type="button" color="primary" onClick={() => { this.toggleTab('6'); }}>{data.form.buttons.recover_username}</Button>
                  </div>
                </TabPane>
                <TabPane tabId="5">
                  <h4>{data.form.buttons.recover_password}</h4>
                  <FormGroup className="form-group-light">
                    <Label for="email">{data.form.fields.email.label}</Label>
                    <Input type="text" name="email" id="email" placeholder={data.form.fields.email.placeholder} />
                  </FormGroup>
                  <div className="mb-3">
                    <Button type="button" color="primary" onClick={() => { this.toggleTab('6'); }}>{data.form.buttons.recover_password}</Button>
                  </div>
                </TabPane>
                <TabPane tabId="6">
                  <h4>{data.titles.recover_username_success}</h4>
                  <div className="mb-3 text-center">
                    <Button type="button" color="primary" onClick={() => { this.toggleTab('1'); }}>{data.form.buttons.login}</Button>
                  </div>
                </TabPane>
              </TabContent>
            </form>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default ModalLoginPassword;