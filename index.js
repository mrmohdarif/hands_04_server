import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcrypt";
import Jwt  from "jsonwebtoken";



const app = express();
let corsOption = {
  origin: "*",
};
dotenv.config();

app.use(cors(corsOption));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const allData = [];
app.get("/", (req, res) => {
  res.send("this is default");
});
app.post("/register", async (req, res) => {
  const userData = req.body;
  // console.log(userData);
  const salt = await bcrypt.genSalt(10);
  const haspassword = await bcrypt.hash(userData.password, salt);
  const token = Jwt.sign(
    { userEmail: userData.email },
    process.env.SECRET_KEY,
    { expiresIn: "1d" }
  );
  userData.token = token;
  userData.password = haspassword;
  allData.push(userData);
  console.log(allData);

  res.send(allData)
});
app.post("/login", (req, res) => {
  // console.log(req.body);

  const { email, password } = req.body;

  allData.map((item) => {
    if (item.email === email) {
      const haspassword = item.password;
      const matchPassword = bcrypt.compareSync(password, haspassword); //it return boolean value
      console.log(matchPassword);
      item.matchPassword=matchPassword;

      if (item.matchPassword) {
        // res.send("You are login sucessfully");

        res.send(item)
       
     
      } 
      else {
        res.send("Your email and password not matched");
      }
    } else {
      res.send("Your email and password not matched");
    }
  });
});
const PORT = process.env.PORT;
app.listen(PORT || 4000, () => {
  console.log("server is created");
});
