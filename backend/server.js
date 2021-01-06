const express = require("express");
const userRoutes = require("./routes/users");
const testRoutes = require("./routes/tests");
const testSaveRoutes = require("./routes/testSave");
const testDataRoutes = require("./routes/testData");
const testResultRoutes = require("./routes/testResults");
const mongoose = require("mongoose");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
mongoose.connect("mongodb://localhost/edi_1", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.use("/user", userRoutes);
app.use("/test", testRoutes);
app.use("/testsave", testSaveRoutes);
app.use("/data", testDataRoutes);
app.use("/result", testResultRoutes);

app.listen(1111);
