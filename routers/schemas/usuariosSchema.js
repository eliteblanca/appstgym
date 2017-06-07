var mongoose = require("mongoose");
var planesSchema = require('./planesSchema.js').schema;
var planes = mongoose.model('plan');

var usuarioSchema = mongoose.Schema({
	idUsuario : {type:'String', unique: true, required:true,sparse: true},
	contrasena : {type:'String', required:true},
	gimnacio : {type:'String', unique: true, required:true,sparse: true},
	clientes:[{ type: mongoose.Schema.Types.ObjectId, ref: 'cliente' }],
	planes : [{ type: mongoose.Schema.Types.ObjectId, ref: 'plan' }],
	fechaCreacionCuenta:{type:'String',required:true}
});

usuarioSchema.pre('remove',function(next){
	console.log('pre executed');
	planes.find({'gimnacio':this._id}).remove().exec();
	next();
});

var usuario = mongoose.model("usuario",usuarioSchema);
