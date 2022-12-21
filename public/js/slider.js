const img = document.querySelector('img')

function imgSize() {
    console.log('resizeImg')
    if ((window.innerHeight) >= window.innerWidth) {
        img.style['height'] = ''
        img.style['width'] = '80vw'
    } else {
        img.style['width'] = ''
        img.style['height'] = '90vh'
    }
    if (img.height > (window.innerHeight * (90/100))) {
        img.style['height'] = '90vh'
        img.style['width'] = ''
    } else if (img.width > (window.innerWidth * (80/100))) {
        img.style['height'] = ''
        img.style['width'] = '80vw'
    }
} imgSize()
window.addEventListener("resize", event => {
    imgSize()
})

// info
const info = document.getElementById('info')
const p = document.querySelector('p')
info.addEventListener('click', event => {
    if (p.style.display == 'none') {
        p.style.display = 'block'
    } else {
        p.style.display = 'none'
    }
})