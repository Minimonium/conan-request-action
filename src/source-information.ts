import {createHash, Hash} from 'crypto'
import {get} from 'request-promise'
import clean from 'semver/functions/clean'
import {Context} from '@actions/github/lib/context'
import {WebhookPayload, PayloadRepository} from '@actions/github/lib/interfaces'

export interface SourceInfo {
  website: string
  description: string
  packageName: string
  packageVersion: string
  tarball: string
  sha256: string
}

export async function parse(context: Context): Promise<SourceInfo> {
  return new Promise((resolve, reject) => {
    try {
      const repository = getRepository(context.payload)
      const website = getWebsite(repository)
      const description = repository.description
      const packageName = formatName(repository.name)

      const release = getRelease(context.payload)
      const packageVersion = formatVersion(release.tag_name)
      const tarball = release.tarball_url
      const options = {
        uri: tarball,
        headers: {'User-Agent': 'Conan-Request-Action'}
      }
      const hasher = createHasher()
      get(options)
        .pipe(hasher)
        .on('finish', () => {
          const sha256 = hasher.read()
          resolve({
            website,
            description,
            packageName,
            packageVersion,
            tarball,
            sha256
          })
        })
    } catch (err) {
      reject(err)
    }
  })
}

function getRepository(payload: WebhookPayload): PayloadRepository {
  const repository = payload.repository
  if (repository == null) {
    throw new Error(
      `The Repository information is missing from the payload:\n${JSON.stringify(
        payload
      )}`
    )
  }
  return repository
}

function getWebsite(repo: PayloadRepository): string {
  const website = repo.html_url
  if (website == null) {
    throw new Error(
      `The repository is missing the html url:\n${JSON.stringify(repo)}`
    )
  }
  return website
}

interface ReleaseInformation {
  tag_name: string
  tarball_url: string
}
function getRelease(payload: WebhookPayload): ReleaseInformation {
  const release = payload.release
  if (release == null) {
    throw new Error(
      `The Release information is missing from the payload:\n${JSON.stringify(
        payload
      )}`
    )
  }
  return release
}

function formatName(name: string): string {
  return name.toLowerCase()
}

function formatVersion(tag: string): string {
  return clean(tag) || tag
}

function createHasher(): Hash {
  return createHash('sha256').setEncoding('hex')
}
