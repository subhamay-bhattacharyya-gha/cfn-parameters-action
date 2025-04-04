const core = require("@actions/core");

function run() {
  try {
    const configFile = core.getInput("config-file");
    const environment = core.getInput("environment");

    const configData = JSON.parse(fs.readFileSync(configFile, "utf8"));

    const envParamsArray = configData.parameters[environment];
    const projectName = configData["project-name"];
    const stackPrefix = configData["stack-prefix"];
    const stackSuffix = configData["stack-suffix"];
    const templatePath = configData["template-path"];
    const randomString = Math.random().toString(36).substring(2, 7); // Generate random string
    const stackName = `${projectName}-${stackPrefix}-${stackSuffix}-${randomString}`;
    console.log("Stack Name: " + stackName);
    console.log("Template Path: " + templatePath);
    console.log("Environment: " + environment);
    console.log("Random String: " + randomString);

    if (!envParamsArray || !Array.isArray(envParamsArray)) {
      throw new Error(`No parameters found for environment: ${environment}`);
    }

    // Flatten all objects in the array (support for multiple maps if needed)
    const flatParams = envParamsArray.reduce(
      (acc, obj) => ({ ...acc, ...obj }),
      {}
    );

    const formattedParams = Object.entries(flatParams)
      .map(([key, value]) => `ParameterKey=${key},ParameterValue=${value}`)
      .join("\n");

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
