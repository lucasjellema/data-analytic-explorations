//retrieve timestamps from njson file
// that itself was retrieved from https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi%3A10.7910%2FDVN%2FKJEBIL 
const readline = require('readline');
const fs = require('fs');
const readInterface = readline.createInterface({
    input: fs.createReadStream('realdonaldtrump.ndjson'),
    //output: process.stdout,
    console: false
});

var months = {
    'Jan': '01',
    'Feb': '02',
    'Mar': '03',
    'Apr': '04',
    'May': '05',
    'Jun': '06',
    'Jul': '07',
    'Aug': '08',
    'Sep': '09',
    'Oct': '10',
    'Nov': '11',
    'Dec': '12'
}

function timestampString(d) {
    return d.getFullYear()+'-'+(1+d.getMonth())+'-'+d.getDate()+'T'+d.getHours()+':'+d.getMinutes()
}

var lineCount = 0
var pageCount = 0
var pageSize = 20
var batch = []
readInterface.on('line', function (line) {
    lineCount++
    // find index of created_at
    pos = line.indexOf('created_at')
    dateString = line.substr(pos+13, 30)
    date = new Date(dateString.substr(26, 4)
        , months[dateString.substr(4, 3)]
        , dateString.substr(8, 2)
        , dateString.substr(11, 2)
        , dateString.substr(14, 2)
        , dateString.substr(17, 2)
    );
    
    batch.push(date)
    if (lineCount == pageSize) {
        pageCount++
        lineCount = 0
        console.log(`Processed ${pageSize * pageCount} entries`);
//        console.log(batch)
        for (s in batch) {
  //          console.log(batch[s])
            fs.appendFile('tweet-timestamps.txt', `${timestampString(batch[s])}\n`, (err) => {});
        }
        batch = []
    }
});

