import {createHash, Hash} from 'crypto';
import {get} from 'request-promise';
import semver from 'semver';

export interface SourceInfo {
  website: string;
  description: string;
  packageName: string;
  packageVersion: string;
  tarball: string;
  sha256: string;
}

export function parse(context: any): Promise<SourceInfo> {
  return new Promise((resolve, reject) => {
    const repository = context.payload.repository;
    if (!repository) {
      console.log(context.payload);
      reject('The Repository information is missing from the payload');
    }
    const website = repository.html_url;
    const description = repository.description;
    const packageName = formatName(repository.name);

    const release = context.payload.release;
    if (!release) {
      console.log(context.payload);
      reject('The Release information is missing from the payload');
    }
    const packageVersion = formatVersion(release.tag_name);
    const tarball = release.tarball_url;
    const options = {
      uri: tarball,
      headers: {'User-Agent': 'Conan-Publish-Action'},
    };
    const hasher = createHasher();
    get(options).pipe(hasher).on('finish', () => {
      const sha256 = hasher.read();
      resolve({
        website: website,
        description: description,
        packageName: packageName,
        packageVersion: packageVersion,
        tarball: tarball,
        sha256: sha256
      });
    });
  });
}

function formatName(name: string) {
  return name.toLowerCase();
}

function formatVersion(tag: string) {
  return semver.clean(tag) || tag;
}

function createHasher(): Hash {
  return createHash('sha256').setEncoding('hex');
}
