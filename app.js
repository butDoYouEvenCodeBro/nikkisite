const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const ejs = require("ejs");
const fs = require('fs');
const https = require('https');

const galleryDir = __dirname + '/public/images/gallery/'

// Upload Sequence Code
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname + '/public/images/gallery/');
    },

    filename: function (req, file, cb) {
        cb(null, req.body.art_type + '-' + file.fieldname + fs.readdirSync(galleryDir).length + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage
})

// Upload Sequence End

const app = express();

app.set('view engine', 'ejs');

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
    extended: true
}));

function getCurrentFilenames() {
    fs.readdirSync(galleryDir).forEach(file => {})
}

app.get('/', function (req, res) {
    const gallery = fs.readdirSync(galleryDir)

    res.render('home', {
        images: gallery,
    })
})

app.get('/gallery/:art_type', (req, res) => {
    const artType = req.params.art_type;
    const gallery = fs.readdirSync(galleryDir)
    const digital = []
    const sketchwork = []
    gallery.forEach((gallery) => {
        if (gallery.split('-').shift() === artType && artType === 'digital') {
            digital.push(gallery)
        } else if (gallery.split('-').shift() === artType && artType === 'sketchwork') {
            sketchwork.push(gallery)
        }
    })
    if (artType === 'digital') {
        res.render('gallery', {
            images: digital,
            title: 'Digital Art'
        })
    } else {
        res.render('gallery', {
            images: sketchwork,
            title: 'Sketchwork'
        })
    }
})

app.post('/contact', (req, res) => {
    const firstName = _.capitalize(req.body.name.split(' ')[0])
    const lastName = _.capitalize(req.body.name.split(' ')[1]);

    const data = {
        members: [{
            email_address: req.body.email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }
        }]
    }
    const jsonData = JSON.stringify(data);
    const url = "https://us14.api.mailchimp.com/3.0/lists/3c4159257c"

    const options = {
        method: "POST",
        auth: "nikki:6dcd1e2ac68805e251bc1a91828e0c2d-us14"
    }
    const request = https.request(url, options, (res) => {
        res.on('data', (data) => {
            console.log(JSON.parse(data));
        })
    })
    request.write(jsonData);
    request.end();
    res.redirect('/result')
})

app.get('/upload', function (req, res) {
    res.render('upload')
})

app.post("/upload", upload.array("img"), uploadFiles);

function uploadFiles(req, res) {
    console.log(req.body);
    console.log(req.files);

    res.redirect('/result')
}

app.get('/result', (req, res) => {
    res.render('uploadResult')
})

app.get('/append', (req, res) => {
    const gallery = fs.readdirSync(galleryDir)

    res.render('append', {
        images: gallery
    })
})

app.post('/append', (req, res) => {
    const newType = req.body.art_type;
    const remainder = req.body.img.split('-')[1];
    const newName = newType + '-' + remainder
    const oldName = req.body.img

    fs.rename(galleryDir + oldName, galleryDir + newName, () => {
        const gallery = fs.readdirSync(galleryDir)
        console.log(newName, gallery)
    })
    res.redirect("/append")

})
app.post('/delete', (req, res) => {
    fs.unlinkSync(galleryDir + req.body.delete)
    res.redirect("/append")
})

app.listen(process.env.PORT || 3000, function (req, res) {
    console.log('App is running on 3000')
});