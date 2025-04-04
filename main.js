const fs = require("fs");
const core = require("@actions/core");

function run() {
  try {
    const configFile = core.getInput("config-file");
    const environment = core.getInput("environment");
    const isCiBuild = core.getInput("ci-build") === "true";

    const configData = JSON.parse(fs.readFileSync(configFile, "utf8"));

    const envParamsArray = configData.parameters[environment];
    const projectName = configData["project-name"];
    const stackPrefix = configData["stack-prefix"];
    const stackSuffix = configData["stack-suffix"];
    const templatePath = configData["template-path"];
    let randomString = "";
    let stackName = `${projectName}-${stackPrefix}-${stackSuffix}`;
    let defaultParams = `ParameterKey=ProjectName,ParameterValue=${projectName}`;

    if (isCiBuild) {
      randomString = `${Math.random().toString(36).substring(2, 7)}`;
      stackName = `${projectName}-${stackPrefix}-${stackSuffix}-${randomString}`;
      defaultParams += `\nParameterKey=CiBuild,ParameterValue=${randomString}`;
    }

    core.debug(`Generated stack name: ${stackName}`);
    core.debug(`Generated random string: ${randomString}`);
    core.debug(`Template path: ${templatePath}`);
    core.debug(`Environment: ${environment}`);
    core.debug(
      `Parameters for environment ${environment}: ${JSON.stringify(
        envParamsArray
      )}`
    );
    core.debug(`Config data: ${JSON.stringify(configData)}`);
    core.debug(`Project name: ${projectName}`);
    core.debug(`Stack prefix: ${stackPrefix}`);
    core.debug(`Stack suffix: ${stackSuffix}`);
    core.debug(`Stack name: ${stackName}`);
    core.debug(`Template path: ${templatePath}`);

    if (!envParamsArray || !Array.isArray(envParamsArray)) {
      throw new Error(`No parameters found for environment: ${environment}`);
    }

    // Flatten all objects in the array (support for multiple maps if needed)
    const flatParams = envParamsArray.reduce(
      (acc, obj) => ({ ...acc, ...obj }),
      {}
    );

    formattedParams = Object.entries(flatParams)
      .map(([key, value]) => `ParameterKey=${key},ParameterValue=${value}`)
      .join("\n");

    formattedParams += `\n${defaultParams}`;
    console.log("Generated Parameters:\n" + formattedParams);

    core.setOutput("parameters", formattedParams);
    core.setOutput("stack-name", stackName);
    core.setOutput("template-path", templatePath);
    core.setOutput("ci-build-identifier", randomString);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
