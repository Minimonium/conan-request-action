import * as core from '@actions/core';
import {context} from '@actions/github';

import applyInputs from './src/apply-inputs';
import makeRequest from './src/make-request';
import {parse} from './src/source-information';

async function run() {
  parse(context)
      .then(applyInputs)
      .then(makeRequest)
      .catch((error) => core.setFailed(error));
};

run();
