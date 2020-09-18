if('serviceWorker' in navigator){
    navigator.serviceWorker.register('/sw.js')
    .then(reg => console.log('Service worker registered successfully' + reg))
    .catch(err => console.log('Service worker registration unsuccessful' + err))

}