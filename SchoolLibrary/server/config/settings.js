const path = require('path')

let rootPath = path.normalize(path.join(__dirname, '/../../'))

module.exports = {
  development: {
    rootPath: rootPath,
    db: 'mongodb://localhost:27017/BookLibrary',
    port: process.env.PORT || 8000
  },
  staging: {
  },
  production: 
  {
	rootPath: rootPath,
    db: 'mongodb://localhost:27017/BookLibrary',
    port: process.env.PORT || 8000
  }
}
