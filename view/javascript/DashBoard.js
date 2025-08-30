var options = {
    series: [44, 55, 13, 43, 22],
    chart: {
        width: 380,
        type: 'pie',
    },
    labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
    responsive: [{
        breakpoint: 480,
        options: {
            chart: {
                width: 200
            },
            legend: {
                position: 'bottom'
            }
        }

    }]
};

var chart = new ApexCharts(document.querySelector("#chart"), options);
chart.render();




const storefile = async()=>{
  
  try {
     const reportUi = document.querySelector("#report_container")
    const options =  {
        headers : {
            Authorization : `Bearer ${auth}`
        }
    }
    const {data} = await axios.get("http://localhost:7000/api/dashBoard",options);
    reportUi.innerHTML = "" ;
     data.forEach( (data) => {
        const ui = `<div class=" border border-zinc-400 rounded-lg p-2 flex flex-col items-center justify-center ">
            <i class="ri-file-fill text-3xl"></i>
            <h1> ${data._id} </h1>
            <h1 class="text-xl font-semibold">${formatBytes(data.totalsize)}</h1>
        </div>`

        reportUi.innerHTML += ui ;

  });



  } catch (error) {
     console.log("something went wrong");
     console.log(error)
  }




}

storefile();