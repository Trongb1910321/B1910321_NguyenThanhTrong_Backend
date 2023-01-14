const express = require("express");
const cors = require("cors");

const contactRouter = require("./app/routes/contact.route")
const ApiError = require("./app/api-error");

const app = express();

app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
    res.json({ message: "Welcome to contact book application." });
});
app.use("/api/contacts", contactRouter);

// handle 404 respone
app.use((req, res, next) => {
    //Code ở đây sẽ chạy khi không có route được định nghĩa nào
    // Khớp với yêu cầu. Gọi next() để chuyển sang middleware xử lý lỗi
    return next(new ApiError(404, "Resource not found"));
});

//define error-handling middle last, after other app.use() and routes calls
app.use((err, req, res, next) =>{
    //Middleware xử lý lỗi tập trung .
    //Trong các đoạn code xử lý các route, gọi next(error)
    //sẽ chuyển vế middleware xử lý lỗi này
    return res.status(err.statusCode || 500).json({
        message: err.message || "Internal Server Error",
    });
});

module.exports = app;

