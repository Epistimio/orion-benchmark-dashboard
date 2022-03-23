import React, { Component } from 'react';
import './app.scss';
import { Content } from 'carbon-components-react';
import TutorialHeader from './components/TutorialHeader';
import ExperimentNavBar from './components/ExperimentNavBar';
import VisualizationsPage from './content/VisualizationsPage';
import { DEFAULT_BACKEND } from './BackendContext';
import { Backend } from './utils/queryServer';

class App extends Component {
  constructor(props) {
    super(props);
    // Store selected experiment here
    this.state = {
      benchmarks: null,
      benchmark: null,
      algorithms: null,
      tasks: null,
      assessments: null,
    };
    this.onSelectBenchmark = this.onSelectBenchmark.bind(this);
  }
  render() {
    return (
      <>
        <TutorialHeader />
        {this.state.benchmarks === null ? (
          <Content>
            <h4>Loading benchmarks ...</h4>
          </Content>
        ) : this.state.benchmarks.length === 0 ? (
          <Content>
            <h4>No benchmarks available</h4>
          </Content>
        ) : (
          <>
            <ExperimentNavBar
              benchmarks={this.state.benchmarks}
              benchmark={this.state.benchmark}
              algorithms={this.state.algorithms}
              tasks={this.state.tasks}
              assessments={this.state.assessments}
              onSelectBenchmark={this.onSelectBenchmark}
            />
            <Content>
              <VisualizationsPage
                benchmark={this.state.benchmark}
                algorithms={this.state.algorithms}
                tasks={this.state.tasks}
                assessments={this.state.assessments}
              />
            </Content>
          </>
        )}
      </>
    );
  }
  componentDidMount() {
    const backend = new Backend(DEFAULT_BACKEND);
    backend
      .query('benchmarks')
      .then(benchmarks => {
        this.setState({ benchmarks });
      })
      .catch(error => {
        this.setState({ benchmarks: [] });
      });
  }
  onSelectBenchmark(benchmark, algorithms, tasks, assessments) {
    this.setState({ benchmark, algorithms, tasks, assessments });
  }
}

export default App;
