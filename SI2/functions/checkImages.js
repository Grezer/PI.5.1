const router = require('express').Router()
const pool = require('../config/config_db')
const formidable = require('formidable')
const fse = require('fs-extra')
const moment = require('moment')
const imghash = require('imghash')
const leven = require('leven')

//let checkImage = newImageHash => {
  //const arrayOfHash = getHash()
  //foreach arrayOfHash get leven
//}

function getOneHash(path) {
    const hash1 = imghash.hash(path); 
    Promise(hash1, hash2)
    .then((results) => {
        console.log(results[0])        
    });
}






/*

    const hash = imghash.hash(path)
    console.log('hash: ', hash);
    Promise(hash).then(results => {
        console.log('results: ', results);
        return results
    })

    */









/*
    const hash = imghash.hash(path)
    const a = Promise(hash).then(results => {
    return results
  })
  return a
  */

  //return array of hash from DB
  //pool.query('SELECT MAX(id) as id FROM posts', function(error, result) {})

/*
 const hash1 = imghash.hash('./files/345.jpg')
          const hash2 = imghash.hash('./files/123.jpg')
          await Promise.all([hash1, hash2]).then(results => {
            const dist = leven(results[0], results[1])
            console.log(`Distance between images is: ${dist}`)
            if (dist <= 12) {
              console.log('Images are similar')
            } else {
              console.log('Images are NOT similar')
            }
          })
*/

module.exports = {getOneHash}
