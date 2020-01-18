const db = require('./db')
const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const port = 80

// Adds the directory with all the stuff to be used
app.use(express.static(__dirname + '/views'));
app.use(bodyParser.urlencoded({ extended: true }));
// set the view engine to ejs
app.set('view engine', 'ejs');


// home page  
app.get('/', renderHomePage);
app.get('/pages/index', renderHomePage);

async function renderHomePage(req, res) {
    const articlePreviews = await db.prevs();

    res.render('pages/index', {
        articlePreviews: articlePreviews
    });
}


// about page
app.get('/pages/about', (req, res) => {
    arr = new Array(10000).fill(1).map(function () { return { sex: ["Homosexual", "Heterosexual", "Bisexual", "Asexual"][Math.floor((Math.random() * 4))] } });

    res.render('pages/about', { genders: arr });
});


// article page handler
app.get('/article/:articleUrl', async (req, res) => {
    const theUrl = req.params.articleUrl;
    const article = await db.getArticle(theUrl)
    const date = article[0].date.toString().split(" ").slice(1, 4).join(" ")

    res.render('pages/article', {
        article: article,
        date: date
    });
});


app.all('/pages/articleEditor', (req, res) => {
    let errorMessage = null;
    let content = null;
    let title = null;

    if (req.method.toLowerCase() == 'post') {
        title = req.body["title"];
        content = req.body["content"];

        if(!title || !content) {
            errorMessage = "Title and content fields are required!";
        } else {
            try {
                db.saveArticle(title, content);
            } catch(e) {
                errorMessage = e;
            }
        }
    }

    res.render('pages/articleEditor', {
        errorMessage: errorMessage,
        title: title || "",
        content: content || ""
    });
});















// DEBUG SHIT
app.get('/test-database', async (req, res) => {
    const time = await db.query('SELECT CURRENT_TIMESTAMP as t');

    const articlePreviews = await db.prevs();
    // console.log(JSON.stringify(articlePreviews));

    res.send(`DISSS CHANGE RIGHT HURRR The time on the DB server: ${time.rows[0]["t"]}`);
})


// Start deh servah!
app.listen(port, () => console.log(`WHATUP MY HOMIE! YO SERVER IZ RUNNIN ON DIS SHIZ: ${port}!`))
