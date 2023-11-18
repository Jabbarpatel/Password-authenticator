import { dbconnection } from "./dbconnection";

const changepassword = async (req, res) => {
  try {
    const connection = await dbconnection();
    const email = await connection.query(
      `SELECT email FROM userinfo WHERE email="${req.body.email}"`
    );
    const password = await connection.query(
      `SELECT password FROM userinfo WHERE password="${req.body.prevPassword}"`
    );
    if (email[0].length > 0 && password[0].length > 0) {
      await connection.query(
        `UPDATE userinfo SET password="${req.body.newPassword}" WHERE email="${req.body.email}" AND password="${req.body.prevPassword}"`
      );
      res.send({ data: "success" });
    } else if (email[0].length === 0 && password[0].length === 0) {
      res.send({
        data: "failed to update",
        prevPasswordError: "Previous password is not correct",
        emailError: "You have entered a wrong email",
      });
    } else if (email[0].length === 0) {
      res.send({
        data: "failed to update",
        emailError: "You have entered a wrong email",
      });
    } else if (password[0].length === 0) {
      res.send({
        data: "failed to update",
        prevPasswordError: "Previous password is not correct",
      });
    }
  } catch (err) {
    console.log(err);
  }
};
export default changepassword;
