const router = require('express').Router()
const pool = require('../config/config_db')
const formidable = require('formidable')
const fse = require('fs-extra')
const verify = require('./verifyToken')

router.post('/upload', verify, function(req, res, next) {
  let form = new formidable.IncomingForm(),
    files = {},
    fields = {}

  pool.query('SELECT MAX(id) FROM posts', function(error, result) {
    console.log('result: ', result)

    if (error) return res.status(400).send(error)

    dir = `../files/${result[0].path}`

    form.keepExtensions = true

    fse.ensureDir(dir, err => {
      // console.log(err);
    })

    form.uploadDir = dir

    form
      .parse(req)
      // переименовывание файла (без генерации уникального имени)
      .on('fileBegin', function(name, file) {
        file.path = form.uploadDir + '/' + file.name
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
            'Insert into `files` (id_path, name) values (?,?)',
            [path, files.upload.name],
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
