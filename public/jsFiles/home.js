import { rankData,generateChart } from "./firebase.js";
const chartData = document.getElementById("chartData");
const leaderboardData = document.getElementById("leaderboardData");

document.getElementById('sortAura').addEventListener('click', () => {
    leaderboardData.classList.remove('hidden');
    chartData.classList.add('hidden');
    rankData("aura")
    document.getElementById('dataTypeTitle').innerHTML=`Users ranked by aura`;
});
document.getElementById('sortLikes').addEventListener('click', () => {
    leaderboardData.classList.remove('hidden');
    chartData.classList.add('hidden');
    rankData("thoughtLikes")
    document.getElementById('dataTypeTitle').innerHTML=`Users ranked by thought likes`;
});
document.getElementById('seeCharts').addEventListener('click', () => {
    chartData.classList.remove('hidden');
    leaderboardData.classList.add('hidden');
    document.getElementById('dataTypeTitle').innerHTML=`Charts`;
});
      
rankData("aura");
generateChart();


