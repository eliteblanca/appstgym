var mongoose = require("mongoose");

var planesSchema = mongoose.Schema({
	gimnacio:{ type: mongoose.Schema.Types.ObjectId, ref: 'usuario' },
	nombre : {type:'String', required:true},
	duracion : {type:'Number', required:true},
	precio : {type : 'Number'}
});

var plan = mongoose.model('plan',planesSchema);