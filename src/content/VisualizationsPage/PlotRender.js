import React from 'react';
import Plot from 'react-plotly.js';
import { BackendContext } from '../../BackendContext';
import { Backend } from '../../utils/queryServer';

export class PlotRender extends React.Component {
  // Control variable to avoid setting state if component was unmounted before an asynchronous API call finished.
  _isMounted = false;
  static contextType = BackendContext;
  constructor(props) {
    // props:
    // benchmark: str
    // assessment: str
    // task: str
    // algorithms: list of strings
    super(props);
    this.state = {
      plot: null,
    };
  }
  render() {
    return this.state.plot === null ? (
      `Loading plot for assessment: ${this.props.assessment}, task: ${
        this.props.task
      }, algorithms: ${this.props.algorithms.join(', ')}`
    ) : this.state.plot === false ? (
      <strong>{`Unable to load plot for assessment: ${
        this.props.assessment
      }, task: ${this.props.task}, algorithms: ${this.props.algorithms.join(
        ', '
      )}`}</strong>
    ) : (
      <Plot
        id={`plot-${this.props.assessment}-${this.props.task}`}
        data={this.state.plot.data}
        layout={this.state.plot.layout}
        config={{ responsive: true }}
        useResizeHandler={true}
        style={{ width: '100%' }}
      />
    );
  }
  componentDidMount() {
    this._isMounted = true;
    const backend = new Backend(this.context.address);
    const query = `benchmarks/${this.props.benchmark}?assessment=${
      this.props.assessment
    }&task=${this.props.task}&algorithms=${this.props.algorithms.join(
      '&algorithms='
    )}`;
    console.log(`Loading: ${query}`);
    backend
      .query(query)
      .then(data => {
        if (this._isMounted)
          this.setState({
            plot: JSON.parse(
              data.analysis[this.props.assessment][this.props.task]
            ),
          });
      })
      .catch(error => {
        if (this._isMounted) this.setState({ plot: false });
      });
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
}
