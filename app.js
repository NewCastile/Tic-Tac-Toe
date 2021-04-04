const form = document.querySelector('.players-form')
const card = document.querySelector('.card')
const board = document.querySelector('.board')

const proto =  {
    'mark':'', 
    'won': 0, 
    'lose': 0
}

const users = {
    "create": function (names) {
        this.player1 = Object.assign({}, proto, {'name': names[0], 'mark': 'X'})
        this.player2 = Object.assign({}, proto, {'name': names[1], 'mark': 'O'})
        }
}

const DomLogic = function() {
    function show(element) {
    element.style.display = 'flex'
    }
    
    function hide(element) {
        element.style.display = 'none'
    }

    function getFormValues(form) {
        let inputs = form.elements
        inputs = Array.from(inputs)
        inputs = inputs.filter(input => input.type != "submit")
        inputs = inputs.map(input => input.value)
        return inputs
    }

    function startGame(event) {
        event.preventDefault()
        let players = getFormValues(form)
        users.create(players)
        counter.createCounter()
        hide(form)
        show(card)
    }

    form.addEventListener("submit", startGame)
}()

//PubSub module
const pubsub = (function() {
    let subscribers = {}

    const subscribe = function(name, fn) {
        subscribers[name] = subscribers[name] || []
        subscribers[name].push(fn)
    }

    const unsubscribe = function(name, fn) {
        if(!subscribers[name]) return
        const index = subscribers[name].indexOf(fn)
        subscribers[name] = subscribers[name].slice(0, index)
        .concat(subscribers[name].slice(index+1))
    }

    const publish = function(fn, arg) {
        if(!subscribers[fn]) return
        subscribers[fn].forEach(fn => fn(arg))
    }

    return { subscribers, subscribe, unsubscribe, publish }
})()

//gameboard module
const gameboard = (function () {
    let state = [null, null, null,
                null, null, null,
                null, null, null]

    function render() {
        let cells = document.querySelectorAll('.column')
        for (let i = 0; i < cells.length; i++) {
            cells[i].innerText = state[i]
        }
    }

    function makeMove(event) {
        if (event.target.classList.contains('column')) {
            gameController.move(event.target)
        }
    }

    function reset() {
        for (let i = 0; i < state.length; i++) {
            state[i] = null
        }
        render()
    }

    document.querySelector('.restart-btn').addEventListener('click', reset)
    document.querySelector('.board').addEventListener('click', makeMove)
    return { state , render, reset }
})()

//gameController module
const gameController = (function() {
    let currentBoard = gameboard.state
    let index = 1
    
    const rowIndex = {
        'first-row': 0,
        'second-row': 3,
        'third-row': 6
    }
    const columnIndex = {
        'first-column': 0,
        'second-column': 1,
        'third-column': 2
    }

    function move(target) {
        if (target.innerText !== ''|| null || undefined) {
            return
        }
        let currPlayer = getCurrentPlayer()
        const cell = target
        const place = {
            'row': cell.parentElement.classList[1],
            'column': cell.classList[1]
        }
        const cellColumn = columnIndex[place.column]
        const cellRow = rowIndex[place.row];
        gameboard.state[cellColumn+cellRow] = currPlayer.mark
        gameboard.render()
        checkForWinner.check(currPlayer)
    }

    function getCurrentPlayer() {
        index = index == 1 ? 0 : 1
        return [users.player1, users.player2][index]
    }

    return { move, currentBoard }
})()

// checkForWinner module
const checkForWinner = (function() {
    let board = gameController.currentBoard

    pubsub.subscribe("winner", function (player) {
        if (player === users.player1) {
            return users.player1.won++, users.player2.lose++
        }
        users.player1.lose++
        users.player2.won++
    })
    
    function check(player) {
        if (tie(player) || threeInARow(player)) {
            pubsub.publish("winner", player)
            gameboard.reset()
        }
        if (draw()) {
            pubsub.publish("noWinner")
            gameboard.reset()
        }
    }

    function tie(player) {
        let ties = {
            'slash': [].concat(board[2], board[4], board[6]),
            'backslash': [].concat(board[0], board[4], board[8])
        }
        for (let line in ties) {
            if (ties[line].every(mark => mark == player.mark)) {
                return true
            }
        }
    }

    function threeInARow(player) {
        const rowLine = {
            'first': board.slice(0, 3),
            'second': board.slice(3, 6),
            'third': board.slice(6)
        }
        const columnLine = {
            'first': [].concat(rowLine.first[0], rowLine.second[0], rowLine.third[0]),
            'second': [].concat(rowLine.first[1], rowLine.second[1], rowLine.third[1]),
            'third': [].concat(rowLine.first[2], rowLine.second[2], rowLine.third[2])
        }
        for (let line in rowLine) {
            if (rowLine[line].every(mark => mark == player.mark)) {
                return true
            }
        }
        for (let line in columnLine) {
            if (columnLine[line].every(mark => mark == player.mark)) {
                return true
            }
        }
    }

    function draw() {
        if (gameboard.state.every(e => e !== null||undefined)) {
            return true
        }
    }

    return { check }
})()

//Messages module
const message = (function() {
    let element = document.createElement('div')
    element.classList.add("notification")

    pubsub.subscribe("winner", function(player) {
        element.innerHTML = `<h1 class="winner">${player.name} Won!</h1>`
        document.querySelector('.content').appendChild(element)
        setTimeout(function () {
            document.querySelector('.notification').remove();
        }, 1000)
    })

    pubsub.subscribe("noWinner", function() {
        element.innerHTML = `<h1 class="draw">It's a Draw!</h1>`
        document.querySelector('.content').appendChild(element)
        setTimeout(function () {
            document.querySelector('.notification').remove();
        }, 1000)
    })

})()

//Counter module
const counter = (function() {
    function createCounter() {
        let element = document.createElement('div')
        element.classList.add('counter')
        element.innerHTML = `
            <span>${users.player1.name}: ${users.player1.won}</span>
            <span>${users.player2.name}: ${users.player2.won}</span>
        `
        card.insertBefore(element, board)
    }

    pubsub.subscribe("winner", function(){
        document.querySelector('.counter').innerHTML = `
            <span>${users.player1.name}: ${users.player1.won}</span>
            <span>${users.player2.name}: ${users.player2.won}</span>
        `
    })
    return { createCounter }
})()