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
      plots: null,
    };
  }
  render() {
    return this.state.plots === null ? (
      `Loading plots for assessment: ${this.props.assessment}, task: ${
        this.props.task
      }, algorithms: ${this.props.algorithms.join(', ')}`
    ) : this.state.plots === false ? (
      <strong>{`Unable to load plots for assessment: ${
        this.props.assessment
      }, task: ${this.props.task}, algorithms: ${this.props.algorithms.join(
        ', '
      )}`}</strong>
    ) : (
      this.state.plots.map((plotDef, plotIndex) => {
        const [plotName, plot] = plotDef;
        return (
          <Plot
            key={plotIndex}
            id={`plot-${this.props.assessment}-${this.props.task}-${plotName}`}
            data={plot.data}
            layout={plot.layout}
            config={{ responsive: true }}
            useResizeHandler={true}
            style={{ width: '100%' }}
          />
        );
      })
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
    console.log(`Loading: ${this.context.address}/${query}`);
    backend
      .query(query)
      .then(data => {
        if (this._isMounted) {
          const plots = data.analysis[this.props.assessment][this.props.task];
          const plotNames = Object.keys(plots);
          plotNames.sort();
          this.setState({
            plots: plotNames.map(plotName => [
              plotName,
              JSON.parse(plots[plotName]),
            ]),
          });
        }
      })
      .catch(error => {
        console.error(error);
        if (this._isMounted) this.setState({ plots: false });
      });
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
}
