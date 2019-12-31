# Conan Request Action

An action to create an issue with a request to update the package recipe in an upstream repository with Conan Center Index's request formatting.

## Usage

```yml
on:
  release:
    types: [published]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
    - uses: Minimonium/conan-request-action@master
      with:
        token: ${{ secrets.PERSONAL_TOKEN }}
```

## Inputs

| Input | Default | Description |
| --- | --- | --- |
| token | - | An author's personal github token to create issues in the upstream rrepositoryepo |
| packageName | Lower-cased name of the author's repository | The name of the package in the upstream repository |
| upstreamOwner | conan-io | Name of the upstream repository's owner |
| upstreamRepo | conan-center-index | Name of the upstream repository |

## Personal Token

To create a personal Github Token go to your [personal tokens page](https://github.com/settings/tokens) and click `Generate new token` button. Copy the produced token.

Go to your [repository's secrets page](https://github.com/{owner}/{repo}/settings/secrets) and click `Add a new secret`. Create a secret with the personal token created at the previous step.

For example, if you name it `PERSONAL_TOKEN` - then in the workflow file you should use it like this: `token: ${{ secrets.PERSONAL_TOKEN }}`.
