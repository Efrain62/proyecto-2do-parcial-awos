const express = require('express');
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario');
const usuario = require('../models/usuario');
const app = express();

// ----POST------
app.post('/login', (req, res) => {
    let body = req.body;

    // findOne: Sólo un elemento.
    Usuario.findOne({ email: body.email, estado: true }, (err, usrDB) => {
        if (err){
            return res.status(400).json({
                ok: false,
                mgs: 'Ocurrió un error al momentode logueo.',
                err
            });
        }
        if (!usrDB){
            return res.status(400).json({
                ok: false,
                msg: 'Email incorrecto o no existe, pruebe de nuevo.',
            });
        }
        // Va comparar las contraseñas, para loguearse:
        if(!bcrypt.compareSync(body.password, usrDB.password)){
            return res.status(401).json({
                ok: false,
                msg: 'Contraseña incorrecta, pruebe de nuevo.'
            });
        }
        res.json({
            ok: true,
            msg: `Se ha logueado con éxito, ${usrDB.nombre}`,
            usrDB
        });

    });
});

// Exportación:
module.exports = app;