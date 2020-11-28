const express = require('express');
const router = express.Router();
const db = require('../models/index');
const { Op } = require("sequelize");

const pnum = 10;

// ===================================
// ログイン時のチェック
// ===================================
function check(req, res) {
  if (req.session.login == null) {
    req.session.back = '/boards';/* ログイン後に遷移するルーティング */
    res.redirect('/users/login');
    return true; /* ログインしてなかったらtrueを返す関数 */
  } else {
    return false;
  }
}

// トップページ
router.get('/', (req, res, next) => {
  res.redirect('/boards/0');
});

// ===================================
// トップページにページ番号をつけてアクセス
// ===================================
router.get('/:page', (req, res, next) => {
  if (check(req, res)) { return }; /* ログインしてなかったらreturn */
  const pg = req.params.page * 1; /* :pageに格納されている数字をpgに格納 */
  db.Board.findAll({
    offset: pg * pnum, /* 値を取り出す位置 */
    limit: pnum,  /* 取り出す個数 */
    order: [
      ['createdAt', 'DESC']
    ],
    include: [{ /* 関連するUserモデルの読み込み */
      model: db.User,
      required: true
    }]
  }).then(brds => {
    var data = {
      title: 'Boards',
      login: req.session.login,
      content: brds,
      page: pg
    }
    res.render('boards/index', data);
  });
});
// ===================================
// メッセージ送信処理
// ===================================
router.post('/add', (req, res, next) => {
  if (check(req, res)) { return };
  db.sequelize.sync()
    .then(() => db.Board.create({ /* 入力された値と、useridを格納 */
      userId: req.session.login.id,
      message: req.body.msg
    })
      .then(brd => {
        res.redirect('/boards');
      })
      .catch((err) => {
        res.redirect('/boards');
      })
    )
});

// ===================================
// ホーム画面にアクセスした場合の処理
// ===================================
router.get('/home/:user/:id/:page', (req, res, next) => {
  if (check(req, res)) { return };
  const id = req.params.id * 1;
  const pg = req.params.page * 1;
  db.Board.findAll({
    where: { userId: id },
    offset: pg * pnum,
    limit: pnum,
    order: [
      ['createdAt', 'DESC']
    ],
    include: [{
      model: db.User,
      required: true
    }]
  }).then(brds => {
    var data = {
      title: 'Boards',
      login: req.session.login,
      userId: id,
      userName: req.params.user,
      content: brds,
      page: pg
    }
    res.render('boards/home', data);
  });
});

console.log(router.route());
module.exports = router;
