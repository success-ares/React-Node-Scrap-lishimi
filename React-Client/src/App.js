import React, { Component } from 'react';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import ReduxToastr from 'react-redux-toastr';

import Results from './pages/Results';

class App extends Component {

  render() {
    return (
        <div>
          <Router>
            <Route path="/" component={Results} />
          </Router>
          <ReduxToastr position="bottom-left" />
        </div>
    );
  }


}


export default App;
