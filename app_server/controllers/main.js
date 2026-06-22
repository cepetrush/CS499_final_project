/* GET Homepage */
const index = (req, res) => {
    res.render('index', {title: "Pet Getaways"});
};

module.exports = {
    index
}