import {
Bar
} from "react-chartjs-2";


import {
Chart as ChartJS,
CategoryScale,
LinearScale,
BarElement,
Tooltip,
Legend
}
from "chart.js";


ChartJS.register(
CategoryScale,
LinearScale,
BarElement,
Tooltip,
Legend
);



function FundingChart({data}){


const chartData={


labels:data.map(
item=>item.name
),


datasets:[

{

label:"Funding Required",

data:data.map(
item=>item.amount
)

}

]


}



return(

<div>

<h2 className="text-xl font-semibold mb-4">

Funding Requirement

</h2>


<Bar data={chartData}/>


</div>

)


}


export default FundingChart;