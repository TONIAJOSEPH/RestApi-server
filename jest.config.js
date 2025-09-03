const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
  testMatch: ["**/**/*.test.ts"],
  verbose: true, //to show every single test result
  forceExit: true, //will not wait for async task to finish,kill the process after tests
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
};
