const router = require('express').Router(),
  pool = require('../config/config_db'),
  formidable = require('formidable'),
  verify = require('./verifyToken')

router
  .route('/addPicture')
  .post(verify, function(req, res, next) {
    var form = new formidable.IncomingForm(),
      files = {},
      fields = {},
      allFiles = []

    dir = '/files'
    form.keepExtensions = true
    form.multiples = true

    form.uploadDir = dir

    var query_result = [] //save all insert responses

    form
      .parse(req)
      // переименовывание файла (без генерации уникального имени)
      .on('fileBegin', function(name, file) {
        file.path = form.uploadDir + '/' + file.name
      })
      .on('file', function(name, file) {
        files[name] = file
        allFiles.push({ name, file })
      })
      .on('field', function(name, field) {
        fields[name] = field
      })
      .on('error', function(err) {
        next(err)
      })
      .on('end', function() {
        if (fields.name == '') {
          fields.name = files.upload.name
        }
        pool.getConnection(function(err, con) {
          if (err) return res.status(406).send(err)

          allFiles.forEach(function(el) {
            con.query(
              'Insert into `gallery` (link, number) values (?, ?)',
              [`files/carousel/${files.upload.name}`, fields.number],

              function(error, result) {
                if (error) return res.status(406).send(error)
                query_result.push(result)
              }
            )
          })
          con.release()
          res.end()
        })
      })
  })
  .put(auth.required, (req, res, next) => {
    apiHelper.update(res, 'gallery', req.body)
  })
  .delete(auth.required, function(req, res, next) {
    apiHelper.drop(res, 'gallery', req.body)
  })

module.exports = router
