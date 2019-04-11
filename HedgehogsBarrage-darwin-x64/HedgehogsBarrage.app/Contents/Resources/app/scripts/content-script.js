const ipcRenderer = require('electron').ipcRenderer;


(function () {

  // change to your server url
  const SERVER_URL = 'https://hedgehogs.site'

  // const APP_ID = chrome.runtime.id
  // const APP_VERSION = chrome.runtime.getManifest().version

  let socket = null
  let heart_count = 0
  let good_count = 0

  function connect (comment) {
    //  コメントON/OFFでコネクトを切り替える
    if (!comment) {
      socket.disconnect();
      socket = io.connect(SERVER_URL, { 'forceNew': true })
      socket.on('like', handleLike)
    } else {
      socket = io.connect(SERVER_URL, { 'forceNew': true })
      socket.on('comment', handleComment)
      socket.on('like', handleLike)
    }

    // console.log(`Hedgehogs Barrage v${APP_VERSION}: connect to ${SERVER_URL}`)
  }

  function disconnect () {
    if (!socket) return

    socket.disconnect()
    socket = null

    // console.log(`Hedgehogs Barrage v${APP_VERSION}: disconnect from ${SERVER_URL}`)
  }

  function rand (value) {
    return Math.floor(value * Math.random())
  }

  ipcRenderer.on('border_transparent', function() {
    let border = document.body.style;
    border.boxShadow = "0 0 0 0";
    document.getElementById('menu').style.display = "none";
  })

  ipcRenderer.on('border_visual', function() {
    let border = document.body.style;
    border.boxShadow = "0 0 0 5px rgb(15, 77, 31) inset";
    document.getElementById('menu').style.display = "block";
  })

  function handleComment (msg) {
    const color = msg.color || '#000000'
    const shadow = msg.shadow || '#ffffff'
    const size = msg.size || 56

    const t = document.createElement('div')

    t.style.position = 'fixed'
    t.style.left = window.innerWidth + 'px'
    t.style.top = rand(window.innerHeight - 40) + 'px'
    t.style.fontSize = size + 'pt'
    t.style.fontWeight = 'bold'
    t.style.color = color
    t.style.textShadow = `-2px -2px 0px ${shadow}, -2px 2px 0px ${shadow}, 2px -2px 0px ${shadow}, 2px 2px 0px ${shadow}`
    t.style.whiteSpace = 'pre'
    t.style.zIndex = 2147483647

    t.innerText = msg.body

    document.body.appendChild(t)

    const effect = [{
      left: window.innerWidth + 'px'
    }, {
      left: -t.offsetWidth + 'px'
    }]

    const timing = {}
    timing.duration = (msg.duration || 2000) * (window.innerWidth + t.offsetWidth) / window.innerWidth
    timing.iterations = 1
    timing.easing = msg.easing || 'linear'

    t.style.top = rand(window.innerHeight - t.offsetHeight) + 'px'

    t.animate(effect, timing).onfinish = function () {
      document.body.removeChild(t)
    }
    ipcRenderer.send('comment', msg);
  }

  function handleLike (msg) {
  
    const image = msg.image || 'thumb' || 'heart'
    const url = msg.url || `images/${image}.png`

    const t = document.createElement('img')

    t.addEventListener('load', function (e) {
      t.style.position = 'fixed'
      t.style.left = rand(window.innerWidth) - t.width / 2 + 'px'
      t.style.top = rand(window.innerHeight) - t.height / 2 + 'px'
      t.style.zIndex = 2147483647
      t.style.opacity = 0.0

      document.body.appendChild(t)

      const effect = [{
        opacity: 0.0,
        transform: 'scale(0.2, 0.2) translate(0, 20px)'
      }, {
        opacity: 1.0,
        transform: 'scale(0.5, 0.5) translate(0, 0px)'
      }, {
        opacity: 0.0,
        transform: 'scale(1.0, 1.0) translate(0, -50px)'
      }]

      const timing = {}
      timing.duration = msg.duration || 1000
      timing.iterations = 1
      timing.easing = msg.easing || 'ease'

      t.animate(effect, timing).onfinish = function () {
        document.body.removeChild(t)
      }
    })
    t.src = url

    handleLikeCount(msg.image)
  }


  function handleLikeCount(msg){
    const domHeartCount = document.getElementById("heart_count")
    const domGoodCount = document.getElementById("good_count")
    if (msg == "thumb"){
      good_count++
    }
    if (msg == "heart"){
      heart_count++
    }
    var count ={
      "good_count":good_count,
      "heart_count":heart_count
    }
    data = {'heart': count.heart_count, 'good': count.good_count}
    ipcRenderer.send('engagement', data)
    domHeartCount.innerHTML = count.heart_count
    domGoodCount.innerHTML = count.good_count
  }

  let comment = true;
  $('#comments input[name="comment"]').on('click', function () {
    let val = $(this).val();
    comment = (val == 'on' ? true : false);

    connect(comment);
  });
  connect(comment);

  return {
    connect: connect,
    disconnect: disconnect
  }
})()


