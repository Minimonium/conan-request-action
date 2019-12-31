import core from '@actions/core'

import {RequestParameters} from './make-request'
import {SourceInfo} from './source-information'

export default function applyInputs(sourceInfo: SourceInfo): RequestParameters {
  sourceInfo.packageName =
    core.getInput('packageName') || sourceInfo.packageName
  return {
    token: core.getInput('token'),
    upstreamRepo: core.getInput('upstreamRepo'),
    upstreamOwner: core.getInput('upstreamOwner'),
    sourceInfo
  }
}
