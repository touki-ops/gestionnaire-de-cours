const body = document.querySelector('body'), 
new_lesson = document.querySelector('#new_lesson'), 
uploadLesson = document.querySelector('#upload_lesson'), 
lessons = document.querySelector('#lessons'), 
inputFile = document.querySelector('#saveLesson')

// ajouter une nouvelle leçon
const form = uploadLesson.querySelector('form'), 
p = uploadLesson.querySelector('p'), 
img = uploadLesson.querySelector('img'), 
button = uploadLesson.querySelector("input[type='submit']"), 
quit = uploadLesson.querySelector('#quit')

new_lesson.addEventListener('click', event => {
    uploadLesson.style['display'] = 'flex';
    inputFile.style['top'] = img.offsetTop
    inputFile.style['left'] = img.offsetLeft
})
quit.addEventListener('click', event => {
    uploadLesson.style['display'] = 'none';
})
button.addEventListener('click', event => {
    const div1 = uploadLesson.querySelector('div:first-child')
    const div2 = uploadLesson.querySelector('div:nth-child(2)')

    div1.style['display'] = 'none'
    div2.style['display'] = 'flex'
    form.style['border'] = 'solid black 1px'

    event.preventDefault()
})
// sauvegarder la leçon de l'utilisateur
function getImgData() {
    const files = inputFile.files[0];
    if (files) {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(files);
        fileReader.addEventListener("load", function () {
            img.src = this.result;
            img.style['height'] = '130px'
            img.style['width'] = 'auto'
        });    
    }
}
inputFile.addEventListener('change', event => {
    p.innerText = inputFile.files[0].name
    getImgData()
})
// aperçu des leçon
const allLessons = document.querySelectorAll('.lesson')
for (let i = 0; i < allLessons.length; i++) {
    const lesson = allLessons[i];
    const allLessonsImg = lesson.querySelector('img')
    allLessonsImg.addEventListener('click', event => {
        if (allLessonsImg.src == 'http://localhost:3000/images/pdf.png') {
            document.location.href = allLessonsImg.alt
        } else {
            document.location.href = allLessonsImg.src.split('.').join('|')
        }
    })
}
// tri
const selectChapitre = document.querySelector('#triChapitre')
const selectMatiere = document.querySelector('#triMatiere')
selectChapitre.addEventListener('change', event => {
    if (event.target.value != 'false') {
        lessons.style['animation'] = 'lessons_left 400ms ease-in-out'
        setTimeout(() => {
            document.location.href = 'chapitre/' + event.target.value
        }, 400);
    } else {
        document.location.href = '/'
    }
});
selectMatiere.addEventListener('change', event => {
    if (event.target.value != 'false') {
        lessons.style['animation'] = 'lessons_left 400ms ease-in-out'
        setTimeout(() => {
            document.location.pathname = '/matiere/' + event.target.value
        }, 400);
    } else {
        document.location.href = '/'
    }
});
const allMatiere = [
    'francais',
    'math',
    'SVT',
    'physique',
    'histoire',
    'anglais',
    'espagnole',
    'musique',
    'technologie',
    'latin',
    'art',
]
const searchMatiere = document.querySelector('#searchMatiere')
if (searchMatiere.value != 'false') {
    for (const matiere of allMatiere) {
        if (matiere != searchMatiere.value) {
            for (const element of document.getElementsByClassName(matiere)) {
                element.parentNode.style['display'] = 'none'
            }
        } else {
            console.log(document.getElementsByClassName(matiere))
        }
    }
    for (const element of document.getElementsByClassName(searchMatiere.value)) {
        element.parentNode.style['display'] = 'block'
    }
}

// animation enter
const tri = document.querySelector('#tri')
tri.addEventListener('animationend', event => {
    tri.style['opacity'] = '1'
    new_lesson.style['opacity'] = '1'
})
const barres = document.querySelectorAll('.barre')
for (const barre of barres) {
    barre.addEventListener('animationend', event => {
        barre.style['opacity'] = '1'
    })
}
for (let i = 0; i < allLessons.length; i++) {
    const lesson = allLessons[i];
    lesson.style['animation-delay'] = i*100*2 + 'ms'
    lesson.addEventListener('animationend', event => {
        lesson.style['opacity'] = '1'
    })
}

// nav
const nav = document.getElementById('nav')
const buttonMenu = document.getElementById('buttonMenu')
const home = nav.querySelector('img')
const ALL = document.querySelectorAll('*')

buttonMenu.addEventListener('click', event => {
    nav.style.transition = 'left 500ms ease-in-out'
    nav.style.left = '0'
})
home.addEventListener('click', event => {
    nav.style.left = '-100vw'
})