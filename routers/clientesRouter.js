var express = require('express');
var mongoose = require("mongoose");
var router = express.Router(),
cliente = mongoose.model('cliente'),
usuario = mongoose.model('usuario'),
moment = require('moment'),
planes = mongoose.model('plan');

function agregarCliente(req,res) {

	/*usuario.findOne({idUsuario:req.cookies.idUsuario}).exec(function (err,user) {
		var newCliente = new cliente({
			nombre:req.body.nombre,
			identificacion:req.body.identificacion,
			gimnacio:user._id,
			sexo:req.body.sexo,
			edad:req.body.edad,
			fechaRegistro: moment().format("DD/M/YYYY"),
			ultimoIngreso: moment().format("DD/M/YYYY"),
			telefono:req.body.telefono,
			direccion:req.body.direccion,
			pesoInicial:req.body.pesoInicial,
			pesoIdeal:req.body.pesoIdeal
		});
		newCliente.save(function (err,clienteGuardado) {
			if(err){
				console.log(err);
				res.sendStatus(500);
			}else {
				user.clientes.push(clienteGuardado._id);
				user.save(function (err,usuario) {
					if(err){
						console.log(err);
						res.sendStatus(500);
					}else{
						res.send(clienteGuardado);		
					}
				})							
			}
		});
	});*/	

	usuario.findOne({idUsuario:req.cookies.idUsuario}).exec()
	.then(function (user) {
		if(user){
			var newCliente = new cliente({
			nombre:req.body.nombre,
			identificacion:req.body.identificacion,
			gimnacio:user._id,
			sexo:req.body.sexo,
			edad:req.body.edad,
			fechaRegistro: moment().format("DD/M/YYYY"),
			ultimoIngreso: moment().format("DD/M/YYYY"),
			telefono:req.body.telefono,
			direccion:req.body.direccion,
			pesoInicial:req.body.pesoInicial,
			pesoIdeal:req.body.pesoIdeal
		});

			return [user,newCliente.save()];
		}else{
			throw new Error('usuario no encontrado');
		}
	}).spread(function ( user,clienteGuardado) {
		user.clientes.push(clienteGuardado._id);
		return	[clienteGuardado,user.save()];
	}).spread(function (clienteGuardado,usuarioGuardado) {
		return res.send(clienteGuardado);
	}).catch(function (err) {
		console.log(err);
		res.res.sendStatus(500);
	});

}

function getCliente (req,res) {
	/*var query = cliente.findById(req.params.idCliente);
	query.exec(function (err,cliente){
		if(err){
			res.sendStatus(500);
		}else {
			var activas = 0;
			cliente.subscripcion.forEach(function (subs,index) {
				console.log('analizando subs ' + subs.estado);
				var fechaFinal = moment(subs.fechaFinal,"DD/M/YYYY");
				if(fechaFinal.isBefore(moment(),'day')){
					subs.estado = 'terminada';
				}
				if(subs.estado == 'activa'){
					activas++;
				}
			});
			if(activas){
				cliente.estado = 'activo';
			}else{
				console.log('cambio a inactivo');
				cliente.estado = 'inactivo';
			}
			cliente.save(function (err,clienteUpd){
				res.send(clienteUpd);
			});			
		}
	});*/

	cliente.findById(req.params.idCliente).exec()
	.then(function (cliente) {
		if(cliente){
			var activas = 0;
			cliente.subscripcion.forEach(function (subs,index) {
				console.log('analizando subs ' + subs.estado);
				var fechaFinal = moment(subs.fechaFinal,"DD/M/YYYY");
				if(fechaFinal.isBefore(moment(),'day')){
					subs.estado = 'terminada';
				}
				if(subs.estado == 'activa'){
					activas++;
				}
			});
			if(activas){
				cliente.estado = 'activo';
			}else{
				console.log('cambio a inactivo');
				cliente.estado = 'inactivo';
			}
			return cliente.save();
		}else{
			throw new Error('cliente no encontrado');
		}

	}).then(function (clienteUpd) {
		res.send(clienteUpd);
	}).catch(function (err) {
		console.log(err);
		res.sendStatus(500);
	});
}

function eliminarCliente (req,res) {
	/*cliente.remove({_id:req.params.idCliente},
		function (err) {
			if(err){
				console.log(err);
				res.sendStatus(500);
			}
			else{
				usuario.update({idUsuario:req.cookies.idUsuario},
					{ $pull: {clientes: req.params.idCliente } },function () {
						res.sendStatus(200);
					} );
			}
		});*/

		cliente.remove({_id:req.params.idCliente})
		.then(function (clienteBorrado) {
			return usuario.update({idUsuario:req.cookies.idUsuario},
				{ $pull: {clientes: req.params.idCliente } });
		}).then(function (usuarioUpd) {
			res.sendStatus(200);
		}).catch(function (err) {
			console.log(err);
			res.sendStatus(500);
		});








}

function getAllClientes(req,res){
	cliente.find().exec()
	.then(function (clientes) {
		res.send(clientes);
	}).catch(function (err) {
		console.log(err);
		res.sendStatus(500);
	});		
}

function agregarSubs(req,res) {
	/*cliente.findOne({'_id':req.params.idCliente}).exec(function (err,clienteEncontrado) {
		if(clienteEncontrado.subscripcion.length == 0){
			agregarUnicaSubs(req,res,clienteEncontrado);
		}else{
			var activas = 0;
			clienteEncontrado.subscripcion.forEach(function (subs,index) {
				if (subs.estado == 'activa' || subs.estado == 'pendiente' || subs.estado == 'suspendida') {
					activas++;
				}
			});
			if(activas){
				agregarSubsPendiente(req,res,clienteEncontrado);
			}else{
				agregarUnicaSubs(req,res,clienteEncontrado);
			}
		}
	});*/

	cliente.findOne({'_id':req.params.idCliente}).exec()
	.then(function (clienteEncontrado) {
		if(clienteEncontrado){
			if(clienteEncontrado.subscripcion.length == 0){
				agregarUnicaSubs(req,res,clienteEncontrado);
			}else{
				var activas = 0;
				clienteEncontrado.subscripcion.forEach(function (subs,index) {
				if (subs.estado == 'activa' || subs.estado == 'pendiente' || subs.estado == 'suspendida') {
					activas++;
				}
				});
				if(activas){
					agregarSubsPendiente(req,res,clienteEncontrado);
				}else{
					agregarUnicaSubs(req,res,clienteEncontrado);
				}
			}		
		}else{
			throw new Error('no se ha encontrado cliente');
		}
	}).catch(function (err) {
		console.log(err);
		res.sendStatus(500);
	});
}

function agregarUnicaSubs (req,res,clienteEncontrado) {
	var newSubs = {
		plan:req.body.plan,
		fechaCreacion: moment().format("DD/M/YYYY"),
		fechaInicio: moment().format("DD/M/YYYY"),
		estado:'activa'
	}

	/*planes.findOne({'_id':req.body.plan}).exec(function (err,plan){
		var fechaInicioAux = moment();
		var fechaFinal = fechaInicioAux.add(plan.duracion - 1,'days');
		newSubs.fechaFinal = fechaFinal.format("DD/M/YYYY");
		clienteEncontrado.subscripcion.push(newSubs);
		clienteEncontrado.save(function (err,clienteGuardado) {
			if(err){
				console.log(err);
				res.sendStatus(500);
			}else{
				res.send(clienteGuardado.subscripcion[clienteGuardado.subscripcion.length - 1]);
			}
		});
	})*/

	planes.findOne({'_id':req.body.plan}).exec()
	.then(function (plan) {
		if(plan){
			var fechaInicioAux = moment();
			var fechaFinal = fechaInicioAux.add(plan.duracion - 1,'days');
			newSubs.fechaFinal = fechaFinal.format("DD/M/YYYY");
			clienteEncontrado.subscripcion.push(newSubs);	
			return clienteEncontrado.save();
		}else{
			throw new Error('plan no encontrado');
		}
	}).then(function (clienteGuardado) {
		res.send(clienteGuardado.subscripcion[clienteGuardado.subscripcion.length - 1]);
	})
	.catch(function (err) {
		console.log(err);
		res.sendStatus(500);
	});
}

function agregarSubsPendiente(req,res,clienteEncontrado) {
	var newSubs = {
		plan:req.body.plan,
		fechaCreacion: moment().format("DD/M/YYYY"),
		estado:'pendiente'
	}

	/*clienteEncontrado.subscripcion.push(newSubs);
	clienteEncontrado.save(function (err,clienteGuardado) {
		if(err){
			console.log(err);
			res.sendStatus(500);
		}else{
			res.send(clienteGuardado.subscripcion[clienteGuardado.subscripcion.length - 1]);
		}
	});*/

clienteEncontrado.subscripcion.push(newSubs);
	clienteEncontrado.save()
	.then(function (clienteGuardado) {
		res.send(clienteGuardado.subscripcion[clienteGuardado.subscripcion.length - 1]);
	}).catch(function (err) {
		console.log(err);
		res.sendStatus(500);
	});
}

function cambiarSuspendida (req,res,clienteEncontrado){
	// var subs = clienteEncontrado.subscripcion.id(req.params.idSubs);
	// if(subs.estado == 'pendiente'){
	// 	res.sendStatus(401);
	// }else{
	// 	subs.estado = 'suspendida';
	// 	var fechaFinal = moment(subs.fechaFinal,'DD/M/YYYY');
	// 	subs.tiempoFaltanteParaFin = fechaFinal.diff(moment(),'days') + 1;
	// 	console.log('tiempo faltante' + subs.tiempoFaltanteParaFin);
	// 	subs.fechaFinal = '';
	// 	clienteEncontrado.save(function (err){
	// 		if(err){
	// 			console.log(err);
	// 			res.sendStatus(500);
	// 		}else{
	// 			res.send(subs);
	// 		}
	// 	});
	// }

	var subs = clienteEncontrado.subscripcion.id(req.params.idSubs);
	if(subs.estado == 'pendiente'){
		throw new Error('subscripcion ya pendiente');
	}else{
		subs.estado = 'suspendida';
		var fechaFinal = moment(subs.fechaFinal,'DD/M/YYYY');
		subs.tiempoFaltanteParaFin = fechaFinal.diff(moment(),'days') + 1;
		console.log('tiempo faltante' + subs.tiempoFaltanteParaFin);
		subs.fechaFinal = '';
		
		clienteEncontrado.save()
		.then(function (clienteGuardado) {
			res.send(subs);
			//res.send(clienteGuardado.subscripcion.id(req.params.idSubs));
		});

	}
}


function cambiarActiva(req,res,clienteEncontrado) {
	console.log('inicio cambio');
	var subs = clienteEncontrado.subscripcion.id(req.params.idSubs);
	var activas = 0;
	clienteEncontrado.subscripcion.forEach(function (subs,index) {
		if (subs.estado == 'activa') {
			activas++;
		}
	});
	console.log('subs activas : ' + activas);
	if(activas){
		console.log('no permitido activar');
		res.sendStatus(401);
	}else if(subs.estado == 'suspendida'){
		subs.estado = 'activa';
		console.log('cambiado a estado activa');
		console.log('agregado ' + subs.tiempoFaltanteParaFin + 'dias');
		var fechaFinal = moment().add(subs.tiempoFaltanteParaFin,'days');
		subs.fechaFinal = fechaFinal.format('DD/M/YYYY');
		console.log('fecha final: '  + subs.fechaFinal);
		clienteEncontrado.save(function (err) {
			if(err){
				console.log(err);
				res.sendStatus(500);
			}else{
				res.send(subs);
			}
		});
	}else if(subs.estado == 'pendiente'){
		planes.findOne({_id:subs.plan}).exec(function (err,plan) {
			subs.estado = 'activa';
			console.log('cambiado a estado activa');
			var fechaFinal = moment().add(plan.duracion,'days');
			subs.fechaFinal = fechaFinal.format('DD/M/YYYY');
			subs.fechaInicio = moment().format('DD/M/YYYY');
			clienteEncontrado.save(function (err) {
				if(err){
					console.log(err);
					res.sendStatus(500);
				}else{
					res.send(subs);
				}
			});			
		});
	}
}

function delSubs (req,res) {
	cliente.findOne({'_id':req.params.idCliente}).exec(function (err,cliente) {
		if(err){
			console.log(err);
			res.sendStatus(500)
		}else{
			cliente.subscripcion.id(req.params.idSubs).remove(function (err) {
				cliente.save(function(err,clienteGuardado) {
					if(err){
						console.log(err);
					}else{
						res.sendStatus(200);
					}
				});
			});
		}
	});
}

function changeSubs(req,res) {
	if(req.query.estado == 'suspendida'){
		console.log('subs suspendida');
		cliente.findOne({'_id':req.params.idCliente}).exec(function (err,clienteEncontrado){
			cambiarSuspendida(req,res,clienteEncontrado);
		});
	}else if (req.query.estado == 'activa'){
		console.log('subs activa');
		cliente.findOne({'_id':req.params.idCliente}).exec(function (err,clienteEncontrado){
			cambiarActiva(req,res,clienteEncontrado);
		});
	}
}

function changeCliente (req,res) {
	if(req.query.ultimoIngreso){
		cliente.findOne({'_id':req.params.idCliente}).exec()
		.then(function (clienteEncontrado) {
			if(clienteEncontrado.estado == 'inactivo'){
				throw new Error('cliente inactivo');
			}else{
				clienteEncontrado.ultimoIngreso = req.query.ultimoIngreso;
				return clienteEncontrado.save();
			}
		})
		.then(function (clienteGuardado) {
			res.send(clienteGuardado);
		})
		.catch(function (err) {
			console.log(err);
			res.sendStatus(500);
		});
	}else{
		cliente.findOne({'_id':req.params.idCliente}).exec()
		.then(function (clienteEncontrado) {
			clienteEncontrado.nombre = req.body.nombe || clienteEncontrado.nombre;
			clienteEncontrado.sexo = req.body.sexo || clienteEncontrado.sexo;
			clienteEncontrado.edad = req.body.edad || clienteEncontrado.edad;
			clienteEncontrado.telefono = req.body.telefono || clienteEncontrado.telefono;
			clienteEncontrado.direccion = req.body.direccion || clienteEncontrado.direccion;
			clienteEncontrado.pesoInicial = req.body.pesoInicial || clienteEncontrado.pesoInicial;
			clienteEncontrado.pesoIdeal = req.body.pesoIdeal || clienteEncontrado.pesoIdeal;
			return clienteEncontrado.save();
		}).then(function (clienteGuardado) {
			res.send(clienteGuardado);
		}).catch(function (err) {
			console.log(err);
			res.sendStatus(500);
		});
	}
}

router.post('/clientes',agregarCliente);
router.get('/clientes',getAllClientes);
router.get('/clientes/:idCliente',getCliente);
router.delete('/clientes/:idCliente',eliminarCliente);
router.post('/clientes/:idCliente/subscripcion',agregarSubs);
router.delete('/clientes/:idCliente/subscripcion/:idSubs',delSubs);
router.put('/clientes/:idCliente/subscripcion/:idSubs',changeSubs);
router.put('/clientes/:idCliente',changeCliente);
module.exports = router;