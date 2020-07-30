import React from 'react';
import {
  Container,
  Button,
  Form,
  FormGroup,
  Label,
  CustomInput,
} from 'reactstrap';
import classNames from "classnames";

// Components
import NavbarMain from '../../components/NavbarMain';
import WelcomeBar from '../../components/WelcomeBar';
import FooterMain from '../../components/FooterMain';
import AccountsSubnav from '../../components/AccountsSubnav';
import AccountsDropdown from '../../components/AccountsDropdown';
import AccountsSectionNav from '../../components/AccountsSectionNav';
import CardRewards from '../../components/CardRewards';
import Session from '../../components/Utils/Session'; /* PING INTEGRATION: */
import PingOAuth from '../../components/Utils/PingOAuth'; /* PING INTEGRATION: */
import PingData from '../../components/Utils/PingData'; /* PING INTEGRATION: */

// Data
import data from '../../data/profile-settings/communication-preferences.json';

// Styles
import "../../styles/pages/profile-settings/communication-preferences.scss";

class CommunicationPreferences extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      step: 1,
      sms: "no",            /* PING INTEGRATION: */
      smsChecked: false,    /* PING INTEGRATION: */
      email: "no",          /* PING INTEGRATION: */
      emailChecked: false,  /* PING INTEGRATION: */
      mail: "no",             /* PING INTEGRATION: */
      mailChecked: false    /* PING INTEGRATION: */
    };

    this.showStep2 = this.showStep2.bind(this);
    this.close = this.close.bind(this);
    this.toggleConsent = this.toggleConsent.bind(this); /* PING INTEGRATION: */
    this.Session = new Session(); /* PING INTEGRATION: */
    this.PingOAuth = new PingOAuth(); /* PING INTEGRATION: */
    this.PingData = new PingData(); /* PING INTEGRATION: */
    this.consentDef = "share-comm-preferences"; /* PING INTEGRATION: */
  }

  showStep2() {
    /* BEGIN PING INTEGRATION */
    if (this.state.consentId) {
      console.log("TEST", "Updating consents");
      const consent = { "sms": this.state.sms, "email": this.state.email, "homeAddress": this.state.mail };
      this.PingData.updateUserConsent(this.Session.getAuthenticatedUserItem("AT"), consent, this.state.consentId)
        .then(response => response.json())
        .then(consentData => {
          console.log("UpdateUserConsents", JSON.stringify(consentData));
          if (consentData.count > 0) {
            this.setState({
              sms: consentData._embedded.consents[0].data.sms,
              email: consentData._embedded.consents[0].data.email,
              mail: consentData._embedded.consents[0].data.homeAddress,
              smsChecked: consentData._embedded.consents[0].data.sms == "yes" ? true : false,
              emailChecked: consentData._embedded.consents[0].data.email == "yes" ? true : false,
              mailChecked: consentData._embedded.consents[0].data.homeAddress == "yes" ? true : false,
              consentId: consentData._embedded.consents[0].id
            });
            console.log("STATE", this.state);
          }
        })
        .catch(e => {
          console.error("UpdateUserConsents Exception", e)
        });
    } else {
      console.log("TEST", "Creating consent.");
      const consent = {"sms":this.state.sms, "email": this.state.email, "homeAddress": this.state.mail};
      this.PingData.createUserConsent(this.Session.getAuthenticatedUserItem("AT"), consent, this.Session.getAuthenticatedUserItem("uid"), this.consentDef)
        .then(response => response.json())
        .then(consentData => {
          console.log("createUserConsent", JSON.stringify(consentData));
          if (consentData.count > 0) {
            this.setState({
              sms: consentData._embedded.consents[0].data.sms,
              email: consentData._embedded.consents[0].data.email,
              mail: consentData._embedded.consents[0].data.homeAddress,
              smsChecked: consentData._embedded.consents[0].data.sms == "yes" ? true : false,
              emailChecked: consentData._embedded.consents[0].data.email == "yes" ? true : false,
              mailChecked: consentData._embedded.consents[0].data.homeAddress == "yes" ? true : false,
              consentId: consentData._embedded.consents[0].id
            });
            console.log("STATE", this.state);
          }
        })
        .catch(e => {
          console.error("CreateUserConsents Exception", e)
        });
    } /* END PING INTEGRATION */
    this.setState({ step: 2 });
  }

  close() {
    this.setState({ step: 1 });
  }

  /* BEGIN PING INTEGRATION:  */
  //this function sets state of comm. pref. selected soley based on event obj passed in during onclick.
  // we extract the comm. type and consent pref. based on the substrings of the element ID. I.e "sms_yes".
  toggleConsent(event) {
    let consentState = {};
    let checkedState = {};
    const delimiterPos = event.target.id.indexOf("_");
    consentState[event.target.id.substring(0, delimiterPos)] = event.target.id.substring(delimiterPos + 1);
    this.setState(consentState);
    checkedState[event.target.id.substring(0, delimiterPos) + "Checked"] = event.target.id.substring(delimiterPos + 1) == "yes" ? true : false;
    this.setState(checkedState);
    console.log("STATE", this.state);
  }
  /* END PING INTEGRATION:  */


  /* BEGIN PING INTEGRATION */
  componentDidMount() {
    this.PingOAuth.getToken({ uid: this.Session.getAuthenticatedUserItem("uid"), scopes: 'urn:pingdirectory:consent' })
      .then(token => {
        this.Session.setAuthenticatedUserItem("AT", token); //for later reuse to reduce getToken calls.
        this.PingData.getUserConsents(token, this.Session.getAuthenticatedUserItem("uid"), this.consentDef)
          .then(response => response.json())
          .then(consentData => {
            console.log("getUserConsents", JSON.stringify(consentData));
            if (consentData.count > 0) {
              this.setState({
                sms: consentData._embedded.consents[0].data.sms,
                email: consentData._embedded.consents[0].data.email,
                mail: consentData._embedded.consents[0].data.homeAddress,
                smsChecked: consentData._embedded.consents[0].data.sms == "yes" ? true : false,
                emailChecked: consentData._embedded.consents[0].data.email == "yes" ? true : false,
                mailChecked: consentData._embedded.consents[0].data.homeAddress == "yes" ? true : false, 
                consentId: consentData._embedded.consents[0].id
              });
              console.log("STATE", this.state);
            }
          })
          .catch(e => {
            console.error("GetUserConsents Exception", e)
          });
      })
      .catch(e => {
        console.error("GetToken Exception", e);
      });
  }
  /* END PING INTEGRATION */

  render() {
    let details, name;
    return (
      <div className="accounts communication-preferences">
        <NavbarMain />
        <WelcomeBar firstName={this.Session.getAuthenticatedUserItem("firstName")} /> {/* PING INTEGRATION; added prop */}
        <Container>
          <div className="inner">
            <div className="sidebar">
              {
                Object.keys(data.subnav).map(key => {
                  return (
                    <AccountsSubnav key={data.subnav[key].title} subnav={data.subnav[key]} />
                  );
                })
              }
              <CardRewards />
            </div>
            <div className="content">
              <div className="accounts-hdr">
                <h1>{data.title}</h1>
                <AccountsDropdown text={data.dropdown} />
              </div>
              {this.state.step == 1 &&
                <div className="module module-step1">
                  <h2>{data.steps[0].title}</h2>
                  <p>{data.steps[0].description}</p>
                  <h3>{data.steps[0].table_title}</h3>
                  <Form>
                    {
                      Object.keys(data.steps[0].communication_types).map(index => {
                        details = data.steps[0].communication_types[index].name == "sms" ? this.Session.getAuthenticatedUserItem("mobile") : data.steps[0].communication_types[index].name == "email" ? this.Session.getAuthenticatedUserItem("email") : this.Session.getAuthenticatedUserItem("fullAddress");
                        name = data.steps[0].communication_types[index].name;
                        return (
                          <>
                            <FormGroup className={classNames({ "gray": (index % 2) })}>
                              {/* PING INTEGRATION: modified label to display user data, and added onClicks to CustomInput */}
                              <Label for={data.steps[0].communication_types[index].name}>{data.steps[0].communication_types[index].label + '(' + details + ')'}</Label>
                              <CustomInput onChange={(event) => this.toggleConsent(event)} type="radio" id={`${data.steps[0].communication_types[index].name}_yes`} name={data.steps[0].communication_types[index].name} checked={this.state[name + "Checked"]} label="Yes" />
                              <CustomInput onChange={(event) => this.toggleConsent(event)} type="radio" id={`${data.steps[0].communication_types[index].name}_no`} name={data.steps[0].communication_types[index].name} checked={!this.state[name + "Checked"]} label="No" />
                            </FormGroup>
                          </>
                        );
                      })
                    }
                    <FormGroup className="buttons submit-buttons">
                      <Button color="primary" onClick={this.showStep2}>Save</Button>
                    <a href={process.env.PUBLIC_URL + "/banking/profile-settings"} className="text-info cancel">Cancel</a>
                    </FormGroup>
                  </Form>
                </div>
              }
              {this.state.step == 2 &&
                <div className="module module-step2">
                  <h2 className="confirmation">{data.steps[1].title}</h2>
                  <p>{data.steps[1].description}</p>
                  <h3>{data.steps[0].table_title}</h3>
                  <Form>
                    {
                      Object.keys(data.steps[1].communication_types).map(index => {
                        return (
                          <>
                            <FormGroup className={classNames({ "gray": (index % 2) })}>
                              <Label for={data.steps[0].communication_types[index].name}>{data.steps[0].communication_types[index].label}</Label>
                              <CustomInput type="radio" disabled id={`${data.steps[0].communication_types[index].name}_yes`} name={data.steps[0].communication_types[index].name} checked={this.state[name + "Checked"]} label="Yes" />
                              <CustomInput type="radio" disabled id={`${data.steps[0].communication_types[index].name}_no`} name={data.steps[0].communication_types[index].name} checked={!this.state[name + "Checked"]} label="No" />
                            </FormGroup>
                          </>
                        );
                      })
                    }
                    <div dangerouslySetInnerHTML={{ __html: data.steps[1].other_things }} />
                    <FormGroup className="buttons submit-buttons">
                      <Button color="primary" onClick={this.showStep1}>{data.steps[1].btn_back}</Button>
                    </FormGroup>
                  </Form>
                </div>
              }
            </div>
          </div>
        </Container>
        <FooterMain />
      </div>
    )
  }
}
export default CommunicationPreferences