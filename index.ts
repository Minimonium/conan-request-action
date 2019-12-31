import * as core from '@actions/core';
import {context} from '@actions/github';

import {parse} from './src/source-information';

async function run() {
  try {
    const sourceInfo = await parse(context);
    console.log('url:', sourceInfo.url);
    console.log('sha256:', sourceInfo.sha256);
  } catch (error) {
    core.setFailed(error.message);
  }
};

run();
