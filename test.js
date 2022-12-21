const fs = require('fs')

const dossier = 'public/lessons'
const array = fs.readdirSync(dossier)
console.log(array)