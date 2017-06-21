var mongoose = require('mongoose');
var subSchema = require('./subscripcionSchema.js');
var clientesSchema = mongoose.Schema({
	nombre:{type:'String',required:true},
	identificacion:{type:'String',required:true,unique:true,dropDups: true, sparse: true},
	gimnacio:{ type: mongoose.Schema.Types.ObjectId, ref: 'usuario'},
	subscripcion:[subSchema],
	sexo:{type:'String',required:false},
	edad:{type:'Number',required:true},
	telefono:{type:'String',required:false},
	direccion:{type:'String',required:false},
	pesoInicial:{type:'Number',required:false},
	pesoIdeal:{type:'Number',required:false},
	fechaRegistro:{type:'String',required:true},
	ultimoIngreso:{type:'String',required:true},
	estado:{type:'String',required:false}
});

var cliente = mongoose.model("cliente",clientesSchema);