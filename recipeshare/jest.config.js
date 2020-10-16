module.exports = {
    preset: "jest-expo",
    verbose: true,
    setupFiles: [
        "./jestSetup.js"
    ],
    setupFilesAfterEnv: [
        "./enzymeSetup.js"
    ]
  };