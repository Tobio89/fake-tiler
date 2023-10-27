import express from 'express'
import {Express} from 'express-serve-static-core'
import bodyParser from 'body-parser';
import path from 'path'

import cors from 'cors';

var corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

import cyto from './public/23AP-0048-0008a/23AP-0048-0008a_cytoplasm.json';
import membr from './public/23AP-0048-0008a/23AP-0048-0008a_membrane.json';
import nuc from './public/23AP-0048-0008a/23AP-0048-0008a_nucleus.json';

function makeFakePoints({x, y, w, h}:{x:number, y:number, w:number, h:number}){

  const points = [];

  for (let i = 0; i < 100; i++) {
    for (let j = 0; j < 100; j++){
      points.push({
        x: x + (Math.floor(w/100) * i),
        y: y + (Math.floor(h/100) * j)
      })
    }
  }
  return points;  
}


export async function createServer(): Promise<Express> {

  const server = express()

  server.use(cors(corsOptions));

  server.use('/static', express.static('public'))

  server.use(bodyParser.urlencoded({ extended: false }));
  server.use(bodyParser.json());

  server.use(express.urlencoded({ extended: false }));
  server.use(express.json());



  server.get('/meta-jpg/**', (req, res) => {
    const options = {
      root: path.join(__dirname, 'public'),
      dotfiles: 'deny',
      headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
      }
    } as const;

    res.sendFile('meta-jpg.xml', options, function (err) {

        console.log('Sent meta', req.path)
  
    })
  })
  server.get('/meta/**', (req, res) => {
    const options = {
      root: path.join(__dirname, 'public'),
      dotfiles: 'deny',
      headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
      }
    } as const;

    res.sendFile('meta.xml', options, function (err) {

        console.log('Sent meta', req.path)
  
    })
  })
  
  server.get('/img/:testNumber/**', (req, res) => {
    const requestHiddenImage = req.query.hidden === 'true' ?? false;

    const options = {
      root: path.join(__dirname, 'public'),
      dotfiles: 'deny',
      headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
      }
    } as const;

    const req_fle = req.params.testNumber.replace('_files', '');

    if (requestHiddenImage) {
      res.sendFile(`test-hidden.png`, options, function (err) {
          console.log('Sent hidden')
      })
    } else {
      res.sendFile(`test-${req_fle}.png`, options, function (err) {
        console.log('Sent', req.path)
    })
    }

  })
  server.get('/img-jpg/:testNumber/**', (req, res) => {
    const options = {
      root: path.join(__dirname, 'public'),
      dotfiles: 'deny',
      headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
      }
    } as const;

    

    res.sendFile(`test-jpg.jpg`, options, function (err) {
        console.log('Sent', req.path)
    })
  })
  
  server.post('/this-slide-loar-id/uihc-data/:gridX/:gridY', (req, res) => {

    res.status(200);
    res.send({
      points: makeFakePoints(req.body.trueCoords)
    });
  })


  server.post('/uihc-id/uihc-data-grid/:gridX/:gridY', (req, res) => {

    res.status(200);
    res.send({
      cyto
    });
  })
  return server
}


