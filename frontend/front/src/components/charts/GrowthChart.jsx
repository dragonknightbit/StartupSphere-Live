import {
Line
} from "react-chartjs-2";


import {
Chart as ChartJS,
CategoryScale,
LinearScale,
PointElement,
LineElement
}
from "chart.js";


ChartJS.register(
CategoryScale,
LinearScale,
PointElement,
LineElement
);



function GrowthChart({data}){


const chartData={

labels:data.map(
item=>item.month
),


datasets:[

{
label:"Startups Created",

data:data.map(
item=>item.startups
)

}

]

}



return(

<div>

<Line data={chartData}/>

</div>

)


}


export default GrowthChart;