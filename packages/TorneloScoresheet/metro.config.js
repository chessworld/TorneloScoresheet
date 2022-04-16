/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */
const packagePath = '../chess.ts';

module.exports = {
  resolver: {
    nodeModulesPaths: [packagePath],
    // rest of metro resolver options...
  },
  watchFolders: [packagePath],
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};
