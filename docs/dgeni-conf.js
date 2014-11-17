var path = require('canonical-path');
var Package = require('dgeni').Package;

module.exports = new Package('angular-semantic', [
  require('dgeni-packages/ngdoc')
])

.config(function(log, readFilesProcessor, writeFilesProcessor) {

  log.level = 'info';

  readFilesProcessor.basePath = path.resolve(__dirname, '..');
  readFilesProcessor.sourceFiles = [
    {
      include: 'src/**/*.js',
      exclude: '**/*.spec.js',
      basePath: 'src'
    },
    {
      include: 'src/**/*.ngdoc',
      basePath: 'src'
    }
  ];

  writeFilesProcessor.outputFolder  = 'dist/docs';

})



.config(function(computeIdsProcessor, getAliases) {
  computeIdsProcessor.idTemplates.push({
    docTypes: ['overview'],
    getId: function(doc) { return doc.fileInfo.baseName; },
    getAliases: function(doc) { return [doc.id]; }
  });
})


;