import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TextField } from "@mui/material";
import { useMutation } from "react-query";
import axios from "axios";
import Swal from "sweetalert2";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import * as yup from "yup";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function UserPage({ isModalOpen, setIsModalOpen }) {
  const [newPasswordInputs, setNewPasswordInputs] = useState({
    email: "",
    prevPassword: "",
    newPassword: "",
  });
  const [errors, setErrors] = useState({});

  const schema = yup.object().shape({
    email: yup.string().required("This field is required"),
    prevPassword: yup.string().required("This field is required"),
    newPassword: yup.string().required("This field is required"),
  });

  const isValidInputs = async () => {
    try {
      await schema.validate(newPasswordInputs, { abortEarly: false });
      return true;
    } catch (err) {
      const newErrors = {};
      err.inner.forEach((e) => {
        newErrors[e.path] = e.message;
      });
      setErrors(newErrors);
      return false;
    }
  };

  const { data: isUpdatePassword, mutate: sendData } = useMutation(
    ({ newPasswordInputs }) =>
      axios
        .post(`http://localhost:3002/api/changepassword`, newPasswordInputs)
        .then((res) => res.data)
  );

  useEffect(() => {
    if (isUpdatePassword) {
      console.log("data", isUpdatePassword);
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      if (isUpdatePassword.data === "success") {
        setNewPasswordInputs({ email: "", prevPassword: "", newPassword: "" });
        Toast.fire({
          icon: "success",
          title: "Password changed successfully",
        });
        setIsModalOpen(false);
      } else if (
        isUpdatePassword.prevPasswordError &&
        isUpdatePassword.emailError
      ) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: isUpdatePassword.emailError,
          prevPassword: isUpdatePassword.prevPasswordError,
        }));
      } else if (isUpdatePassword.prevPasswordError) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          prevPassword: isUpdatePassword.prevPasswordError,
        }));
      } else if (isUpdatePassword.emailError) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: isUpdatePassword.emailError,
        }));
      }
    }
  }, [isUpdatePassword]);

  const handleSave = async () => {
    const valid = await isValidInputs();
    if (valid) {
      sendData({ newPasswordInputs: newPasswordInputs });
    }
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setErrors({});
    setNewPasswordInputs({
      email: "",
      prevPassword: "",
      newPassword: "",
    });
  };

  const handleOnChange = (e, field) => {
    setNewPasswordInputs((prevData) => ({
      ...prevData,
      [field]: e.target.value,
    }));
    setErrors((prevErrors) => ({ ...prevErrors, [field]: "" }));
  };

  return (
    <React.Fragment>
      <Dialog
        open={isModalOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>
          To change the password please enter the below details
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <div>
              <TextField
                fullWidth
                style={{ marginTop: "20px" }}
                label="Email"
                name="email"
                value={newPasswordInputs.email}
                onChange={(e) => handleOnChange(e, e.target.name)}
                helperText={errors.email}
                error={Boolean(errors.email)}
              />
            </div>
            <div>
              <TextField
                fullWidth
                style={{ marginTop: "20px" }}
                label="Previous Password"
                name="prevPassword"
                value={newPasswordInputs.prevPassword}
                onChange={(e) => handleOnChange(e, e.target.name)}
                helperText={errors.prevPassword}
                error={Boolean(errors.prevPassword)}
              />
            </div>
            <div>
              <TextField
                fullWidth
                style={{ marginTop: "20px" }}
                label="New Password"
                name="newPassword"
                value={newPasswordInputs.newPassword}
                onChange={(e) => handleOnChange(e, e.target.name)}
                helperText={errors.newPassword}
                error={Boolean(errors.newPassword)}
              />
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions style={{ display: "flex", margin: "0px 14px 10px 0px" }}>
          <Button
            onClick={handleSave}
            variant="outlined"
            startIcon={<SaveIcon />}
          >
            Save
          </Button>
          <Button
            onClick={handleClose}
            variant="outlined"
            startIcon={<CancelIcon />}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
