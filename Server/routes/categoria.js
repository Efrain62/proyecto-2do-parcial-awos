const express = require('express');
const { Schema } = require('mongoose');
const _ = require('underscore');
const app = express();
const Categoria = require('../models/categoria');

// --------GET--------
app.get('/categoria', (req, res) => {
    let desde = req.query.desde || 0;
    let hasta = req.query.hasta || 5;

    Categoria.find({})
    .skip(Number(desde))
    .limit(Number(hasta))
    // Hace un join de usuario y trae nombre y email:
    .populate ('usuario', 'nombre email') //Como si cruzara las tablas según las relaciones que tenga.
    .exec((err, categorias) => {
        if (err){
            return res.status(400).json({
                ok: false,
                msg: 'Ocurrió un error al listar las categorías.',
                err //Declarado en la línea 15.
            });
        }
        res.json({
            ok: true,
            msg: 'Categorías listadas con éxito.',
            conteo: categorias.length,
            categorias //Declarada en la línea 15.
        });
    });
});

// ----------POST----------
app.post('/categoria', (req, res) => {
    let cat = new Categoria({
        descripcion: req.body.descripcion,
        usuario: req.body.usuario
    });

    cat.save((err, catDB) => {
        if (err){
        return res.status(400).json({
            ok: false,
            msg: 'Error al insertar una categoría.',
            err // Declarado línea 40.
        });
      }
      res.json({
        ok: true,
        msg: 'Categoría insertada con éxito.',
        catDB
      });
    });
});

// -------PUT---------
app.put('/categoria/:id', (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['descripcion', 'usuario']);

    Categoria.findByIdAndUpdate(id, body, {new: true, runValidators: true, context: 'query'},
    (err, catDB) => {
        if(err){
            return res.status(400).json({
                ok: false,
                msg: 'Ocurrió un error en actualizar las categorías.',
                err
            });
        }
        res.json({
            ok: true,
            msg: 'Se ha actualizado las categorías con éxito.',
            catDB
        });
    });
});

// ------DELETE-------
app.delete('/categoria/:id', (req, res) => {
    let id = req.params.id;
    
    Categoria.findByIdAndRemove(id, {context: 'query'}, (err, catDB) => {
        if (err){
            return res.status(400).json({
                ok: false,
                msg: 'Ocurrió un error al momento de eliminar una categoría.',
                err
            });
        }
        res.json({
            ok: true,
            msg: 'Se ha eliminado la categoria con éxito.',
            catDB
        });
    });
});


// Exportación:
module.exports = app;