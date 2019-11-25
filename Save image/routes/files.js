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

    dir = `./files`
    form.keepExtensions = true
    fse.ensureDir(dir, err => {
      // console.log(err);
    })
    form.uploadDir = dir
    let path

    form
      .parse(req)
      // переименовывание файла (без генерации уникального имени)
      .on('fileBegin', function(name, file) {
        console.log('hash')

        imghash.hash('./files/123.jpg').then(hash => {
          console.log(hash) // 'f884c4d8d1193c07'
        })

        path = form.uploadDir + '/' + file.name
        file.path = path
      })
      .on('file', function(name, file) {
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
            [
              path,
              req.params.text,
              moment().format('YYYY-MM-DD HH:mm:ss'),
              req.user.id
            ],
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
  })
})

module.exports = router
