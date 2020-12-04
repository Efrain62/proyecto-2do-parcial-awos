const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const usuario = require('../models/usuario');
const Usuario = require('../models/usuario');
const app = express();

// GET:Obtener.
// res: response/respuesta.-recibo. (servidor-cliente)
// req: request/pedir.-mando.(cliente-servidor)

// Dentro de .find({WHERE}).
app.get('/usuario', function (req, res) {
  
  // Ordenar:
  let desde = req.query.desde || 0;
  let hasta = req.query.hasta || 5;
  
  // exec: ejecutar, a un find de Usuario:
     Usuario.find({ estado: true })
     .skip(Number(desde))
     .limit(Number(hasta))
     .exec((err, usuarios) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            msg: 'Ocurrió un error al momento de consultar.',
            err //Se deja puesto que ya está declarado en la línea 12-13.
          });
        }
        // Respuesta exitosa:
        res.json({
          ok: true,
          msg: 'Lista de usuarios obtenida con éxito.',
          conteo: usuarios.length,
          usuarios //Se deja puesto que ya está declarada en la línea 12.
        });
     });
    });
  
    // app.get('/usuario', function (req, res) {
    //   res.json({
    //     // 200: Todo salió bien.
    //     ok: 200,
    //     mensaje: 'Jelou'});
    // });
  
  // app.get('/saludo', function (req, res) {
  //     res.json({
  //         ok: '200', 
  //         mensaje: 'Bienvenido'
  //     });
  //   });
   
    // POST: recibir?
    // app.post('/saludo', function(req, res){
    //   res.json({
    //     ok: 200,
    //     mensaje: 'Usuario insertado con éxito.'
    //   })
    // });
  
    app.post('/usuario', function(req,res){
      // let nombre = req.body.nombre;
      let body = req.body;
      let usr = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10) //Encriptación de contraseña (el 10 es de vueltas para encriptar).
      });

      usr.save((err, usrDB) => {
        // Si hubo algún error:
        if (err){
          return res.status(400).json({
            ok: false,
            msg: 'Ocurrió un error.',
            err
          });
        }

        res.json({
          ok: true,
          msg: 'Usuario insertado con éxito.',
          usrDB
        });
      });
  
      // ----------------------------NO SIRVE-----------------------------
      // if(nombre === undefined){
      //   res.status(400).json({
      //     ok: 400,
      //     mensaje: 'Favor de mandar el valor del nombre'
      //   });
      // }else{
  
      
      // res.json({
      //   ok: 200,
      //   mensaje: 'Usuario insertado con éxito.',
      //   // nombre: nombre
      //   body: body
        
      // });
      // }
// ---------------------------NO SIRVE------------------------------

    });
  
    
    // PUT:Actualizar.
    // params: parámetros.
    app.put('/usuario/:id', function(req,res){
      let id = req.params.id;
      let body = _.pick(req.body, ['nombre', 'email'])// pick: agarra de body los parámetros que desees.
      // new: si no lo encuentra, lo crea.}
      // runValidators: Ejecute validores para que cheque los parámetros.(no se multipliquen o haya errores.)
      Usuario.findByIdAndUpdate(id, body, 
        { new: true, runValidators: true, context: 'query'},
        (err, usrDB) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            msg: 'Ocurrió un error al momento de actualizar.',
            err //Se deja puesto que ya está declarado en la línea 119-120.
          });
        }
        res.json({
          ok: true,
          msg: 'Usuario actualizado con éxito.',
          usuario: usrDB
        });
    });
  });

    
    // app.put('/usuario', function(req,res){
    //   let nombre = id.body.nombre;
    //   let body = req.body;
  
    //   if(nombre == undefined){
  
    //   }
    //   res.json({
    //     ok: 200,
    //     mensaje: 'Usuario insertado con éxito.',
    //     nombre: nombre
    //   })
    // });
    
    // DELETE:
    // --------Eliminar usuario:-------------
    // app.delete('/usuario/:id', function(req, res){
    //   let id = req.params.id;
      
    //   // regresa un error o un usuario borrado:
    //   Usuario.deleteOne({ _id: id}, (err, usuarioBorrado) => {
    //     if (err){
    //       return res.status(400).json({
    //         ok: false,
    //         msg: 'Ocurrió un error al momento de eliminar.',
    //         err
    //       });
    //     }
    //     res.json({
    //       ok: true,
    //       msg: 'Usuario eliminado exitosamente.',
    //       usuarioBorrado //Declarado en línea 155.
    //     });
    //   });
    // });
// -------------------------------------------------------

    app.delete('/usuario/:id', function(req, res){
      let id = req.params.id;

      Usuario.findByIdAndUpdate(id, {estado: false }, {new: true, runValidators: true, context: 'query'},
      (err, usrDB) =>{
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
                usrDB //Declarado en línea 176.
              });
      });
    });

    module.exports = app;