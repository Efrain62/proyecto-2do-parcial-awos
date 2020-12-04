const bodyParser = require('body-parser');
const express = require('express');
const _ = require('underscore');
const app = express();
const Producto = require('../models/producto');

// -------GET--------obtener:
app.get('/producto', (req, res) => {
    let desde = req.query.desde || 0;
    let hasta = req.query.hasta || 5;

    Producto.find({})
    .skip(Number(desde))
    .limit(Number(hasta))
    .populate('usuario', 'nombre email') //Vincular con categoria.
    .populate('categoria', 'descripcion')
    .exec((err, productos) => {
        if (err){
            return res.status(400).json({
                ok: false,
                msg: 'Ocurrió un error al momento de listar los productos.',
                err
            });
        }
        res.json({
            ok: true,
            msg: 'Productos listados con éxito.',
            conteo: productos.length,
            productos
        });
    });
});

// --------POST--------- crear:
app.post('/producto', (req, res) => {
    
    let body = req.body;
    let pro = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        categoria: body.categoria,
        // Se declaran todos los datos?
        // disponible: body.disponible,
        usuario: body.usuario
    });
    
    pro.save((err, proBD) => {
        if (err){
            return res.status(400).json({
                ok: false,
                msg: 'Ocurrió un erro al momento de insertar un producto.',
                err
            });
        }
        res.json({
            ok: true,
            msg: 'Se ha insertado el producto con éxito.',
            proBD //Declarado en línea 46.
        });
    });
});
    
// -------PUT---------actualizar:
app.put('/producto/:id', (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'precioUni']) //se actualiza todo menos id

    Producto.findByIdAndUpdate(id, body,
        {new: true, runValidators: true, context: 'query'},
        (err, proBD) => {
            if (err){
                return res.status.json({
                    ok: false,
                    msg: 'Ocurrió un error al momento de actualizar un producto.',
                    err
                });
            }
            res.json({
                ok: true,
                msg: 'Se ha actualizado el producto con éxito.',
                producto: proBD //De dónde es producto??
            });
        });
});


// ------DELETE-------eliminar:
app.delete('/producto/:id', (req, res) => {
    let id = req.params.id;

    Producto.findByIdAndUpdate(id, {disponible: false}, {new: true, runValidators: true, context: 'query'},
    (err, proBD) => {
        if (err){
            return res.status(400).json({
              ok: false,
              msg: 'Ocurrió un error al momento de eliminar.',
              err
            });
          }
          res.json({
            ok: true,
            msg: 'Usuario eliminado exitosamente.',
            proBD //Declarado en línea 88.
          });
    });
});


module.exports = app;