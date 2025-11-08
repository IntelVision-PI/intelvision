const ctxDia = document.getElementById("requisicoesDia");
new Chart(ctxDia, {
  type: "bar",
  data: {
    labels: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"],
    datasets: [
      {
        label: "Requisições",
        data: [100000, 80000, 120000, 150000, 90000, 70000, 200000],
        backgroundColor: "#28a745",
        borderColor: "#145a32",
        borderWidth: 2,
      },
    ],
  },
  options: { responsive: true, plugins: { legend: { display: false } } },
});

// Gráfico de Requisições por hora
const ctxHora = document.getElementById("requisicoesHora");
new Chart(ctxHora, {
  type: "line",
  data: {
    labels: ["00-04", "04-08", "08-12", "12-16", "16-20", "20-24"],
    datasets: [
      {
        label: "Requisições",
        data: [5000, 10000, 8000, 15000, 12000, 20000],
        backgroundColor: "rgba(40,167,69,0.2)",
        borderColor: "#28a745",
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  },
  options: { responsive: true, plugins: { legend: { display: false } } },
});
