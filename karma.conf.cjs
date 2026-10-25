module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],

    files: [
      {
        pattern: 'tests/**/*.spec.js',
        watched: false,
        included: true
      },
      {
        pattern: 'tests/**/*.spec.jsx',
        watched: false,
        included: true
      }
    ],

    preprocessors: {
      'tests/**/*.spec.js': ['webpack'],
      'tests/**/*.spec.jsx': ['webpack'],
      'src/**/*.js': ['webpack', 'coverage'],
      'src/**/*.jsx': ['webpack', 'coverage']
    },

    webpack: {
      mode: 'development',
      devtool: 'inline-source-map',
      module: {
        rules: [
          {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env', '@babel/preset-react'],
                plugins: ['istanbul']
              }
            }
          }
        ]
      },
      resolve: {
        extensions: ['.js', '.jsx']
      }
    },

    plugins: [
      require('karma-jasmine'),
      require('karma-firefox-launcher'),
      require('karma-webpack'),
      require('karma-coverage')
    ],

    reporters: ['progress', 'coverage'],
    coverageReporter: {
      type: 'html',
      dir: 'coverage/'
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    browsers: ['Firefox'],
    customLaunchers: {},
    singleRun: true,
    autoWatch: false
  });
};
