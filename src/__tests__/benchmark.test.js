import React from 'react';
import App from '../App';
import { HashRouter as Router } from 'react-router-dom';
import {
  render,
  waitFor,
  queryByText,
  findByText,
  screen,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Since I updated dependencies in package.json, this seems necessary.
beforeEach(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
});

/**
 * Return true if given DOM plot element contains all given texts.
 * @param plot - DOM element containing a plot
 * @param texts - texts (strings) to search
 * @return {boolean} - true if plot contains all texts
 */
function plotHasTexts(plot, texts) {
  for (let text of texts) {
    if (queryByText(plot, text) === null) return false;
  }
  return true;
}

/**
 * Check that we find only 1 plot containing all given texts.
 * @param texts - texts to search
 */
async function lookupPlot(...texts) {
  await waitFor(
    () => {
      const plots = document.querySelectorAll('.orion-plot');
      const filtered = [];
      for (let plot of plots.values()) {
        if (plotHasTexts(plot, texts)) {
          filtered.push(plot);
        }
      }
      expect(filtered.length).toBe(1);
    },
    { interval: 1000, timeout: 10000 }
  );
}

test('Test select benchmark', async () => {
  render(
    <Router>
      <App />
    </Router>
  );
  expect(await screen.findByText(/No benchmark selected/)).toBeInTheDocument();
  // Get benchmark search field
  const benchmarkField = await screen.findByPlaceholderText(
    'Search a benchmark ...'
  );
  expect(benchmarkField).toBeInTheDocument();

  // Select branin_baselines_webapi benchmark
  userEvent.type(benchmarkField, 'branin');
  userEvent.keyboard('{enter}');
  expect(benchmarkField.value).toBe('branin_baselines_webapi');
  const leftMenu = document.querySelector('.bx--structured-list');
  expect(leftMenu).toBeInTheDocument();
  expect(await findByText(leftMenu, /AverageResult/)).toBeInTheDocument();
  expect(await findByText(leftMenu, /Branin/)).toBeInTheDocument();
  expect(await findByText(leftMenu, /gridsearch/)).toBeInTheDocument();
  expect(await findByText(leftMenu, /random/)).toBeInTheDocument();
  expect(screen.queryByText(/No benchmark selected/)).toBeNull();
  // Check plot
  await lookupPlot(
    'Average Regret',
    'branin',
    'Trials ordered by suggested time'
  );

  // Select all_algos_webapi benchmark
  // Select text in search bar before typing a new text, so that old text is cleared
  benchmarkField.setSelectionRange(0, benchmarkField.value.length);
  userEvent.type(benchmarkField, 'all_algos');
  userEvent.keyboard('{enter}');
  expect(benchmarkField.value).toBe('all_algos_webapi');
  expect(await findByText(leftMenu, /AverageResult/)).toBeInTheDocument();
  expect(await findByText(leftMenu, /Branin/)).toBeInTheDocument();
  expect(await findByText(leftMenu, /EggHolder/)).toBeInTheDocument();
  expect(await findByText(leftMenu, /RosenBrock/)).toBeInTheDocument();
  expect(await findByText(leftMenu, /gridsearch/)).toBeInTheDocument();
  expect(await findByText(leftMenu, /random/)).toBeInTheDocument();
  expect(await findByText(leftMenu, /tpe/)).toBeInTheDocument();
  expect(screen.queryByText(/No benchmark selected/)).toBeNull();
  // Check plots
  await lookupPlot('Average Regret', 'branin');
  await lookupPlot('Average Regret', 'eggholder');
  await lookupPlot('Average Regret', 'rosenbrock');

  // Select all_assessments_webapi_2
  benchmarkField.setSelectionRange(0, benchmarkField.value.length);
  userEvent.type(benchmarkField, 'all_asses');
  userEvent.keyboard('{enter}');
  expect(benchmarkField.value).toBe('all_assessments_webapi_2');
  expect(await findByText(leftMenu, /AverageRank/)).toBeInTheDocument();
  expect(await findByText(leftMenu, /AverageResult/)).toBeInTheDocument();
  expect(await findByText(leftMenu, /ParallelAssessment/)).toBeInTheDocument();
  expect(await findByText(leftMenu, /Branin/)).toBeInTheDocument();
  expect(await findByText(leftMenu, /RosenBrock/)).toBeInTheDocument();
  expect(await findByText(leftMenu, /random/)).toBeInTheDocument();
  expect(await findByText(leftMenu, /tpe/)).toBeInTheDocument();
  expect(screen.queryByText(/No benchmark selected/)).toBeNull();
  // Check plots
  // Assessment AverageRank
  await lookupPlot(
    'Average Rankings',
    'Ranking based on branin',
    'Trials ordered by suggested time'
  );
  await lookupPlot(
    'Average Rankings',
    'Ranking based on rosenbrock',
    'Trials ordered by suggested time'
  );
  // Assessment AverageResult
  await lookupPlot(
    'Average Regret',
    'branin',
    'Trials ordered by suggested time',
    'random',
    'tpe'
  );
  await lookupPlot(
    'Average Regret',
    'rosenbrock',
    'Trials ordered by suggested time',
    'random',
    'tpe'
  );
  // Assessment ParallelAssessment (which also have regret plots as AverageResult)
  await lookupPlot(
    'Time to result',
    'branin',
    'Experiment duration by second(s)'
  );
  await lookupPlot(
    'Time to result',
    'rosenbrock',
    'Experiment duration by second(s)'
  );
  await lookupPlot('Parallel Assessment', 'branin', 'Number of workers');
  await lookupPlot('Parallel Assessment', 'rosenbrock', 'Number of workers');
  await lookupPlot(
    'Average Regret',
    'branin',
    'Trials ordered by suggested time',
    'random_workers_1',
    'tpe_workers_1'
  );
  await lookupPlot(
    'Average Regret',
    'rosenbrock',
    'Trials ordered by suggested time',
    'random_workers_1',
    'tpe_workers_1'
  );
});
