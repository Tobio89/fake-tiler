import express from 'express'
import bodyParser from 'body-parser';

import path from 'path';
import cors from 'cors';

var corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

export function initServer() {

  const server = express()
  server.use(cors(corsOptions));

  server.use('/static', express.static('public'))

  server.use(bodyParser.urlencoded({ extended: false }));
  server.use(bodyParser.json());

  server.use(express.urlencoded({ extended: false }));
  server.use(express.json());

  return server
}


export function makeOptions(){
  return {
    root: path.join(__dirname, 'public'),
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true
    }
  } as const;
}