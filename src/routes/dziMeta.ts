import { Request, Response } from "express";
import { makeOptions } from "../utils/config";

export function handleMetaJPG(req: Request, res: Response){
  const options = makeOptions();

  res.sendFile('meta-jpg.xml', options, function (err) {

      console.log('Sent meta', req.path)
  })
}

export function handleMetaPNG(req: Request, res: Response){

  const options = makeOptions();

  res.sendFile('meta.xml', options, function (err) {

    console.log('Sent meta', req.path)

})
}
