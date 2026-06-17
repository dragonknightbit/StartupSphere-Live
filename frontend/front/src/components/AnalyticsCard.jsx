function AnalyticsCard({title,value}){


return(

<div className="bg-white shadow-md rounded-xl p-5">

<h2 className="text-gray-500">
{title}
</h2>


<h1 className="text-3xl font-bold">
{value}
</h1>


</div>


)

}


export default AnalyticsCard;