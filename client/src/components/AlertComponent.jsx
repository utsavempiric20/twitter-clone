import Alert from "@mui/material/Alert";

const AlertComponent = ({ message }) => {
  return (
    <>
      <Alert
        severity="error"
        sx={{ position: "fixed", top: "5px", right: "30px" }}
      >
        {message}
      </Alert>
    </>
  );
};

export default AlertComponent;
