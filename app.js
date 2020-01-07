const morgan = require('morgan');
const express = require('express');
const cors = require('cors');
const app = express();

app.use(morgan('common'));

const playstore = require('./playstore-data.js');

app.use(cors());

app.get('/apps', (req, res) =>{
    const { search="", sort , genres} = req.query;

    if (sort){
        if(!['App', 'Rating'].includes(sort)){
            return res
                .status(400)
                .send('Sort must be one of App or Rating')
        }
    }

    if (genres){
        if(!['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card'].includes(genres)){
            return res
                    .status(400)
                    .send('Filter must have a value of Action, Puzzle. Strategy, Casual, Arcade, or Card')
        }
    }

    let results = playstore.filter(application =>
                    application.App
                        .toLowerCase()
                        .includes(search.toLowerCase()));

    if (sort){
        results
            .sort((a, b) =>{
                return a[sort] > b[sort] ? 1: a[sort] < b[sort]? -1: 0;
            });
    }

    if (genres){
        let filterResults = results.filter(filter =>
                            filter.Genres
                            .toLowerCase()
                            .includes(genres.toLowerCase()));
        
        res.json(filterResults);
    }

    res.json(results);
});

module.exports = app;