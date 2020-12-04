const mongoose = require('mongoose');
const app = require('../routes/categoria');
const Schema = mongoose.Schema;

let ProductoSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario.']
    },
    precioUni: {
        type: Number,
        required: [true, 'El precio es necesario.']
    },
    categoria: {
        type: Schema.Types.ObjectId, //Exportación externa.
        ref: 'Categoria'
    },
    disponible:{
        type: Boolean,
        default: true
    },
    usuario: {
        type: Schema.Types.ObjectId, //Exportación externa.
        ref: 'Usuario'
    }
});

// Exportación:
module.exports = mongoose.model('Producto', ProductoSchema);