const text = `It goes without saying, books are our teachers and friends.
They teach us to be kind, clever, polite, hardworking, friendly.
Books help us to learn more about nature, the world around us and many other interesting things.
There are a lot of books on history, about animals, travellers, children, school and so on. Children like to read adventure and magic books, science fiction and detective stories.
They enjoy stories, short stories, novels, fairy-tales, fables and poems.
We must keep books clean and tidy. We must not spoil them.`

const inputElement = document.querySelector('#input')
const textExampleElement = document.querySelector('#textExample')

inputElement.value = ""

const lines = getLines(text)

let letterId = 1

let startMoment = null
let started = false

let letterCounter = 0
let letterCounter_error = 0

let inputLostFocus = false


init()
const isKeyPressed = event => ['Shift', 'Alt', 'AltGraph'].includes(event.key)

function init() {
 update()

 inputElement.focus()

 inputElement.addEventListener('keydown', function (event) {

  const currentLineNumber = getCurrentLineNumber()

  if (isKeyPressed(event)) {
   key = event.code
  } else {
   key = event.key
  }

  if (key.length < 2) {
   key = key.toLowerCase()
  }

  const element = document.querySelector('[data-key="' + key + '"]')
  const currentLetter = getCurrentLetter()

  if (event.key !== 'Shift') {
   letterCounter++
  }

  if (!started) {
   started = true
   startMoment = Date.now()
  }

  if (event.key.startsWith('F') && event.key.length > 1) {
   return
  }

  if (element) {
   element.classList.add('hint')
  }

  const isKey = event.key === currentLetter.original
  const isEnter = event.key === 'Enter' && currentLetter.original === '\n'

  if (isKey || isEnter) {
   letterId++
   update()
  } else {
   event.preventDefault()

   if (event.key !== 'Shift') {
    letterCounter_error++

    for (const line of lines) {
     for (const letter of line) {
      if (letter.original === currentLetter.original) {
       letter.success = false
      }
     }
    }
    update()
   }
  }

  if (currentLineNumber !== getCurrentLineNumber()) {
   inputElement.value = ''
   event.preventDefault()

   const time = Date.now() - startMoment
   document.querySelector('#wordsSpeed').textContent = Math.round(60000 * letterCounter / time)
   document.querySelector('#errorPercent').textContent = Math.floor(10000 * letterCounter_error / letterCounter) / 100 + '%'

   started = false
   letterCounter = 0
   letterCounter_error = 0
  }
 })

 inputElement.addEventListener('keyup', function (event) {
  if (isKeyPressed(event)) {
   key = event.code
  } else {
   key = event.key
  }

  if (key.length < 2) {
   key = key.toLowerCase()
  }

  const element = document.querySelector('[data-key="' + key + '"]')

  if (element) {
   element.classList.remove('hint')
  }
 })

 // Listening to the text field for the "loss of focus" event
 inputElement.addEventListener('blur', function () {
  // Setting the "focus loss" flag"
  inputLostFocus = true
 })

 // Listening to a web page on a keystroke
 document.addEventListener('keypress', function (event) {

  // If the focus loss flag is set, the text field gets focus
  if (inputLostFocus) {
   inputElement.focus()
   event.preventDefault()
  }

  // Resetting the "focus loss" flag
  inputLostFocus = false

 })
}

// Accepts a long string, returns an array of strings with information
function getLines(text) {
 const lines = []

 let line = []
 let idCounter = 0

 for (const originalLetter of text) {
  idCounter = idCounter + 1

  let letter = originalLetter

  if (letter === ' ') {
   letter = '°'
  }

  if (letter === '\n') {
   letter = '¶\n'
  }

  line.push({
   id: idCounter,
   label: letter,
   original: originalLetter,
   success: true
  })

  if (line.length >= 70 || letter === '¶\n') {
   lines.push(line)
   line = []
  }
 }

 if (line.length > 0) {
  lines.push(line)
 }
 return lines
}

// Accepts a string with objects with information and returns an html structure
function lineToHtml(line) {
 const divElement = document.createElement('div')

 divElement.classList.add('line')

 for (const letter of line) {
  const spanElement = document.createElement('span')

  spanElement.textContent = letter.label
  divElement.append(spanElement)

  if (letterId > letter.id) {
   spanElement.classList.add('done')
  } else if (!letter.success) {
   spanElement.classList.add('hint')
  }
 }

 return divElement
}

// Returns the current line number
function getCurrentLineNumber() {
 for (let i = 0; i < lines.length; i++) {
  for (const letter of lines[i]) {
   if (letter.id === letterId) {
    return i
   }
  }
 }
}

// Function for updating 3 displayed current lines #textExample
function update() {
 const currentLineNumber = getCurrentLineNumber()

 textExampleElement.innerHTML = ''

 for (let i = 0; i < lines.length; i++) {
  const html = lineToHtml(lines[i])

  textExampleElement.append(html)

  if (i < currentLineNumber || i > currentLineNumber + 2) {
   html.classList.add('hidden')
  }
 }
}

// Returns the symbol object expected by the program
function getCurrentLetter() {
 for (const line of lines) {
  for (const letter of line) {
   if (letterId === letter.id) {
    return letter
   }
  }
 }
}