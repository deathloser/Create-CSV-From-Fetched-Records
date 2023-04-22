import { KintoneRestAPIClient } from "@kintone/rest-api-client";
import {Blob} from 'node:buffer';
import * as fs from 'fs';
import { appendFile } from "node:fs";
import { S3Client} from "@aws-sdk/client-s3";

const s3client = new S3Client({ region: "us-east-1" });


const client = new KintoneRestAPIClient({
  baseUrl: '',
  auth: {
    apiToken: ''
  }
});

export const handler = async(event) => {
    // TODO implement
    console.log('Running from VSCODE Lambda');

    const app = process.env.KINTONE_APP_ID;

    let records = await client.record.getAllRecordsWithId({
      app: 11884
    }
);
    
    let csvBody = ''; //from the first record
    


    for (var i=0; i < Object.entries(records[0]).length; i++) {
        csvBody += Object.entries(records[0])[i][0];
        if (i !== Object.entries(records[0]).length-1) {
            csvBody += ', ';
        }
        
        // console.log(Object.entries(records[0])[i][0]);
    }
    csvBody += '\n';

    const keys = Object.keys(records[0]);
    // console.log(keys);

    records.forEach((record) => {
        keys.forEach((key) => {
            if (typeof record[key].value == 'object') {
                // console.log(record[key].value['code']);
                csvBody += record[key].value['code'];
            } else {
                // console.log(record[key].value);
                csvBody += record[key].value;
            }
            csvBody += ', ';
            
        })
        csvBody += '\n';
    });

    console.log(csvBody);
    const textBlob = new Blob([csvBody], { type: 'text/plain' });
    fs.writeFile('mynewfile3.csv', csvBody, function (err) {
        if (err) throw err;
        console.log('Saved!');
      });

    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from VSCODE!'),
    };

    return response;
};

handler();