import {GitHub} from '@actions/github'
import Octokit from '@octokit/rest'
import {SourceInfo} from './source-information'

export interface RequestParameters {
  token: string
  upstreamRepo: string
  upstreamOwner: string
  sourceInfo: SourceInfo
}

export default async function makeRequest(
  p: RequestParameters
): Promise<Octokit.Response<Octokit.IssuesCreateResponse>> {
  const octokit = new GitHub(p.token)

  return octokit.issues.create({
    owner: p.upstreamOwner,
    repo: p.upstreamRepo,
    title: createTitle({...p.sourceInfo}),
    body: createBody({...p.sourceInfo})
  })
}

interface TitleParameters {
  packageName: string
  packageVersion: string
}
function createTitle(p: TitleParameters): string {
  return `[request] ${p.packageName}/${p.packageVersion}`
}

function createBody(p: SourceInfo): string {
  return `### Package Details
  * Package Name/Version: **${p.packageName}/${p.packageVersion}**
  * Website: **${p.website}**
  * Source code: **${p.tarball}**
  * Sha256: **${p.sha256}**


### Description

${p.description}

> It's an automated request. See https://github.com/marketplace/actions/conan-request
`
}
