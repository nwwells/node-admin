import React from 'react';
import { Breadcrumb, Header } from 'semantic-ui-react';

import './App.css';

const App = () => (
  <div className="App">
    <div className="App-header">
      <Breadcrumb size="huge">
        {/* <Breadcrumb.Section link>Home</Breadcrumb.Section>
        <Breadcrumb.Divider icon="right chevron" />
        <Breadcrumb.Section link>Registration</Breadcrumb.Section>
        <Breadcrumb.Divider icon="right chevron" /> */}
        <Breadcrumb.Section active>System Status</Breadcrumb.Section>
      </Breadcrumb>
    </div>
    <div className="App-main">
      <div className="App-page">
        <Header as="h1">System Events - Last 24 Hours</Header>
      </div>
    </div>
  </div>
);

export default App;
