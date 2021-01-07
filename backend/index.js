const express = require('express')
const app = express()
const cors = require('cors')
const port = 3000
const fs = require('fs')
const path = require('path')
const csv_writer = require('csv-writer');

app.use(cors())
app.use(express.json({limit: '50mb'}))
app.use(express.urlencoded({ extended: true, limit: '50mb'}))

const projectInputFolder = 'project_files'
const scriptInputFolder = 'test_scripts'
const outputFolder = 'dumped_traces'
const testResultBaseName = 'test_result'

var resultFileLength = 2;
var results = [];
var resultCnt = 0;
var projectCnt = 0;

app.get('/', (req, res) => {
  res.send('Welcome')
})

app.get('/project_list', (req, res) => {
  results = [];
  projectList = fs.readdirSync(projectInputFolder)
                  .filter(fileName => 
                          fs.lstatSync(path.join(projectInputFolder, fileName))
                            .isFile());
  projectList.sort()
  projectCnt = projectList.length;
  resultCnt = 0;
  res.json(projectList)

})

app.get('/project_file/:filename', (req, res) => {
  const options = { 
    root: path.join(__dirname) 
  }; 
  const fileName = req.params.filename;
  console.log(fileName)
  res.sendFile(path.join(projectInputFolder, fileName), options, function (err) { 
      if (err) { 
         next(err); 
      } else { 
        console.log(`sent ${fileName} to the client`); 
      } 
  }); 
})

app.get('/test_script', (req, res) => {
  const scriptName = 'test.js'
  fs.readFile(`${scriptInputFolder}/${scriptName}`, 'utf8' , 
  (err, data) => {
    if (err) {
      console.error(err)
      return
    }
    console.log(`sent ${scriptName} to the client`)
    res.send(data)
  })
})

app.post('/save_trace/:i', (req, res) => {
  console.log(`received trace of \x1b[36m${req.body.projectName}\x1b[0m with coverage ${req.body.coverage}`)
  const OutputFolder = path.join(outputFolder, req.body.projectName)
  if (!fs.existsSync(OutputFolder)){
    fs.mkdirSync(OutputFolder);
  }
  fs.writeFile(`${OutputFolder}/${req.body.projectName}-${req.params.i}.json`, req.body.trace, err => {
    if (err) {
      console.error(err)
      return
    }
  })
  res.send('ok')
})

app.post('/save_test_result/', (req, res) => {
  console.log(`received test result of \x1b[36m${req.body.projectName}\x1b[0m`);
  let result = {name: req.body.projectName};
  const stat = req.body.stat;
  for (const testName of Object.keys(stat)) {
    const n_succ = stat[testName].success;
    const n_tot = parseInt(n_succ) + parseInt(stat[testName].fail);
    result[testName] = `${n_succ}/${n_tot}`;
  }
  resultCnt++;
  results.push(result);
  console.log(`Recieved ${resultCnt} out of ${projectCnt} results`);
  console.log(result);
  if (results.length >= resultFileLength || resultCnt >= projectCnt) {
    const Cols = Object.keys(result).map(k => ({id: k, title: k}))
    const csvWriter = csv_writer.createObjectCsvWriter({
      path: `${testResultBaseName}_${resultCnt}.csv`,
      header: Cols
    })
    const resLen = results.length;
    csvWriter.writeRecords(results)
    .then(() => {
        console.log(`Test results of ${resLen} projects generated`);
    });
    results = [];
  }
  res.send('ok');
})

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`)
})
