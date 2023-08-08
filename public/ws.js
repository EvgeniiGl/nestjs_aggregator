(() => {
    const socket = io.connect('http://localhost:3001');
    socket.on('connect', () => {
        console.log('connected')
    })

    socket.emit('getAllMessages', '64d078daf16fa9bf71bca98c')
    socket.emit('subscribeToChat', '64d078daf16fa9bf71bca98c')

    socket.on('all-messages', (msg) => {
        console.log(msg)
    })

    socket.on('new-message', (m) => {
        console.log(m)
    })

})();