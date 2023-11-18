import { dbconnection } from "./dbconnection";

const user = async (req, res) => {
  try {
    const connection = await dbconnection();
    const email = await connection.query(
      `SELECT email FROM userinfo WHERE email='${req.body.email}'`
    );
    const password = await connection.query(
      `SELECT password FROM userinfo WHERE password='${req.body.password}'`
    );
    if (email[0].length > 0 && password[0].length > 0) {
      res.send({ data: "success" });
    } else {
      if (email[0].length === 0 && password[0].length === 0) {
        res.send({
          data: "failed to login",
          error1: "You have entered wrong email",
          error2: "You have entered wrong password",
        });
      } else if (email[0].length === 0) {
        res.send({
          data: "failed to login",
          error: "You have entered wrong email",
          field: "email",
        });
      } else {
        res.send({
          data: "failed to login",
          error: "You have entered wrong password",
          field: "password",
        });
      }
    }
  } catch (err) {
    res.json({ error: err });
  }
};
export default user;
