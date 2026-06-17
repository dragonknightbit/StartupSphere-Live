import AnalyticsCard from "../components/AnalyticsCard";
import GrowthChart from "../components/charts/GrowthChart";
import DomainChart from "../components/charts/DomainChart";
import FundingChart from "../components/charts/FundingChart";
import analyticsData from "../data/analyticsData";


function AdminDashboard(){

return(

<div className="p-8 bg-gray-100 min-h-screen">


<h1 className="text-4xl font-bold mb-8">
StartupSphere Analytics
</h1>



<div className="grid md:grid-cols-4 gap-5">


<AnalyticsCard
title="Users"
value={analyticsData.overview.users}
/>


<AnalyticsCard
title="Startups"
value={analyticsData.overview.startups}
/>


<AnalyticsCard
title="Mentors"
value={analyticsData.overview.mentors}
/>


<AnalyticsCard
title="Investors"
value={analyticsData.overview.investors}
/>


</div>




<div className="grid md:grid-cols-2 gap-8 mt-10">


<div className="bg-white p-6 rounded-xl shadow">

<GrowthChart
data={analyticsData.startupGrowth}
/>

</div>



<div className="bg-white p-6 rounded-xl shadow">

<DomainChart
data={analyticsData.domains}
/>

</div>


</div>




<div className="bg-white p-6 rounded-xl shadow mt-10">

<FundingChart
data={analyticsData.funding.startups}
/>


</div>



</div>


)

}


export default AdminDashboard;