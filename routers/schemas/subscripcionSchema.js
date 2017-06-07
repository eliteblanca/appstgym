var mongoose = require('mongoose');

var subSchema = mongoose.Schema({
	plan:{ type: mongoose.Schema.Types.ObjectId, ref: 'plan'},
	fechaInicio:{type:'String',required:false},
	fechaFinal:{type:'String',required:false},
	fechaCreacion:{type:'String',required:true},
	estado:{type:'String',required:false},
	tiempoFaltanteParaFin:{type:'String',required:false},
	fechaSuspencion:{type:'String',required:false}
});

module.exports = subSchema;