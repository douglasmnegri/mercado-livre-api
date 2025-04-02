const express = require("express");
const cors = require("cors");
const shirtsRouter = require("./routes/shirts");

const app = express();
app.use(express.json());
app.use(cors()); // Allows requests from frontend

app.use("/shirts", shirtsRouter); // API route

const PORT = 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
