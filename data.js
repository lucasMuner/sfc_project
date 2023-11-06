

const temperaturaData = [];
const ctx = document.getElementById('myChart');
const chart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: ["1","2","3","4","5","6","7","8","9","10"], // Inicialmente, nenhum rótulo
    datasets: [{
      label: 'Temperatura',
      data: temperaturaData, // Usará os dados de temperatura
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

function updateTemperatureChart(newTemperature) {
  // Adicione o novo valor ao array de dados de temperatura
  temperaturaData.push(newTemperature);

  // Limita o número de pontos no gráfico para, por exemplo, mostrar apenas os últimos 10 valores
  if (temperaturaData.length > 10) {
    temperaturaData.shift();
  }
  // Atualize o gráfico
  chart.update();
}

function fetchDataDataBase(){
  fetch('https://api-sfc.vercel.app/dados')
  .then(response => response.json())
  .then(data => {
    console.log(data); // Os dados da rota /dados serão exibidos no console
    document.querySelector("#umidade").textContent = `Umidade: ${data.umidade} %`;
    document.querySelector("#temperatura").textContent = `Temperatura: ${data.temperatura} °C`;
    document.querySelector("#luminosidade").textContent = `Luminosidade: ${data.luminosidade} Lux`;
    document.querySelector("#setPointTemp").textContent = `SP Temperatura: ${data.setPointTemperatura} °C`;

    updateTemperatureChart(data.temperatura);
    
    const form = document.querySelector("form");

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    
    // Obtenha os novos valores dos campos de input
    const setPointTempInput = document.getElementById("setPointTempInput");

    const newSetPoints = {
      setPointTemperatura: setPointTempInput.value,
    };
    
    // Faça a solicitação fetch para atualizar o banco de dados com os novos valores
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
      console.log(data.mensagem); // Deve imprimir "Set-Point alterado com sucesso" se a atualização for bem-sucedida
      setPointTempInput.value = '';
    })
    .catch(error => {
      console.error(error); // Trate erros aqui, se necessário
    });
  });


    

      
    
  })
  .catch(error => {
    console.error('Erro na requisição:', error);
  });

}

fetchDataDataBase();

setInterval(fetchDataDataBase, 10000);