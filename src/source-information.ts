import {createHash, Hash} from 'crypto';
import {get} from 'request-promise';

export interface SourceInfo {
  url: string;
  sha256: string;
}

export function parse(context: any): Promise<SourceInfo> {
  return new Promise((resolve, reject) => {
    try {
      const url = context.payload.release.tarball_url;
      const options = {
        uri: url,
        headers: {'User-Agent': 'Conan-Publish-Action'},
      };
      const hasher = createHasher();
      get(options).pipe(hasher).on('finish', () => {
        const sha256 = hasher.read();
        resolve({url: url, sha256: sha256});
      });
    } catch (err) {
      console.log(context);
      reject(err);
    }
  });
}

function createHasher(): Hash {
  var hasher = createHash('sha256');
  hasher.setEncoding('hex');
  return hasher;
}
