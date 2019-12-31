import {GitHub} from '@actions/github';
import {SourceInfo} from './source-information';

export interface RequestParameters {
  token: string;
  upstreamRepo: string;
  upstreamOwner: string;
  sourceInfo: SourceInfo;
}

export default function makeRequest(p: RequestParameters) {
  const octokit = new GitHub(p.token);

  return octokit.issues.create({
    owner: p.upstreamOwner,
    repo: p.upstreamRepo,
    title: createTitle({...p.sourceInfo}),
    body: createBody({...p.sourceInfo})
  });
}

interface TitleParameters {
  packageName: string;
  packageVersion: string;
}
function createTitle(p: TitleParameters) {
  return `[request] ${p.packageName}/${p.packageVersion}`;
}

function createBody(p: SourceInfo) {
  return `### Package Details\n  * Package Name/Version: **${p.packageName}/${
      p.packageVersion}**\n  * Website: **${p.website}**\n  * Source code: **${
      p.tarball}**\n  * Sha256: **${p.sha256}**\n\n\n### Description\n${
      p.description}`
}
