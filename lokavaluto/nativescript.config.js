module.exports = {
    id: 'com.lokavaluto.lokavaluto',
    appResourcesPath: 'app/App_Resources',
    webpackConfigPath: './app.webpack.config.js',
    appPath: 'app',
    android: {
        maxLogcatObjectSize: 2048,
        markingMode: 'none',
        v8Flags: '--expose_gc',
        codeCache: true,
        forceLog: true,
    },
};
