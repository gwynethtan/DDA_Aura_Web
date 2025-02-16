import { rankData,generateChart } from "./firebase.js";
const chartData = document.getElementById("chartData");
const leaderboardData = document.getElementById("leaderboardData");

// Shows and hide content
document.getElementById('sortAura').addEventListener('click', () => {
    leaderboardData.classList.remove('hidden');
    chartData.classList.add('hidden');
    rankData("aura") // Sorts aura leaderboard
    document.getElementById('dataTypeTitle').innerHTML=`Users ranked by aura`;
});
document.getElementById('sortLikes').addEventListener('click', () => {
    leaderboardData.classList.remove('hidden');
    chartData.classList.add('hidden');
    rankData("thoughtLikes") // Sorts thought likes leaderboard
    document.getElementById('dataTypeTitle').innerHTML=`Users ranked by thought likes`;
});
document.getElementById('seeCharts').addEventListener('click', () => {
    chartData.classList.remove('hidden');
    leaderboardData.classList.add('hidden');
    generateChart(); // Sorts chart leaderboard
    document.getElementById('dataTypeTitle').innerHTML=`Charts`;
});
      
rankData("aura"); // Aura leaderboard is shown first 

