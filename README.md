![](https://img.shields.io/github/commit-activity/t/subhamay-bhattacharyya-gha/cfn-parameters-action)&nbsp;![](https://img.shields.io/github/last-commit/subhamay-bhattacharyya-gha/cfn-parameters-action)&nbsp;![](https://img.shields.io/github/release-date/subhamay-bhattacharyya-gha/cfn-parameters-action)&nbsp;![](https://img.shields.io/github/repo-size/subhamay-bhattacharyya-gha/cfn-parameters-action)&nbsp;![](https://img.shields.io/github/directory-file-count/subhamay-bhattacharyya-gha/cfn-parameters-action)&nbsp;![](https://img.shields.io/github/issues/subhamay-bhattacharyya-gha/cfn-parameters-action)&nbsp;![](https://img.shields.io/github/languages/top/subhamay-bhattacharyya-gha/cfn-parameters-action)&nbsp;![](https://img.shields.io/github/commit-activity/m/subhamay-bhattacharyya-gha/cfn-parameters-action)&nbsp;![](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/bsubhamay/cbeb86c52e35b8e6640b7c5361b20f3a/raw/cfn-parameters-action.json?)

# Generate CloudFormarion Parameters to be used in AWS CLI command.

![GitHub Marketplace](https://img.shields.io/badge/GitHub%20Marketplace-Action-blue?logo=github)
![Node.js CI](https://img.shields.io/badge/Node.js-20.x-brightgreen?logo=node.js)

This GitHub Action parses a JSON configuration file and generates AWS CloudFormation parameters, a stack name, a CI build identifier, and the template path, based on the selected environment. It’s designed for CI/CD pipelines that need to deploy different stacks dynamically. The CI build identifier will  be used
in the resource names to create a temporary stack in the build phase.

## Features

- Supports multiple environments (devl, test, prod)
- Generates dynamic stack names for CI builds
- Outputs ready-to-use CloudFormation parameter strings
- Extracts template path for the environment
- Lightweight and fast — powered by Node.js

## Inputs

| Input         | Description                                       | Required | Default |
|---------------|---------------------------------------------------|----------|---------|
| `config-file` | Path to the JSON config file                      | ✅ Yes   | –       |
| `environment` | Target environment name (`devl`, `test`, `prod`) | ✅ Yes   | –       |
| `ci-build`    | Is this a CI build? (`true` or `false`)          | ✅ Yes   | `false` |

## Outputs

| Output               | Description                                                             |
|----------------------|-------------------------------------------------------------------------|
| `parameters`         | CloudFormation parameters as a multiline string                         |
| `stack-name`         | Generated stack name for the given environment                          |
| `template-path`      | Path to the CloudFormation template file from the config                |
| `ci-build-identifier`| Random identifier if it's a CI build, empty string otherwise            |

## Usage

```yaml
name: Deploy Stack

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Generate CloudFormation Parameters
        uses: your-username/cfn-parameters-action@v1
        with:
          config-file: './infra/config.json'
          environment: 'prod'
          ci-build: 'true'

      - name: Use Parameters
        run: |
          echo "Stack Name: ${{ steps.generate.outputs.stack-name }}"
          echo "Template Path: ${{ steps.generate.outputs.template-path }}"
          echo "Parameters:"
          echo "${{ steps.generate.outputs.parameters }}"
```

## License
MIT