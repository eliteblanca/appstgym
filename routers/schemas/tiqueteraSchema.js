var mongoose = require("mongoose");

var tiqueteraSchema = mongoose.Schema({
	gimnacio:{ type: mongoose.Schema.Types.ObjectId, ref: 'usuario' },
	entradas : {type:'Number', required:true},
	duracion : {type:'Number', required:true},
	precio : {type : 'Number'}
});

var tiquetera = mongoose.model('tiquetera',tiqueteraSchema);