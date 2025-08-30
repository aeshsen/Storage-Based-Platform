window.onload = async () => {
  const auth = localStorage.getItem("auth");

  if (auth) {
    try {
      const response = await axios.post("/api/verify-token", { token: auth });
       console.log(response);
      if (response.data) {
        window.location.href = "/Staticfiles/DashBoard.html";
      }

    } catch (error) {
      console.log("Bad request");
    }
  }
  
  return;

};


const login = async (e) => {
  try {
    e.preventDefault();

    const form = e.target;
    const logindata = {
      email: form.elements[0].value,
      password: form.elements[1].value
    };

    const response = await axios.post("/api/login", logindata);

    if (response.data.token) {
      localStorage.setItem("auth", response.data.token);
      window.location.href = "/Staticfiles/DashBoard.html";
    }

  } catch (error) {
    console.log(error);

    const message = error?.response?.data?.message;

    if (message === "password not matched" || message === "User not found") {
      return Swal.fire({
        icon: "error",
        title: message
      });
    }

    Swal.fire({
      icon: "error",
      title: "Login Failed",
      text: "Something went wrong. Please try again."
    });
  }
};


