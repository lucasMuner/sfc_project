var temperaturaData = [];
var umidadeData = [];
var lumiData = [];

var ctx = document.getElementById('chartTemp');
var chartTemp = new Chart(ctx, {
  type: 'line',
  data: {
    labels: ["1","2","3","4","5","6","7","8","9","10"], // Inicialmente, nenhum rótulo
    datasets: [{
      label: 'Temperatura',
      data: temperaturaData, // Usará os dados de temperatura
      borderWidth: 1,
      borderColor: 'rgba(255, 99, 132, 1)', // Cor da linha (R, G, B, A)
      pointBackgroundColor: 'rgba(255, 99, 132, 1)', // Cor do ponto (R, G, B, A)
    }]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});

var cty = document.getElementById('chartUmidade');
var chartUmidade = new Chart(cty, {
  type: 'line',
  data: {
    labels: ["1","2","3","4","5","6","7","8","9","10"], // Inicialmente, nenhum rótulo
    datasets: [{
      label: 'Umidade',
      data: umidadeData, // Usará os dados de umidade
      borderWidth: 1,
    }]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});

var ctz = document.getElementById('chartLuminosidade');
var chartLumi = new Chart(ctz, {
  type: 'line',
  data: {
    labels: [], // Inicialmente, nenhum rótulo
    datasets: [{
      label: 'Luminosidade',
      data: lumiData, // Usará os dados de luminosidade
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 0, 1)', // Cor da linha para luminosidade (R, G, B, A)
      pointBackgroundColor: 'rgba(255, 255, 0, 1)', // Cor do ponto para luminosidade (R, G, B, A)
    }]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});

function updateChart(newData, graph, dadosArr) {
  // Adicione o novo valor ao array de dados
  dadosArr.push(newData);

  // Limita o número de pontos no gráfico para, por exemplo, mostrar apenas os últimos 10 valores
  if (dadosArr.length > 10) {
    dadosArr.shift();
  }

  // Atualiza os rótulos e dados do gráfico
  graph.data.labels = Array.from({ length: dadosArr.length }, (_, i) => (i + 1).toString());
  graph.data.datasets[0].data = dadosArr;

  // Atualize o gráfico
  graph.update();
}

function fetchDataDataBase() {
  fetch('https://api-sfc.vercel.app/dados')
    .then(response => response.json())
    .then(data => {
      console.log(data);

      // Atualizações de elementos HTML
      document.querySelector("#umidade").textContent = `Umidade: ${data.umidade} %`;
      document.querySelector("#temperatura").textContent = `Temperatura: ${data.temperatura} °C`;
      document.querySelector("#luminosidade").textContent = `Luminosidade: ${data.luminosidade} Lux`;
      document.querySelector("#setPointTemp").textContent = `SP Temperatura: ${data.setPointTemperatura} °C`;

      // Atualizações dos gráficos
      updateChart(data.temperatura, chartTemp, temperaturaData);
      updateChart(data.umidade, chartUmidade, umidadeData);
      updateChart(data.luminosidade, chartLumi, lumiData);

      const resetCheckbox = document.getElementById('cb3-8');
      const lampCheckbox = document.getElementById('cb3-7');

      const form = document.querySelector("form");
      resetCheckbox.checked = data.resetarEsp;
      lampCheckbox.checked = data.lampadaLigada;

      form.addEventListener('submit', (event) => {
        event.preventDefault();

        const setPointTempInput = document.getElementById("setPointTempInput");
        const isResetChecked = resetCheckbox.checked;
        const isLampChecked = lampCheckbox.checked;
        let newSetPoints = {
          lampadaLigada: isLampChecked,
          resetarEsp: isResetChecked,
          setPointTemperatura: setPointTempInput.value
        };

        fetch(`https://api-sfc.vercel.app/atualizar-set`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newSetPoints),
        })
          .then(response => {
            if (response.ok) {
              return response.json();
            } else {
              throw new Error('Falha na atualização');
            }
          })
          .then(data => {
            console.log(data.mensagem);
            setPointTempInput.value = '';
          })
          .catch(error => {
            console.error(error);
          });
      });
    })
    .catch(error => {
      console.error('Erro na requisição:', error);
    });
}

// Chama a função fetchDataDataBase para atualizar os dados e gráficos inicialmente
fetchDataDataBase();

setInterval(fetchDataDataBase, 10000);

// Chama a função fetchDataDataBase a cada 10000 milissegundos (10 segundos)
