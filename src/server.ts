import {Express} from 'express-serve-static-core'

import { initServer, makeOptions } from './utils/config';
import { handleMetaJPG, handleMetaPNG } from './routes/dziMeta';


import cyto from './utils/public/23AP-0048-0008a/23AP-0048-0008a_cytoplasm.json';
import membr from './utils/public/23AP-0048-0008a/23AP-0048-0008a_membrane.json';
import nuc from './utils/public/23AP-0048-0008a/23AP-0048-0008a_nucleus.json';


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

  const server = initServer()


  // Metadata Routes
  server.get('/meta-jpg/**', handleMetaJPG)
  server.get('/meta/**', handleMetaPNG)

  
  server.get('/img/:testNumber/**', (req, res) => {
    const options = makeOptions();

    const req_layer = req.query.layer;
    console.log('req_layer', req_layer)

    const req_fle = req_layer ?? req.params.testNumber.replace('_files', '');

      res.sendFile(`test-${req_fle}.png`, options, function (err) {
        console.log('Sent', req.path)
    })  

  })
  server.get('/img-query/:testNumber/**', (req, res) => {
    const options = makeOptions();

    const req_layer = req.query.layer;
    console.log('req_layer', req_layer)

    const req_fle = req_layer ? `${req_layer}-a` : req.params.testNumber.replace('_files', '');

      res.sendFile(`test-${req_fle}.png`, options, function (err) {
        console.log('Sent', req.path)
    })  

  })
  server.get('/img-hidden/:testNumber/**', (req, res) => {
    const requestHiddenImage = req.query.hidden === 'true' ?? false;

    const options = makeOptions();

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
  server.get('/img-simple/:testNumber/**', (req, res) => {
    const options = makeOptions();

      res.sendFile(`test-001.png`, options, function (err) {
        console.log('Sent', req.path)
    })
    

  })
  server.get('/img-jpg/:testNumber/**', (req, res) => {
    const options = makeOptions();

    

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
      // cyto,
      membrane: membr,
      nucleus: nuc
    });
  })
  return server
}


