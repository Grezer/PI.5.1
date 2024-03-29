const router = require('express').Router()
const pool = require('../config/config_db')
const formidable = require('formidable')
const fse = require('fs-extra')
const verify = require('./verifyToken')
const moment = require('moment')
const imghash = require('imghash')
const leven = require('leven')

router.post('/upload/:text', verify, function(req, res, next) {
  let form = new formidable.IncomingForm(),
    files = {},
    fields = {}

  pool.query('SELECT MAX(id) as id FROM posts', function(error, result) {
    const newName = result[0].id
    if (error) return res.status(400).send(error)

    dir = `./files/`
    form.keepExtensions = true
    fse.ensureDir(dir, err => {
      // console.log(err);
    })
    form.uploadDir = dir
    let path
    let filePath

    form
      .parse(req)
      // переименовывание файла (без генерации уникального имени)
      .on('fileBegin', async function(name, file) {
        path = form.uploadDir + file.name
        file.path = path
        console.log('hash')

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
      })
      .on('file', function(name, file) {
        //var fileName = curTime + '__' + file.name
        var fileName = 'asd'
        fse.rename(file.path, form.uploadDir + fileName, function(err) {
          if (!err) {
            return res.send(fileName)
          }
        })

        files[name] = file
      })
      .on('field', function(name, field) {
        fields[name] = field
      })
      .on('error', function(err) {
        return res.status(406).send(err)
      })
      .on('end', function() {
        pool.getConnection(function(err, con) {
          if (err) {
            return res.status(406).send(err)
          }
          con.query(
            'Insert into posts (pictureLink, text, postedTime, idPeople) values (?,?,?,?)',
            [path, req.params.text, moment().format('YYYY-MM-DD HH:mm:ss'), req.user.id],
            function(error, result) {
              if (error) {
                return res.status(406).send(error)
              }
              con.release()
              res.send(result)
            }
          )
        })
      })
    //fse.rename(renamePath, form.uploadDir + "/" + "asdasdf", (err) => {

    //});
  })
})

module.exports = router
