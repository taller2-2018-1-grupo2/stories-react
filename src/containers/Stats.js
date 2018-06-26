import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";
import ActiveUsersPieChart from '../components/ActiveUsersPieChart'
import RegisteredUsersPieChart from '../components/RegisteredUsersPieChart'
import StoriesBarChart from '../components/StoriesBarChart'
import RequestsLineChart from '../components/RequestsLineChart'
import axios from 'axios'
import "./NotFound.css";

const SHARED_SERVER_URI = "https://shared-server-stories.herokuapp.com/api"

export default class Stats extends Component {

  constructor(props) {
    super(props);
    
    this.state = {
        serversInfo: [],
        isReady: false
    };
  }

  async componentDidMount(){
    console.log(this.props.token);

    const setServersInfo = mServersInfo => this.setState({ 
      serversInfo: mServersInfo,
      isReady: true
    });

    await axios({
      method:'get',
      url: SHARED_SERVER_URI + '/servers',
      headers: {'Authorization': 'Bearer ' + this.props.token.token}
      })
        .then(function(response) {
          console.log(response)

          let mServersInfo = [];

          response.data.servers.forEach(server => {
            let serverInfo = {
              name: server.name,
              id: server.id
            }
            mServersInfo.push(serverInfo);
          });

          setServersInfo(mServersInfo);
        })
        .catch(function (error) {
          console.log(error);
        });
  };

  render() {
    const childProps = {
      token: this.props.token,
      serversInfo: this.state.serversInfo
    };

    return (
      <div>
        {this.state.isReady
              ? <Grid>
                  <Row className="show-grid">
                    <Col xs={12} md={6}>
                      <ActiveUsersPieChart childProps={childProps}/>
                    </Col>
                    <Col xs={12} md={6}>
                      <RegisteredUsersPieChart childProps={childProps}/>
                    </Col>
                    <Col xs={12} md={6} style={{ marginTop: 30 + "px" }}>
                      <StoriesBarChart childProps={childProps}/>
                    </Col>
                    <Col xs={12} md={6} style={{ marginTop: 30 + "px" }}>
                      <RequestsLineChart childProps={childProps}/>
                    </Col>
                  </Row>
                </Grid>
              : <div className="NotFound">
                  <h3>Cargando los datos...</h3>
                </div>
            }
      </div>
    );
  }
}