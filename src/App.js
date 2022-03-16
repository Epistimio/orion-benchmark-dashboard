import React, { Component } from 'react';
import './app.scss';
import { Content } from 'carbon-components-react';
import TutorialHeader from './components/TutorialHeader';
import ExperimentNavBar from './components/ExperimentNavBar';
import VisualizationsPage from './content/VisualizationsPage';
import { BackendContext, DEFAULT_BACKEND } from './BackendContext';

class App extends Component {
  constructor(props) {
    super(props);
    // Store selected experiment here
    this.state = { experiment: null };
    this.onSelectExperiment = this.onSelectExperiment.bind(this);
  }
  render() {
    return (
      <>
        <BackendContext.Provider
          value={{
            address: DEFAULT_BACKEND,
            // Pass selected experiment as React context
            // so that it is available in route components
            experiment: this.state.experiment,
          }}>
          <TutorialHeader />
          <ExperimentNavBar onSelectExperiment={this.onSelectExperiment} />
          <Content>
            <VisualizationsPage />
          </Content>
        </BackendContext.Provider>
      </>
    );
  }
  onSelectExperiment(experiment) {
    this.setState({ experiment });
  }
}

export default App;
