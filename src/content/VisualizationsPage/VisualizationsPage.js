import React from 'react';
import { PlotRender } from './PlotRender';

class PlotGrid extends React.Component {
  constructor(props) {
    // props:
    // benchmark: JSON object representing a benchmark
    // algorithms: set of strings
    // tasks: set of strings
    // assessments: set of strings
    super(props);
  }
  render() {
    if (this.props.benchmark === null) {
      return (
        <div>
          <h4 className="title-visualizations">No benchmark selected</h4>
        </div>
      );
    }
    if (!this.props.assessments.size) {
      return (
        <div>
          <h4 className="title-visualizations">No assessment selected</h4>
        </div>
      );
    }
    if (!this.props.tasks.size) {
      return (
        <div>
          <h4 className="title-visualizations">No task selected</h4>
        </div>
      );
    }
    if (!this.props.algorithms.size) {
      return (
        <div>
          <h4 className="title-visualizations">No algorithm selected</h4>
        </div>
      );
    }
    const assessments = Array.from(this.props.assessments);
    const tasks = Array.from(this.props.tasks);
    const algorithms = Array.from(this.props.algorithms);
    assessments.sort();
    tasks.sort();
    algorithms.sort();
    return (
      <div>
        <h4 className="title-visualizations">Assessments</h4>
        <div className="bx--grid bx--grid--full-width">
          <div className="bx--row">
            {assessments.map((assessment, i) => (
              <div
                key={i}
                className="bx--col-sm-16 bx--col-md bx--col-lg bx--col-xlg">
                <div className="bx--tile plot-tile">
                  <strong>
                    <em>{assessment}</em>
                  </strong>
                </div>
              </div>
            ))}
          </div>
          {tasks.map((task, i) => (
            <div key={i} className="bx--row">
              {assessments.map((assessment, j) => (
                <div
                  key={j}
                  className="bx--col-sm-16 bx--col-md bx--col-lg bx--col-xlg">
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
