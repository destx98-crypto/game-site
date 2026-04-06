const express = require("express");
const fs = require("fs");

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

let db = JSON.parse(fs.readFileSync("data.json"));

function save() {
  fs.writeFileSync("data.json", JSON.stringify(db));
}

app.post("/register", (req, res) => {
  const {login, password} = req.body;
  if (db.users[login]) return res.send({error: 1});

  db.users[login] = {password, balance: 0, uc: 0};
  save();
  res.send({ok: 1});
});

app.post("/login", (req, res) => {
  const {login, password} = req.body;
  let user = db.users[login];

  if (!user || user.password !== password) return res.send({error: 1});
  res.send({ok: 1});
});

app.get("/user", (req, res) => {
  res.send(db.users[req.query.login]);
});

app.post("/play", (req, res) => {
  let user = db.users[req.body.login];

  if (user.balance < 3000) return res.send({message: "Balans yo‘q"});

  user.balance -= 3000;
  db.count++;

  if (db.count % 5 === 0) {
    user.uc += 60;
    save();
    return res.send({message: "🎉 Yutding +60 UC"});
  }

  save();
  res.send({message: "❌ Yutqazding"});
});

app.post("/reward", (req, res) => {
  let user = db.users[req.body.login];

  if (user.uc === 0) return res.send({message: "Yutuq yo‘q"});

  console.log("ID:", req.body.id, "UC:", user.uc);

  user.uc = 0;
  save();

  res.send({message: "Adminga yuborildi"});
});

app.post("/add", (req, res) => {
  db.users[req.body.user].balance += Number(req.body.amount);
  save();
  res.send({ok: 1});
});

app.listen(3000);
