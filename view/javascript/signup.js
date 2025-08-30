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


const signup = async(e)=>{
    try {
        e.preventDefault();
         const form = e.target;
      const data = {
        Username : form.elements[0].value,
        email:form.elements[1].value,
        password:form.elements[2].value
      }
     const senddata = await axios.post("/api/signup",data);

     if(senddata && senddata.data.message){
        new Swal({
            icon:"success",
            title:"Success",
            text:"User Created Successfully"
        }).then(()=>{
            window.location.href = "./Login.html"
        })
    } }catch (error) {
       new Swal({
        icon:"error",
        title:"Failed",
        text : error
       })
    }
  
}


