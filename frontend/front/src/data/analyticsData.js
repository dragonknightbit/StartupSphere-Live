const analyticsData = {
    overview: {
        users: 120,
        startups: 45,
        mentors: 30,
        investors: 50
    },

    startupGrowth: [
        { month: "Jan", startups: 10 },
        { month: "Feb", startups: 18 },
        { month: "Mar", startups: 25 },
        { month: "Apr", startups: 45 }
    ],

    domains: [
        { name: "AI", count: 15 },
        { name: "Healthcare", count: 10 },
        { name: "FinTech", count: 8 },
        { name: "Agriculture", count: 12 }
    ],

    funding: {
        total: 5000000,
        startups: [
            { name: "AgroAI", amount: 200000 },
            { name: "HealthBot", amount: 150000 },
            { name: "FinTechX", amount: 100000 }
        ]
    }
};

export default analyticsData;