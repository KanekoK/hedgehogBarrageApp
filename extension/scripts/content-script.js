/* global chrome, io */
(function () {
  // change to your server url
  const SERVER_URL = 'https://hedgehogs.site/'
  const APP_ID = chrome.runtime.id
  const APP_VERSION = chrome.runtime.getManifest().version

  let socket = null

  function connect () {
    const parent_dom = document.createElement('div')
    parent_dom.setAttribute('id', 'barrage')
    parent_dom.style.position = 'fixed'
    parent_dom.style.top = '0'
    parent_dom.style.height = '100%'
    parent_dom.style.left = '0'
    parent_dom.style.width = '100%'
    parent_dom.style.zIndex = 9999999999999999999
    parent_dom.style.pointerEvents = 'none'

    document.body.appendChild(parent_dom)

    if (socket) return

    socket = io.connect(SERVER_URL, { 'forceNew': true })
    socket.on('comment', handleComment)
    socket.on('like', handleLike)

    console.log(`Hedgehogs Barrage v${APP_VERSION}: connect to ${SERVER_URL}`)
    document.body.appendChild(parent_dom)
  }

  function disconnect () {
    if (!socket) return

    socket.disconnect()
    socket = null

    console.log(`Hedgehogs Barrage v${APP_VERSION}: disconnect from ${SERVER_URL}`)
  }

  function rand (value) {
    return Math.floor(value * Math.random())
  }

  function checkEnabled () {
    return new Promise(function (resolve, reject) {
      chrome.runtime.sendMessage({
        message: 'checkEnabled'
      }, function (response) {
        resolve(response.enabled)
      })
    })
  }

  function handleComment (msg) {
    const color = msg.color || '#000000'
    const shadow = msg.shadow || '#ffffff'
    const size = msg.size || 56

    const t = document.createElement('div')
    

    t.style.position = 'absolute'
    t.style.left = window.innerWidth + 'px'
    t.style.top = rand(window.innerHeight - 40) + 'px'
    t.style.fontSize = size + 'pt'
    t.style.fontWeight = 'bold'
    t.style.color = color
    t.style.textShadow = `-2px -2px 0px ${shadow}, -2px 2px 0px ${shadow}, 2px -2px 0px ${shadow}, 2px 2px 0px ${shadow}`
    t.style.whiteSpace = 'pre'
    t.style.zIndex = 99999999999999999

    t.innerText = msg.body
    if (document.getElementsByClassName("punch-full-screen-element").length){
      document.getElementsByClassName("punch-full-screen-element")[0].appendChild(t)
    }
    else{
      document.body.appendChild(t)
    }
    

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
      if (document.getElementsByClassName("punch-full-screen-element").length){
        document.getElementsByClassName("punch-full-screen-element")[0].removeChild(t)
      }
      else{
        document.body.removeChild(t)
      }
    }
    console.log("comment")
  }

  function handleLike (msg) {
    const image = msg.image || 'thumb' || 'heart'
    const url = msg.url || `chrome-extension://${APP_ID}/images/${image}.png`

    const t = document.createElement('img')

    t.addEventListener('load', function (e) {
      t.style.position = 'fixed'
      t.style.left = rand(window.innerWidth) - t.width / 2 + 'px'
      t.style.top = rand(window.innerHeight) - t.height / 2 + 'px'
      t.style.zIndex = 99999999999999999
      t.style.opacity = 0.0

      // document.body.appendChild(t)
      if (document.getElementsByClassName("punch-full-screen-element").length){
        document.getElementsByClassName("punch-full-screen-element")[0].appendChild(t)
      }
      else{
        document.body.appendChild(t)
      }


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
        if (document.getElementsByClassName("punch-full-screen-element").length){
          document.getElementsByClassName("punch-full-screen-element")[0].removeChild(t)
        }
        else{
          document.body.removeChild(t)
        }
      }
    })

    t.src = url

    console.log("like")
  }

  checkEnabled()
    .then(function (enabled) {
      if (enabled) {
        connect()
      } else {
        disconnect()
      }
    })

  return {
    connect: connect,
    disconnect: disconnect
  }
})()
