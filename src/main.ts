import * as core from '@actions/core'
import {context} from '@actions/github'

import applyInputs from './apply-inputs'
import makeRequest from './make-request'
import {parse} from './source-information'

function run(): void {
  parse(context)
    .then(applyInputs)
    .then(makeRequest)
    .catch(error => core.setFailed(error))
}

run()
