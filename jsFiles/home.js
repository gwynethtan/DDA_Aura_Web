import { rankData,generateChart } from "/DDA_Aura_Web/jsFiles/firebase.js";
const chartData = document.getElementById("chartData");
const leaderboardData = document.getElementById("leaderboardData");


     

document.getElementById('sortAura').addEventListener('click', () => {
    leaderboardData.classList.remove('hidden');
    chartData.classList.add('hidden');
    rankData("aura")
});
document.getElementById('sortLikes').addEventListener('click', () => {
    leaderboardData.classList.remove('hidden');
    chartData.classList.add('hidden');
    rankData("thoughtLikes")
});
document.getElementById('seeCharts').addEventListener('click', () => {
    chartData.classList.remove('hidden');
    leaderboardData.classList.add('hidden');
});
      
rankData("aura");
generateChart();


