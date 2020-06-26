import React from 'react';
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  FormGroup,
  Label,
  Input
} from 'reactstrap';

// Components
import NavbarMain from '../../components/NavbarMain';
import WelcomeBar from '../../components/WelcomeBar';
import FooterMain from '../../components/FooterMain';
import AccountsSubnav from '../../components/AccountsSubnav';
import AccountsDropdown from '../../components/AccountsDropdown';
import CardRewards from '../../components/CardRewards';
import PartnerAccess from '../../components/PartnerAccess';

// Data
import data from '../../data/profile-settings/privacy-security.json';
 
// Styles
import "../../styles/pages/profile-settings/privacy-security.scss";

class PrivacySecurity extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      step: 1
    };

    this.showStep1 = this.showStep1.bind(this);
    this.showStep2 = this.showStep2.bind(this);
    this.close = this.close.bind(this);
  }

  showStep1() {
    this.setState({step: 1});
  }

  showStep2() {
    this.setState({step: 2});
  }

  close() {
    this.setState({step: 1});
  }

  render() {
    return(
      <div className="accounts privacy-security">
        <NavbarMain />
        <WelcomeBar />
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
              <div className="module">
                { this.state.step == 1 &&
                  <div className="edit">
                    <h2>{data.steps[0].title}</h2>
                    <p>{data.steps[0].description}</p>
                    <h3>{data.steps[0].table_title}</h3>
                    <Form className="edit">
                      <Container>
                        {
                          Object.keys(data.steps[0].partners).map(index => {
                            return (
                              <PartnerAccess data={data.steps[0].partners[index]} index={index} />
                            );
                          })      
                        }                        
                        <Row>
                          <Col>
                            <FormGroup className="buttons submit-buttons">
                              <Button color="primary" onClick={ this.showStep2 }>{data.steps[0].btn_save}</Button>
                              <Button className="cancel" disabled>{data.steps[0].btn_cancel}</Button>
                            </FormGroup>
                          </Col>
                        </Row>
                      </Container>
                    </Form>
                  </div>
                }
                { this.state.step == 2 &&
                  <div className="confirmation">
                    <h3>{data.steps[1].title}</h3>
                    <p>{data.steps[1].description}</p>                    
                    {
                      Object.keys(data.steps[1].partners).map(index => {
                        return (
                          <>
                            <p className="form-header">{data.steps[1].partners[index].title}</p>
                            <Form>
                            {
                              Object.keys(data.steps[1].partners[index].permissions).map(index2 => {
                                const permission = data.steps[1].partners[index].permissions[index2];
                                return (
                                  <FormGroup check>
                                    <Label check>
                                      <Input type="checkbox" checked={permission.checked} disabled /> {permission.label}
                                    </Label>
                                  </FormGroup>
                                )
                              })
                            }
                            </Form>
                            <div className="anywealthadvisor">
                              <p>{data.steps[1].partners[index].banner}</p>
                              <Button href={data.steps[1].partners[index].cta_destination}>{data.steps[1].partners[index].cta_text}</Button>
                            </div>
                          </>
                        );
                      })      
                    }
                    <div dangerouslySetInnerHTML={{__html: data.steps[1].other_things}} />                    
                    <FormGroup className="buttons submit-buttons">
                      <Button color="primary" onClick={ this.showStep1 }>{data.steps[1].btn_back}</Button>
                    </FormGroup>
                  </div>
                }
              </div>
            </div>
          </div>
        </Container>
        <FooterMain />
      </div>
    )
  }
}
export default PrivacySecurity