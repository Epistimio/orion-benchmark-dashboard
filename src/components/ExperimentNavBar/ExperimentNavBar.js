import React from 'react';
import { Backend } from '../../utils/queryServer';
import { BackendContext } from '../../BackendContext';
import {
  SideNav,
  Checkbox,
  StructuredListWrapper,
  StructuredListHead,
  StructuredListBody,
  StructuredListRow,
  StructuredListCell,
  ComboBox,
} from 'carbon-components-react';

function getAlgorithmName(algoDef) {
  if (algoDef.hasOwnProperty('algorithm')) return algoDef.algorithm;
  const keys = Object.keys(algoDef);
  if (keys.length === 1) return keys[0];
  return algoDef;
}

export class ExperimentNavBar extends React.Component {
  static contextType = BackendContext;
  constructor(props) {
    // prop: onSelectExperiment: function(experiment)
    super(props);
    this.state = {
      benchmarks: null,
      benchmark: null,
      algorithms: new Set(),
      tasks: new Set(),
    };
    this.onChangeComboBox = this.onChangeComboBox.bind(this);
    this.onSelectAlgo = this.onSelectAlgo.bind(this);
    this.onSelectTask = this.onSelectTask.bind(this);
  }
  render() {
    return this.state.benchmarks === null ? (
      ''
    ) : (
      <SideNav
        isFixedNav
        expanded={true}
        isChildOfHeader={false}
        aria-label="Side navigation">
        <ComboBox
          onChange={this.onChangeComboBox}
          id={'combobox-benchmark'}
          items={this.state.benchmarks}
          itemToString={item => (item === null ? null : item.name)}
          placeholder={'Search a benchmark ...'}
        />
        {this.state.benchmark === null ? (
          ''
        ) : (
          <StructuredListWrapper>
            <StructuredListHead>
              <StructuredListRow head>
                <StructuredListCell head>Algorithms</StructuredListCell>
                <StructuredListCell head>Tasks</StructuredListCell>
              </StructuredListRow>
            </StructuredListHead>
            <StructuredListBody>
              {this.renderBenchmarkSettings()}
            </StructuredListBody>
          </StructuredListWrapper>
        )}
      </SideNav>
    );
  }
  renderBenchmarkSettings() {
    const benchmark = this.state.benchmark;
    const algorithms = benchmark.algorithms.map(algo => getAlgorithmName(algo));
    const tasks = Object.keys(benchmark.tasks);
    algorithms.sort();
    tasks.sort();
    const nbRows = Math.max(algorithms.length, tasks.length);
    const rows = [];
    for (let i = 0; i < nbRows; ++i) {
      rows.push({
        algorithm: i < algorithms.length ? algorithms[i] : null,
        task: i < tasks.length ? tasks[i] : null,
      });
    }
    return rows.map((row, i) => (
      <StructuredListRow key={i}>
        {row.algorithm === null ? (
          <StructuredListCell />
        ) : (
          <StructuredListCell>
            <Checkbox
              labelText={row.algorithm}
              id={`algorithm-${i}`}
              checked={this.state.algorithms.has(row.algorithm)}
              onChange={(checked, id, event) =>
                this.onSelectAlgo(row.algorithm, checked)
              }
            />
          </StructuredListCell>
        )}
        {row.task === null ? (
          <StructuredListCell />
        ) : (
          <StructuredListCell>
            <Checkbox
              labelText={row.task}
              id={`task-${i}`}
              checked={this.state.tasks.has(row.task)}
              onChange={(checked, id, event) =>
                this.onSelectTask(row.task, checked)
              }
            />
          </StructuredListCell>
        )}
      </StructuredListRow>
    ));
  }
  componentDidMount() {
    const backend = new Backend(this.context.address);
    backend
      .query('benchmarks')
      .then(benchmarks => {
        this.setState({ benchmarks });
      })
      .catch(error => {
        this.setState({ benchmarks: [] });
      });
  }
  onChangeComboBox(event) {
    const benchmark = event.selectedItem;
    if (benchmark === null) {
      this.setState({ benchmark, algorithms: new Set(), tasks: new Set() });
    } else {
      const algorithms = benchmark.algorithms.map(algo =>
        getAlgorithmName(algo)
      );
      this.setState({
        benchmark,
        algorithms: new Set(algorithms),
        tasks: new Set(Object.keys(benchmark.tasks)),
      });
    }
  }
  onSelectAlgo(algorithm, checked) {
    const algorithms = new Set(this.state.algorithms);
    if (checked) algorithms.add(algorithm);
    else algorithms.delete(algorithm);
    this.setState({ algorithms });
  }
  onSelectTask(task, checked) {
    const tasks = new Set(this.state.tasks);
    if (checked) tasks.add(task);
    else tasks.delete(task);
    this.setState({ tasks });
  }
}

export default ExperimentNavBar;
