import React, { Component } from "react";
import { DropdownButton, MenuItem, Form, FormGroup, FormControl, Button, Grid, Row, Col } from "react-bootstrap";
import {Line} from 'react-chartjs-2';
import _ from 'lodash'
import axios from 'axios'
import './StatsLobsterTitles.css'

const SHARED_SERVER_URI = "https://shared-server-stories.herokuapp.com/api"
const now = Date.now();

export default class RequestsLineChart extends Component {

  constructor(props) {
    super(props);
    
    this.state = {
        stats: [],
        serversInfo: this.props.childProps.serversInfo,
        isDataReady: false,
        isRefreshing: false,
        data: null,
        value: 60
    };

    this.handleChange = this.handleChange.bind(this);
    this.loadData = this.loadData.bind(this);
    this.refreshChart = this.refreshChart.bind(this);
    this.resetData = this.resetData.bind(this);
    this.setInitialData = this.setInitialData.bind(this);
    this.updateData = this.updateData.bind(this);
  }

  componentDidMount(){
    //console.log(this.props.childProps.token.token)
    this.loadData();
  }

  async loadData() {
    const loadStats = mStats => this.setInitialData(mStats);

    this.setState({ isRefreshing: true});

    await axios({
        method:'get',
        url: SHARED_SERVER_URI + '/stats/requests?minutes=' + this.state.value,
        headers: {'Authorization': 'Bearer ' + this.props.childProps.token.token}
        })
            .then(function(response) {
                console.log(response)
                loadStats(response.data.servers_stats);
            })
            .catch(function (error) {
                console.log(error);
            });
  }

  updateData(timestamps, mStats) {

    let groupedResults = _.groupBy(timestamps, (timestamp) => {
        const mDiff = now - timestamp;
        return Math.ceil(mDiff / 60000);
    });

    let mLabels = [];
    let mDatapoints = [];

    for (var key in groupedResults) {
        if (groupedResults.hasOwnProperty(key)) {
            mLabels.push(key);
            mDatapoints.push(groupedResults[key].length);
        }
    }

    mLabels.reverse();
    mDatapoints.reverse();

    const mData = {
        labels: mLabels,
        datasets: [
          {
            label: 'Minutos',
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: mDatapoints
          }
        ]
      };

    this.setState({
        data: mData,
        stats: mStats,
        isDataReady: true,
        isRefreshing: false
    });
  }

  resetData(id) {
    console.log(id);
    let timestamps = [];

    if (id === "all") {
        this.setInitialData(this.state.stats);
    } else {
        let serverStats = [];
        
        if (this.state.stats.findIndex(server => server.id === id) !== -1) {
            serverStats = this.state.stats[this.state.stats.findIndex(server => server.id === id)].stats;
        }

        serverStats.forEach(request => {
            timestamps.push(request.timestamp);
        });

        this.updateData(timestamps, this.state.stats);
    }
  }

  setInitialData(mStats) {
    let timestamps = [];

    mStats.forEach(server => {
        server.stats.forEach(request => {
            timestamps.push(request.timestamp);
        });
    });

    this.updateData(timestamps, mStats);
  }

  refreshChart(event) {
    if (!(isNaN(this.state.value) || this.state.value < 20)) {
        this.loadData();
    }
    event.preventDefault();
  }

  getValidationState() {
    if (isNaN(this.state.value) || this.state.value < 20) return 'error';
    else return 'success';
  }

  handleChange(e) {
    this.setState({ value: e.target.value });
  }

  render() {
    const resetData = this.resetData;

    var serversInfoMenuItems = this.state.serversInfo.map(function(server) {
        return (
            <MenuItem key={server.id} onClick={(e) => resetData(server.id, e)}>{server.name}</MenuItem>
        );
    });

    return (
        <div>
            <h2 className="lobsterTitle">Consultas (Por Minuto)</h2>
            <br/>
            <Grid>
                <Row className="show-grid">
                    <Col xs={6} md={4}>
                        <div>
                            <Form inline onSubmit={this.refreshChart}>
                                <FormGroup
                                    controlId="refreshChart"
                                    validationState={this.getValidationState()}
                                >
                                <FormControl
                                    type="text"
                                    value={this.state.value}
                                    placeholder="Ingrese el rango"
                                    onChange={this.handleChange}
                                />
                                <FormControl.Feedback />
                                </FormGroup>
                                <Button style={{ marginLeft: 10 + "px" }} type="submit">Actualizar</Button>
                            </Form>
                        </div>
                    </Col>
                    <Col xs={6} md={2}>
                        {!this.state.isRefreshing
                        ?   <DropdownButton title={"Elegir fuente"} id={"dropdown"}>
                                <MenuItem onClick={(e) => this.resetData("all", e)}>Todos</MenuItem>
                                {serversInfoMenuItems}
                            </DropdownButton>
                        : <div/>
                        }
                    </Col>
                </Row>
            </Grid>
            {this.state.isDataReady
              ? <Line data={this.state.data} />
              : <h4>Cargando gráfico...</h4>
            }
        </div>
    );
  }
}