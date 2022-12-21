const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer')
const app = express();
const fs = require('fs')

// Body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// setting view engine to ejs
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'))

// multer
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'application/pdf': 'pdf'
}
function date () {
    // current date
    let date_ob = new Date();
    // adjust 0 before single digit date
    const date = ("0" + date_ob.getDate()).slice(-2);
    // current month
    const month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    // current year
    const year = date_ob.getFullYear();
    // current hours
    const hours = date_ob.getHours();
    // current minutes
    const minutes = date_ob.getMinutes();
    // current seconds
    const seconds = date_ob.getSeconds();
    // prints date & time in YYYY-MM-DD HH:MM:SS format
    const dateAndTime = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds
    return dateAndTime
}
const storage = multer.diskStorage({
    // Définit la destination de la leçon
    destination: (req, file, callback) => {
        callback(null, 'public/lessons/')
    },
    // définit le nom de la leçon
    filename: (req, file, callback) => {
    // date|titre de la leçon definit par l'utilasateur avec les espace remplacé par des underscore|mimetype
        let name = saveOption['titre'].split(' ').join('_') 
        name = [date(),name,saveOption['matiere']].join('|')
        const extension = file.mimetype.split('/')[1]
        callback(null, name + '.' + extension)
    }
})
const upload = multer({ storage: storage })

// views
var chapitres = false
var lessonsSplit = []
function loadChapitre() { // lit le fichier chapitres.json et recupère ses données
    fs.readFile('./public/lessons/chapitres.json', (err, data) => {
        if (err) throw err;
        if (data != '') {
            chapitres = JSON.parse(data)
        }
    });
}
loadChapitre()
// index
app.get('/', function(req, res) {
    lessonsSplit = []
    // On récupère toute les leçon enregistrer
    const dossier = 'public/lessons';
    const lessons = fs.readdirSync(dossier)
    for (let lesson of lessons) {
    // on découpe le nom de chaque leçon en un tableau et dans chaque, il y a [date, titre, matière, mimetype]
        if(lesson != '.DS_Store' && lesson != 'chapitres.json') {
            lesson = lesson.split('|')
            lesson[2] = lesson[2].split('.')
            lessonsSplit.push(lesson)
        } else if(lesson == 'chapitres.json') {
            loadChapitre() // on recharge les chapitre au cas où il y aurait un changement
        }
    }
    res.render('index', { lessons: lessonsSplit, saveOption: false, chapitres: chapitres, searchMatiere: false })
})

// upload new lesson
/* On creer un dictionnaire pour enregistrer les information de la leçon que l'utilisateur a rentré 
dans le 1er form */
var saveOption = {
    'titre': '',
    'matiere': '',
    'chapitre': ''
}
/* On enregistre les element du premier form dans le dictionnaire et on affiche l'index en lui signalent 
que l'on a déjà remplit le 1er form */
app.post('/saveOption', (req, res) => {
    saveOption['titre'] = req.body.titre
    saveOption['matiere'] = req.body.matiere
    saveOption['chapitre'] = req.body.chapitre
    res.render('index', { lessons: lessonsSplit, saveOption: true, chapitres: chapitres, searchMatiere: false })
})
// On upload la leçon de l'utilisateur et s'il a renseigné un chapitre on le sauvegarde dans chapitres.json
app.post('/saveLesson', upload.single('saveLesson'), async(req, res) => {
    if (saveOption['chapitre'] != 'false') {
        // on ouvre chapitres.json et récupère les données
        fs.readFile('./public/lessons/chapitres.json', (err, data) => {
            if (err) throw err;
            chapitres = JSON.parse(data)
            // On cherche le chapitre renseigné
            for (let chapitre of chapitres) {
                // Quand il est trouvé on y ajoute le nom de la nouvelle leçon du chapitre
                if(chapitre.titre == saveOption['chapitre']) {
                    chapitre.lessons.push(req.file.filename)
                    // On enregistre les changement
                    chapitres = JSON.stringify(chapitres)
                    fs.writeFile('public/lessons/chapitres.json', chapitres, (err) => {
                        if (err) throw err;
                        console.log('The file has been saved!');
                    });
                }
            }
        });
    }
    // on redirige vers l'index
    res.redirect('/')
});
// chapitre
// On affiche les leçon du chapitre spécifié
app.get('/chapitre/:chapitre', (req, res) => {
    loadChapitre()
    const chapitreParams = req.params.chapitre
    lessonsSplit = []
    if (chapitres != false) {
        // On trouve le chapitre
        for (const chapitre of chapitres) {
            if (chapitreParams == chapitre.titre) {
                // On formate chaque leçon
                for (let lesson of chapitre.lessons) {
                    lesson = lesson.split('|')
                    lesson[2] = lesson[2].split('.')
                    lessonsSplit.push(lesson)
                    // Puis renvoie l'index
                    res.render('index', { lessons: lessonsSplit, saveOption: false, chapitres: chapitres, searchMatiere: false })
                }
            }
        }
    } else {
        res.send('Recharger la page')
    }
})
// matiere
app.get('/matiere/:matiere', (req, res) => {
    const matiere = req.params.matiere
    lessonsSplit = []
    // On récupère toute les leçon enregistrer
    const dossier = 'public/lessons';
    const lessons = fs.readdirSync(dossier)
    for (let lesson of lessons) {
    // on découpe le nom de chaque leçon en un tableau et dans chaque, il y a [date, titre, matière, mimetype]
        if(lesson != '.DS_Store' && lesson != 'chapitres.json') {
            lesson = lesson.split('|')
            lesson[2] = lesson[2].split('.')
            lessonsSplit.push(lesson)
        } else if(lesson == 'chapitres.json') {
            loadChapitre() // on recharge les chapitre au cas où il y aurait un changement
        }
    }
    lessonsSplit = lessonsSplit.filter(function(element) {
        return element[2][0] == matiere 
    })
    res.render('index', { lessons: lessonsSplit, saveOption: false, chapitres: chapitres, searchMatiere: matiere })
})
// view lesson
app.get('/lessons/:lessonImg', (req, res) => {
    let lessonImg = req.params.lessonImg
    var idLesson
    lessonsSplit = []
    // On récupère toute les leçon enregistrer
    const dossier = 'public/lessons';
    let lessons = fs.readdirSync(dossier)
    var i = 0
    for (let lesson of lessons) {
        if (lesson.split('.')[1] == 'pdf') { // On suprimme le pdf du slider
            i--
        } // On enregistre les leçon dans la variable
        else if(lesson != 'chapitres.json') {
            lessonsSplit.push(lesson)
            console.log(lessonImg == lesson.split('.').join('|'))
            if (lessonImg == lesson.split('.').join('|')) {
                idLesson = i
            }
        } else if(lesson == 'chapitres.json') {
            loadChapitre() // On recharge les chapitre au cas où il y aurait un changement
        }
        i++
    }
    lessonsSplit.push(lessonsSplit[1]) // On copie la 1ere leçon a la fin pour faire une boucle
    // On copie la derniere leçon au début pour faire une boucle
    lessonsSplit[0] = lessonsSplit[lessonsSplit.length - 2]

    var lessonsImg = [lessonsSplit[idLesson-1].split('.').join('|'), lessonsSplit[idLesson], lessonsSplit[idLesson+1].split('.').join('|')]
    res.render('viewLesson', { lessonsImg: lessonsImg })
})
// new chapitre
app.get('/newChapitre', (req, res) => {
    res.render('newChapitre')
})
app.post('/createNewChapitre', (req,res) => {
    const chapitre = {
        "titre": req.body.titre,
        "lessons": [],
        "matiere": req.body.matiere
    }
    fs.readFile('./public/lessons/chapitres.json', (err, data) => {
        if (err) throw err;
        chapitres = JSON.parse(data)
        chapitres.push(chapitre)
        chapitres = JSON.stringify(chapitres)
        fs.writeFile('public/lessons/chapitres.json', chapitres, (err) => {
            if (err) throw err;
            console.log('The file has been saved!');
        });
    });
    res.redirect('/newChapitre')
})

// TEST
app.get('/test', (req, res) => {
    res.render('test')
})

// On démarre l'app 
const port = process.env.PORT || 3000;
app.listen(port, () => 
  console.log(`App start on localhost:${port}/`)
);