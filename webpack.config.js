const path = require('path');

module.exports = {
  mode: 'production',
  entry: './public/script.js', // Your main frontend file
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'), // Output directory
  },
};
