import React, { Component } from 'react';
import logo from '../images/logo.svg';
import './App.css';
import {Panel, Table} from './my_component.js';

class App extends Component {

  

  render() {

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        <div className="container">
          <Panel />
        </div>
        <Table title="NX"/>
      </div>
    );
  }
}

export default App;
