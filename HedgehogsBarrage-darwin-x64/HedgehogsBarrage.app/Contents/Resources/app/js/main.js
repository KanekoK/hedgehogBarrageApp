const ipcRenderer = require('electron').ipcRenderer;

moment.locale('ja');


let ctx = document.getElementById("myChart").getContext('2d');
ctx.canvas.height = 250;

let type = 'line';

let comments = [];
let times = [];

let heartCount = 0;
let goodCount = 0;
ipcRenderer.on('set_data', function(event, data) {
    heartCount = data.heart
    goodCount = data.good
});

let data = {
    labels: times,
    datasets: [{
      label: 'いいね数',
      borderColor: 'rgb(54, 162, 235)',
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
      lineTension: 0,
      data_type: 'good',
    },
    {
      label: 'ハート数',
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
      lineTension: 0,
      data_type: 'like',
    },
  ]

};

function engagement(data_type) {
  if (data_type == "good") {
    // ここの数をリアルタイムに変更する
    return goodCount;
  } else {
    // ここの数をリアルタイムに変更する
    return heartCount;
  }
}

let options = {
  scales: {
    xAxes: [{
      scaleLabel: {
        display: true,
        fontColor: '#e0e0e0',
      },
      type: 'realtime',
      realtime: {
        onRefresh: function(chart) {
          chart.data.datasets.forEach(function(dataset) {
            dataset.data.push({
              x: Date.now(),
              y: engagement(dataset.data_type),
            });
          });
        },
        delay: 2000,
      }
    }],
    yAxes: [{
      ticks: {
        suggestedMax: 50,
        min: 0
        // stepSize: 20
      }
    }]
  },
  title: {
    display: false,
    text: 'コメント数'
  },
  plugins: {
    streaming: {
      duration: 50000,
    }
  }
};

let myChart = new Chart(ctx, {
    type: type,
    data: data,
    options: options
});


// ======== //

ipcRenderer.on('comment', function(event, comment) {
  comment = comment.body;
  let time = moment().format('HH:mm:ss');
  $comments = $('#comments');
  $comments.append('<li>' + time + "        " + comment + '</li>');
  // コメント欄、自動スクロール
  $comments.animate({scrollTop: $comments[0].scrollHeight}, 'fast');
});


