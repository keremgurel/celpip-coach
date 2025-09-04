const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add support for workspace packages
config.watchFolders = [
  path.resolve(__dirname, 'packages'),
];

config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules'),
  path.resolve(__dirname, 'packages'),
];

module.exports = config;
