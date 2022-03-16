import React from 'react';
import { RegretConst } from './RegretPlot';
import { LocalParameterImportancePlot } from './LocalParameterImportancePlot';
import { ParallelCoordinatesPlotConst } from './ParallelCoordinatesPlot';
import { BackendContext } from '../../BackendContext';
import { Backend } from '../../utils/queryServer';
import { PlotRender } from './PlotRender';

class PlotGrid extends React.Component {
  // Use BackendContext to retrieve current selected experiment.
  constructor(props) {
    // props:
    // benchmark: JSON object representing a benchmark
    // algorithms: set of strings
    // tasks: set of strings
    super(props);
  }
  render() {
    if (this.props.benchmark === null) {
      return (
        <div>
          <h4>No benchmark selected</h4>
        </div>
      );
    }
    if (!this.props.tasks.size) {
      return (
        <div>
          <h4>No task selected</h4>
        </div>
      );
    }
    if (!this.props.algorithms.size) {
      return (
        <div>
          <h4>No algorithm selected</h4>
        </div>
      );
    }
    const assessments = Object.keys(this.props.benchmark.assessments);
    const tasks = Array.from(this.props.tasks);
    const algorithms = Array.from(this.props.algorithms);
    assessments.sort();
    tasks.sort();
    algorithms.sort();
    return (
      <div>
        <h4>Assessments</h4>
        <div className="bx--grid bx--grid--full-width">
          <div className="bx--row">
            {assessments.map((assessment, i) => (
              <div
                key={i}
                className="bx--col-sm-16 bx--col-md-8 bx--col-lg-8 bx--col-xlg-8">
                <div className="bx--tile plot-tile">
                  <strong>{assessment}</strong>
                </div>
              </div>
            ))}
          </div>
          {tasks.map((task, i) => (
            <div key={i} className="bx--row">
              {assessments.map((assessment, j) => (
                <div
                  key={j}
                  className="bx--col-sm-16 bx--col-md-8 bx--col-lg-8 bx--col-xlg-8">
                  <div className="bx--tile plot-tile">
                    <PlotRender
                      key={`render-${
                        this.props.benchmark.name
                      }-${assessment}-${task}-${algorithms.join('-')}`}
                      benchmark={this.props.benchmark.name}
                      assessment={assessment}
                      task={task}
                      algorithms={algorithms}
                    />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

const VisualizationsPage = PlotGrid;

export default VisualizationsPage;
