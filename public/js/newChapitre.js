// nav
const nav = document.getElementById('nav')
const buttonMenu = document.getElementById('buttonMenu')
const home = nav.querySelector('img')

buttonMenu.addEventListener('click', event => {
    nav.style.transition = 'left 500ms ease-in-out'
    nav.style.left = '0'
})
home.addEventListener('click', event => {
    nav.style.left = '-100vw'
})

// animation enter
const barres = document.querySelectorAll('.barre')
for (const barre of barres) {
    barre.addEventListener('animationend', event => {
        barre.style['opacity'] = '1'
    })
}
const h1 = document.querySelector('h1')
const titre = 'Nouveau Chapitre'
const ecrit = []
let i = 0
setInterval(() => {
    ecrit.push(titre[i])
    i++
    h1.innerText = ecrit.join('')
}, 100);