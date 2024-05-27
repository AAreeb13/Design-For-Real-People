const app = require("express")();
const PORT = 8080;

app.get("/tshirt", (req, res) => {
  res.status(200).send({
    tshirt: "T",
    size: "large"
  })
});

app.listen(
  PORT,
  () => console.log(`It's alive on http://localhost:${PORT}`)
)