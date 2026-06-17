import { Pie } from "react-chartjs-2";

import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from "chart.js";


ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
);



function DomainChart({data}){


    const chartData = {

        labels: data.map(
            item => item.name
        ),


        datasets:[
            {
                label:"Startup Domains",

                data:data.map(
                    item => item.count
                )
            }
        ]

    };


    return(

        <div>

            <h2 className="text-xl font-semibold mb-4">
                Startup Domains
            </h2>


            <Pie data={chartData}/>


        </div>

    );

}


export default DomainChart;