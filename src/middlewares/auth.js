const adminAuth = (req, res, next) => {
    console.log("Admin auth token authroized")
    const token = "abc";
    const authToken = token === "abc";
    if (!authToken) {
        res.status(401).send("Not authorized")
    } else {
        next()
    }
}

const userAuth = (req, res, next) => {
    console.log("User auth token authroized")
    const token = "xyz";
    const authToken = token === "xyz";
    if (!authToken) {
        res.status(401).send("Not authorized")
    } else {
        next()
    }
}
module.exports = { adminAuth, userAuth };