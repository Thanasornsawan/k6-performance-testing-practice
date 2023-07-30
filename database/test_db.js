import sql from 'k6/x/sql';
import {check, sleep, fail} from 'k6';
const db = sql.open('mysql', 'root:P@ssw0rd1@tcp(127.0.0.1:3306)/APIDevelop');

export const options={
    vus: 1,
    duration: '1s',
}

export function teardown() {
    db.close();
  }

export default function () {
  
    let results = sql.query(db, "select * from Books");
    /*
    value results will be ascii like this
    INFO[0000] [{"BookName":[68,101,118,111,112,115],"isbn":[98,110,105,100,51,52],
    "aisle":[55,53],"author":[82,97,104,117,108,32,83,104,101,116,116,121,50]},
    {"BookName":[83,101,108,101,110,105,117,109],"isbn":[107,111,115,110,99,115,51,52,102,114],
    "aisle":[50,51],"author":[82,97,104,117,108,32,83,104,101,116,116,121]},
    {"BookName":[74,109,101,116,101,114],"isbn":[114,116,98,114,115,115,50,52,116],"aisle":[50,51,52],
    "author":[82,97,104,117,108,32,83,104,101,116,116,121,51]},{"BookName":[65,112,112,105,117,109],
    "isbn":[102,100,115,101,102,114,51],"aisle":[50,51,52],"author":[82,97,104,117,108,32,83,104,101,116,116,121,51]}]
    */
    check(results, {
        'is length > 0': (r) => r.length >0,
      });
    function asciiToString(asciiArray) {
        return String.fromCharCode(...asciiArray);
    }
    // Loop through each object in the data array
    for (const row of results) {
        // Loop through each key-value pair in the object
        for (const [key, value] of Object.entries(row)) {
        console.log(`${key}: ${asciiToString(value)}`);
        }
    }
}