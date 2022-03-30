import React from 'react';
import { PlotRender } from './PlotRender';
import { Tile, Grid, Row, Column } from 'carbon-components-react';

export class VisualizationsPage extends React.Component {
  /**
   * Props:
   * benchmark: JSON object representing a benchmark
   * algorithms: set of strings
   * tasks: set of strings
   * assessments: set of strings
   */
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
    /**
     * Key to hash current VisualizationPage properties.
     * Used to force re-rendering of all plots each time any option is (de)selected,
     * and then make sure each plot is entirely redrawn, preventing any graphical bug.
     * As plots are cached after first API call, forcing a redraw is not so-much time-consuming.
     * @type {string}
     */
    const prefix = `viz-${this.props.benchmark.name}-${assessments.join(
      '-'
    )}-${tasks.join('-')}-${algorithms.join('-')}`;
    return (
      <div>
        <h4 className="title-visualizations">Assessments</h4>
        <Grid fullWidth>
          <Row>
            {assessments.map((assessment, i) => (
              <Column key={`assessment-${assessment}`}>
                <Tile className="plot-tile">
                  <strong>
                    <em>{assessment}</em>
                  </strong>
                </Tile>
              </Column>
            ))}
          </Row>
          {tasks.map((task, i) => (
            <Row key={`task-${task}`}>
              {assessments.map((assessment, j) => (
                <Column key={`task-${task}-assessment-${assessment}`}>
                  <Tile className="plot-tile">
                    <PlotRender
                      key={`${prefix}-plots-${
                        this.props.benchmark.name
                      }-${assessment}-${task}-${algorithms.join('-')}`}
                      benchmark={this.props.benchmark.name}
                      assessment={assessment}
                      task={task}
                      algorithms={algorithms}
                    />
                  </Tile>
                </Column>
              ))}
            </Row>
          ))}
        </Grid>
      </div>
    );
  }
}

export default VisualizationsPage;
