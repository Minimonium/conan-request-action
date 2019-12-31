import * as core from '@actions/core';
import {context} from '@actions/github';

import {parse} from './src/source-information';

async function run() {
  try {
    const sourceInfo = await parse(context);
    console.log('sourceInfo:', sourceInfo);
  } catch (error) {
    core.setFailed(error.message);
  }
};

run();
