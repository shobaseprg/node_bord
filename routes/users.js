const express = require('express');
const router = express.Router();
const db = require('../models/index');
const { Op } = require("sequelize");
const session = require('express-session'); //☆


// ===================================
// /users   ユーザー一覧
// ===================================
router.get('/', (req, res, next) => {
  db.User.findAll().then(usrs => {// 全てのユーザー取得
    var data = {
      title: 'Users/Index',
      content: usrs,
      userId: req.session.login.id
    }
    console.log(req.session.login.id);
    res.render('users/index', data);
  });
});
// ===================================
// /users/add   ユーザー追加入力
// ===================================
router.get('/add', (req, res, next) => {
  var data = {
    title: 'Users/Add',
    form: new db.User(),
    err: null
  }
  res.render('users/add', data);
});

//===================================
///users/add  ユーザー登録
//===================================
router.post('/add', (req, res, next) => {
  const form = {
    name: req.body.name,
    pass: req.body.pass,
    mail: req.body.mail,
    age: req.body.age
  };
  db.sequelize.sync()  /* 同期処理 */
    .then(() => db.User.create(form)/* formオブジェクトを引数に作成 */
      .then(usr => {
        req.session.login = usr;
        res.redirect('/users')
      })
      .catch(err => {/* 弾かれた場合errにはエラー情報が格納 */
        var data = {
          title: 'Users/Add',
          form: form,
          err: err,
        }
        res.render('users/add', data);
      })
    )
});

//===================================
///users/edit 編集画面
//===================================
router.get('/edit/:id', (req, res, next) => {
  db.User.findByPk(req.params.id)
    .then(usr => {
      var data = {
        title: 'Users/Edit',
        form: usr
      }
      res.render('users/edit', data);
    });
});

//===================================
///users/edit  更新
//===================================
router.post('/edit', (req, res, next) => {
  db.User.findByPk(req.body.id)
    .then(usr => {
      usr.name = req.body.name;
      usr.pass = req.body.pass;
      usr.mail = req.body.mail;
      usr.age = req.body.age;
      usr.save().then(() => res.redirect('/users'));
    });
});
//===================================
///users/delete  削除
//===================================
router.get('/delete/:id', (req, res, next) => {
  db.User.findByPk(req.params.id)
    .then(usr => {
      var data = {
        title: 'Users/Delete',
        form: usr
      }
      res.render('users/delete', data);
    });
});
//===================================
///users/delete  削除実行
//===================================
router.post('/delete', (req, res, next) => {
  db.User.findByPk(req.session.login.id)
    .then(usr => {
      usr.destroy().then(() => res.redirect('/'));
    });
});
//===================================
///users/login ログイン
//===================================
router.get('/login', (req, res, next) => {
  var data = {
    title: 'Users/Login',
    content: '名前とパスワードを入力下さい。'
  }
  res.render('users/login', data);
});
//===================================
///users/login ログイン実行
//===================================
router.post('/login', (req, res, next) => {
  db.User.findOne({
    where: {
      name: req.body.name,
      pass: req.body.pass,
    }
  }).then(usr => {
    if (usr != null) {/* 該当するレコードがあれば */
      req.session.login = usr;/* セッションにほぞん */
      // let back = req.session.back;
      // console.log(back);
      // if (back == null) {
      //   back = '/';
      // }
      res.redirect("/users");
    } else {
      var data = {
        title: 'Users/Login',
        content: '名前かパスワードに問題があります。再度入力下さい。'
      }
      res.render('users/login', data);
    }
  })
});

module.exports = router;
