

const test = async (req, res, next) => {
    return res.status(200).json({
        message: "Testing",
        result: null,
        status: 1
    });
}

module.exports = {
    test
};