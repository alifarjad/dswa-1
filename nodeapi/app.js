const { Sequelize, Model, DataTypes } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize('postgres://express:express@postgresnode:5432/express', {pool: {
    max: 50,
    min: 0,
    acquire: 30000,
    idle: 10000
  }});

const UrlMapping = sequelize.define('url_mappings', {
    id: {
        type: DataTypes.STRING(10),
        primaryKey: true    
    },
    url: DataTypes.STRING
    }, {indexes: [
        {
            unique: true,
            fields: ['id']
        },
        {
        fields: ['url']
        }]}
    );

//Trick to use await of top level
connect_to_db(sequelize).then(()=>{console.log("Finished setting up DB.")}).catch(()=>{console.log("Error")})

const baseurl = "http://localhost:5002/"
const express = require('express');
const app = express();

app.use(express.json());

app.listen(5002, function() {
    console.log('listening on 5002')
  })

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
})

app.get('/random', async (req, res) => {
    //findAll({ order: 'random()', limit: 1 })
    mapping = await UrlMapping.findAll({ order: Sequelize.literal('random()'), limit: 1 }).catch((error) => {
        res.status(500)
        res.send('Internal server error')
    })
    mapping = mapping[0]
    if(mapping==null || mapping==undefined) {
        res.status(404)
        res.send('Not found')
    } else {
        res.redirect(mapping.url);
    }
})

app.get('/:id', async (req, res) => {
    mapping = await UrlMapping.findByPk(req.params['id']).catch((error) => {
        res.status(500)
        res.send('Internal server error')
    })
    if(mapping==null || mapping==undefined) {
        res.status(404)
        res.send('Not found')
    } else {
        res.redirect(mapping.url);
    }
})

app.post('/url', async (req, res) => {

    if(req.body.url.substring(0,8)!='https://' && req.body.url.substring(0,7)!='http://') {
        res.status(400)
        res.send('Bad request')
        return
    }   
    const mapping = await UrlMapping.findOne({
        where: { url: req.body.url },
        attributes: ['id', 'url'] });
    if(mapping==null || mapping==undefined) {
        gen_id = makeid(10) 
        UrlMapping.create({
            id: gen_id,
            url: req.body.url,
        }).then(result => {
            res.status(201)
            res.json({ url : req.body.url, shortened : baseurl+gen_id})
        }).catch((error) => {
            res.status(500)
            res.send(error)
        });
    } else {
        res.status(200)
        res.json({ url : req.body.url, shortened : baseurl+mapping.id})
    }
})

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

async function connect_to_db(sequelize) {
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
    console.log('Trying to connect to database...')
    while(true) {
        try {
            var br = true;
            await delay(1000)
            await sequelize.authenticate()
            await sequelize.sync().catch((error) => {console.error('Unable to connect to the database. Retrying...', error); br=false}).then(()=>{console.log('Synced to database successfully.');})
            if(br==true)
                break
        } catch (error) {
            console.error('Unable to connect to the database. Retrying...', error);
        }
    }
}

