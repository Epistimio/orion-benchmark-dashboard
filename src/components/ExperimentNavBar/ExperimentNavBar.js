import React from 'react';
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
  if (typeof algoDef === 'string') return algoDef;
  const keys = Object.keys(algoDef);
  if (keys.length === 1) return keys[0];
  else
    throw new Error(
      `Cannot get algorithm name from object: ${JSON.stringify(algoDef)}`
    );
}

export class ExperimentNavBar extends React.Component {
  static contextType = BackendContext;
  constructor(props) {
    // props:
    // benchmarks: list of JSON objects representing benchmarks
    // benchmark: JSON object representing a benchmark
    // algorithms: set of strings
    // tasks: set of strings
    super(props);
    this.onChangeComboBox = this.onChangeComboBox.bind(this);
    this.onSelectAlgo = this.onSelectAlgo.bind(this);
    this.onSelectTask = this.onSelectTask.bind(this);
  }
  render() {
    return this.props.benchmarks === null ? (
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
          items={this.props.benchmarks}
          itemToString={item => (item === null ? null : item.name)}
          placeholder={'Search a benchmark ...'}
        />
        {this.props.benchmark === null ? (
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
    const benchmark = this.props.benchmark;
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
              checked={this.props.algorithms.has(row.algorithm)}
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
              checked={this.props.tasks.has(row.task)}
              onChange={(checked, id, event) =>
                this.onSelectTask(row.task, checked)
              }
            />
          </StructuredListCell>
        )}
      </StructuredListRow>
    ));
  }
  onChangeComboBox(event) {
    const benchmark = event.selectedItem;
    if (benchmark === null) {
      this.props.onSelectBenchmark(benchmark, new Set(), new Set());
    } else {
      const algorithms = benchmark.algorithms.map(algo =>
        getAlgorithmName(algo)
      );
      this.props.onSelectBenchmark(
        benchmark,
        new Set(algorithms),
        new Set(Object.keys(benchmark.tasks))
      );
    }
  }
  onSelectAlgo(algorithm, checked) {
    const algorithms = new Set(this.props.algorithms);
    if (checked) algorithms.add(algorithm);
    else algorithms.delete(algorithm);
    this.props.onSelectBenchmark(
      this.props.benchmark,
      algorithms,
      this.props.tasks
    );
  }
  onSelectTask(task, checked) {
    const tasks = new Set(this.props.tasks);
    if (checked) tasks.add(task);
    else tasks.delete(task);
    this.props.onSelectBenchmark(
      this.props.benchmark,
      this.props.algorithms,
      tasks
    );
  }
}

export default ExperimentNavBar;
