
const auth = localStorage.getItem("auth");
let owner = null;

  window.onload = async()=>{
      try {
         
        const loginpathname = "/Staticfiles/Login.html";
        const Signuppathname = "/Staticfiles/Signup.html";

        if(!auth && (location.pathname === loginpathname || location.pathname === Signuppathname)) {
            return
        }

     if (!auth) {
   
      return (window.location.href = "/Staticfiles/login.html" );
   
   }
      const res =  await axios.post("/api/verify-token",{ token: auth })
      owner =res.data
      profilelook(res.data);

        
       if(location.pathname === loginpathname || location.pathname ===Signuppathname ){
          window.location.href = "/Staticfiles/DashBoard.html"
          
       }
            
            
      } catch (error) {
        console.log(error)
        localStorage.clear();
         window.location.href = "/Staticfiles/login.html"
      }

  }

  const logout =()=>{
      Swal.fire({
        icon: 'warning',
        title: 'Are you sure you want to logout?',
        showCancelButton: true,
        confirmButtonText: 'Logout',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          localStorage.removeItem("auth");
          window.location.href = "/Staticfiles/login.html";
        }
      });
    
  }
  


 const profilelook = (user) => {
  const username = document.querySelector("#username");
  const email = document.querySelector("#email");
  const profile_image = document.querySelector("#profile-pic");

  username.textContent = user.Username;
  email.textContent = user.email;
  profile_image.src = `http://localhost:7000/${user.picture}`;
};


const uploadPhoto = async (e) => {
  try {
    const inpute = e.target;
    const file = inpute.files[0];
    const formData = new FormData();
    formData.append("profilePic", file);

    const auth = localStorage.getItem("auth"); // ✅ make sure auth is defined
    const options = {
      headers: {
        Authorization: `Bearer ${auth}`,
      },
    };

    const fileupload = await axios.post("/api/upload-profile-pic", formData, options);
    localStorage.setItem("auth", fileupload.data.token);

    Swal.fire({
      icon: "success",
      title: "Profile updated",
    });

    window.location.reload();

  } catch (error) {
    console.error("Upload error:", error);

    Swal.fire({
      icon: "error",
      title: "Upload failed",
      text: error.response?.data?.message || "Something went wrong!",
    });
  }
};


function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const value = bytes / Math.pow(1000, i);
  return `${value.toFixed(2)} ${sizes[i]}`;
}

const openplanspage = () =>{
  const openpage = document.querySelector("#plans_page");
  openpage.classList.remove("hidden");
   document.getElementById("sidebar").classList.add("hidden");
  fetchpalns();
}

const closeplanpage = () => {
  const openpage = document.querySelector("#plans_page");
  openpage.classList.add("hidden");
  document.getElementById("sidebar").classList.remove("hidden");
}

const fetchpalns = async() =>{
const plans_holder = document.querySelector("#plans_holder");
 document.getElementById("plans_page").classList.remove("hidden");
  document.getElementById("sidebar").classList.add("hidden");

try {
  const options = {
    headers:{
      Authorization : `Bearer ${auth}`
    }
  };
  const {data} = await axios.get("http://localhost:7000/api/fetchplan",options);
plans_holder.innerHTML = "";
console.log(data);
   data.forEach((items)=>{
    const ui = `<div class="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-2xl transition-all">
        <h2 class="text-2xl font-bold text-blue-600">${items.planName}</h2>
        <p class="text-gray-700 mt-2">Price: ₹${items.planPrice}/month</p>
        <p class="text-gray-500 mt-1">Storage: ${formatBytes(items.Storage)}</p>
        <button class="mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition" onclick="buyplan('${items._id}')">Buy Now</button>
      </div>`
     plans_holder.innerHTML += ui;

   }) 

} catch (error) {
  Swal.fire({
      title: 'Fetching Plans...',
      text: 'Please wait while we load the subscription plans.',
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  
}


}

const buyplan=(id)=>{
  alert(id);
}

const fetchStorage = async() =>{
try {
  const Storage_Displayer = document.querySelector("#Storage_Displayer");
  const storage_progress_bar = document.querySelector("#storage_progress_bar");
  const storage_progress_bar_container = document.querySelector("#storage_progress_bar_container");

  const options = {
    headers:{
      Authorization : `Bearer ${auth}`
    }
  }

 const {data} = await axios.get("http://localhost:7000/api/fetchingstorage",options);

 const per = Math.floor((data.ConsumeStorage/data.OutOFStorage)*100);
 Storage_Displayer.innerHTML = `${formatBytes(data.ConsumeStorage)} out of ${ formatBytes(data.OutOFStorage)}` 


 if(per>95){
   storage_progress_bar.classList.remove("bg-blue-600");
   storage_progress_bar.classList.add("bg-red-600");
   
   storage_progress_bar_container_bar.classList.remove("bg-blue-300");
   storage_progress_bar_container.classList.add("bg-red-300");

 }
 storage_progress_bar.classList.add(`w-[${per}%]`)





} catch (error) {
  console.log(error)
}


}

fetchStorage();

  function toggleSidebar() {
      const sidebar = document.getElementById("sidebar");
      sidebar.classList.toggle("-translate-x-full");
    }
