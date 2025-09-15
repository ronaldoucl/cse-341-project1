const router = require("express").Router();

router.use("/", require("./swagger"));

router.get("/", (req, res) => {
    //#swager.tags=['Users']
    res.send("Hello World");
});

router.use("/users", require("./users"));

module.exports = router;