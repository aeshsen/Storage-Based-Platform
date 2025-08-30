
   
const UploadFile = async (e) => {
  try {
    const parentprogressbar = document.querySelector("#parent_progressbar");
    const progressbar = document.querySelector("#progress_bar");
    const uploadedVal = document.querySelector("#uploadvalue");
    const filename = document.querySelector("#fileinfo");

    const input = e.target;
    const file = input.files[0];

    parentprogressbar.classList.remove("hidden");
    filename.textContent = file.name;

    const formData = new FormData();
    formData.append("uploadfile", file);

    const options = {
      headers: {
        Authorization: `Bearer ${auth}`
      },
      onUploadProgress: (progressEvent) => {
        const loadedBytes = progressEvent.loaded;
        const totalBytes = progressEvent.total;

        
        const loadedFormatted = formatBytes(loadedBytes);
        const totalFormatted = formatBytes(totalBytes);
        const percent = Math.floor((loadedBytes / totalBytes) * 100);

        progressbar.style.width = percent + "%";
        uploadedVal.textContent = `${percent}% uploaded (${loadedFormatted} of ${totalFormatted})`;
      }
    };

    const res = await axios.post("http://localhost:7000/api/upload-File", formData, options);

    if (!res) {
      return new Swal({
        icon: "error",
        title: "Something went Wrong"
      });
    }

    new Swal({
      icon: "success",
      title: "Upload Successfully",
    }).then(() => {
      progressbar.style.width = "0%";
      uploadedVal.textContent = "";
      filename.textContent = "";
      parentprogressbar.classList.add("hidden");
      window.location.reload();
    });

  } catch (error) {
    new Swal({
      icon: "error",
      title: "Failed to Upload"
    });
  }
};

const fetchingfiles = async () => {
  try {
    const table = document.querySelector("#table");
    const options = {
      headers: {
        Authorization: `Bearer ${auth}`,
      },
    };

    const res = await axios.get("http://localhost:7000/api/fetchFile", options);
    const files = res.data;



    if (!files || files.length === 0) {
      return new Swal({
        icon: "info",
        title: "No files are uploaded yet",
      });
    }
    table.innerHTML = "";

    files.forEach((file, index) => {
      const tr = `
        <tr>
          <td class="text-left p-2 py-3 border-b">${index + 1}</td>
          <td class="text-left p-2 py-3 border-b">${file.filename}</td>
          <td class="text-left p-2 py-3 border-b">${formatBytes(file.Size)}</td>
          <td class="text-left p-2 py-3 border-b">${file.type}</td>
          <td class="text-left p-2 py-3 border-b text-[13px] font-semibold">${moment(file.createdAt).format("DD MMM YYYY hh:mm:ss a")}</td>
          <td class="text-left p-2 py-3 border-b">
            <div class="flex space-x-6 bg-white rounded-xl">
              <button class="flex flex-col items-center text-red-600 hover:text-red-700 hover:scale-110 transition-all duration-300 cursor-pointer" onclick="deleteFile('${file._id}')">
                <i class="ri-delete-bin-6-line text-xl"></i>
                <span class="text-xs mt-1">Delete</span>
              </button>

              <button class="flex flex-col items-center text-blue-600 hover:text-blue-700 hover:scale-110 transition-all duration-300 cursor-pointer" onclick="sharefile('${file.filename}','${file.filepath}')" >
                <i class="ri-share-line text-xl"></i>
                <span class="text-xs mt-1">Share</span>
              </button>

              <button class="flex flex-col items-center text-green-600 hover:text-green-700 hover:scale-110 transition-all duration-300 cursor-pointer" onclick="downoldFile('${file.filename}','${file.filepath}')">
                <i class="ri-download-2-line text-xl"></i>
                <span class="text-xs mt-1">Download</span>
              </button>
            </div>
          </td>
        </tr>
      `;
      table.innerHTML += tr;
    });

  } catch (error) {
   
    new Swal({
      icon: "error",
      title: "Failed to Fetch Files"
    });
  }
};

fetchingfiles();


const deleteFile = async(id) =>{
  try {
       
       const option = {
        headers:{
            Authorization:`Bearer ${auth}`
        }
       }
       const res = await axios.delete(`http://localhost:7000/api/deleteFile/${id}`,option);

       if(!res){
    new Swal({
      icon: "error",
      title: "Failed to delete"
    });
       }

    new Swal({
      icon: "success",
      title: "Delete File successfully"
    }).then(()=>{
        window.location.reload();
    })

    
  } catch (error) {
    
    new Swal({
      icon: "error",
      title: "Failed to Fetch Files"
    });
  }
 

}

const downoldFile = async (filename , path) => {
  try {

    const options = {
      headers: {
        Authorization: `Bearer ${auth}`,
      },
      responseType: 'blob', 
    };


    const {data} = await axios.post("http://localhost:7000/api/downold", {path}, options);
       if(!data){
          new Swal({
      icon: "error",
      title: "File is found",
    });
       }

     const urlpath =   URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = urlpath,
      a.download = filename
 
      a.click();

        new Swal({
      icon: "success",
      title: "File is downolding",}).then(()=>{

        a.remove();
      URL.revokeObjectURL(urlpath);

      })

   


  } catch (error) {
    new Swal({
      icon: "error",
      title: "Failed to download",
    });
  }
};



const sharefile = (filename, filepath) => {
  const drawer = document.querySelector("#drawer");
  drawer.classList.remove('translate-x-full');
  drawer.classList.add('translate-x-0');

  let ownername = document.querySelector("#ownername");
  let owneremail = document.querySelector("#owneremail");
   let sendfilename = document.querySelector("#sendfilename");
   let sendfilepath = document.querySelector("#sendfilepath");
   ownername.value = owner.Username ;
   owneremail.value = owner.email;
   sendfilename.value = filename;
   sendfilepath.value = filepath;
  
};


const closedrawer = () => {
  const drawer = document.querySelector("#drawer");
  drawer.classList.remove('translate-x-0');
  drawer.classList.add('translate-x-full');
};

const senddatatomail=async(e)=>{

  try {
    const sendbtn = document.querySelector("#sendbtn");
    const sendingbtn = document.querySelector("#sendingbtn");
     const sendform = document.querySelector("#sendform");

      sendingbtn.classList.remove("hidden");
      sendbtn.classList.add("hidden");


      e.preventDefault();
    const form = e.target;
    const data = {
      useremail : form[0].value,
      Username : form[1].value,
      sendername : form[2].value,
      senderemail : form[3].value,
       filename : form[4].value,
       filepath :form[5].value

    }

    const options = {
      headers:{
        Authorization : `Bearer ${auth}`
      }
    }
    
     const res = await axios.post("http://localhost:7000/api/share",data,options);
    if(!res){
         new Swal({
      icon:"error",
      title:"Something went wrong"
    })
    }

     sendbtn.classList.remove("hidden");
     sendingbtn.classList.add("hidden");
  
    sendform.reset();
    closedrawer();

     Swal.fire({
  icon: "success",
  title: "✅ File Sent Successfully!",
  html: "We've emailed the file to the recipient. <br>Please ask them to check their inbox (and spam folder).",
  confirmButtonText: "Got it!",
  confirmButtonColor: "#28a745",
  timer: 5000,
  timerProgressBar: true
    });



  } catch (error) { 
    new Swal({
      icon:"error",
      title:"Failed to sent file"
    })
    console.log(error)
  }
 

   
}






