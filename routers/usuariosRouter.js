var express = require("express")
, router = express.Router(),
mongoose = require('mongoose'),
moment = require('moment');
var usuarios = mongoose.model('usuario');
var planes = mongoose.model('plan');

function agregar(req, res){
	var nuevoUser = new usuarios({
		idUsuario: req.body.idUsuario,
		contrasena: req.body.contrasena,
		gimnacio: req.body.gimnacio,
		fechaCreacionCuenta:moment().format("DD/M/YYYY")
	});

	nuevoUser.save().then(function (user){
		console.log('agregado: ' + user);
		res.send(user);
	}).catch(function (err) {
		console.log(err);
		res.sendStatus(500);
	});
}

function login(req,res){
	console.log('login');
	var query = usuarios.findOne({'idUsuario':req.body.idUsuario}).
	select('idUsuario contrasena gimnacio');
	query.exec()
	.then(
		function (user){
			if(user.contrasena == req.body.contrasena){
				res.cookie("idUsuario",user.idUsuario);

				res.sendStatus(200);
			}else{
				console.log('contrasena incorrecta');
				throw new error('contraseña incorrecta');				
			}
		}
	).catch(function (err){
		res.res.sendStatus(404);
	});
}

function logout(req,res){
	res.clearCookie('idUsuario');
	res.sendStatus(200);
}

function listarClientes(req,res){
	if(req.query.nombre){
		listarClientesByName(req,res);
	}else if (req.query.cedula) {
		listarClientesByCedula(req,res);
	}else if (req.query.estado) {
		listarClientesByEstado(req,res);
	} else {
		
		var query = usuarios.findOne({idUsuario:req.params.idUsuario}).
		populate('clientes');
		query.exec(function(err,usuario){
			if(err){
				res.sendStatus(500);
			}else {
				res.send(usuario.clientes);
			}
		});
	}
}

function calcularEstadoClientes(req,res,clientes) {
	clientes.forEach(function (cliente,index) {
		var activas = 0;
		cliente.subscripcion.forEach(function (subs,index) {
			var fechaFinal = moment(subs.fechaFinal,"DD/M/YYYY");
			if(fechaFinal.isBefore(moment())){
				subs.estado = 'terminada';
			}
			if(subs.estado = 'activa'){
				activas++;
			}
		});
		if(activas){
			cliente.estado = 'activo';
		}else{
			cliente.estado = 'inactivo';
		}
		cliente.save()
	});
}

function listarClientesByEstado (req,res) {
	var query = usuarios.findOne({idUsuario:req.params.idUsuario}).
	populate({
		path:'clientes',
		match:{estado:req.query.estado}
	});

	query.exec(function(err,usuario) {
		if(err){
			res.sendStatus(500);
		}else {		
			res.send(usuario.clientes);
		}
	});
}

function listarClientesByName(req,res) {
	usuarios.findOne({idUsuario:req.params.idUsuario}).
	populate({
		path:'clientes',
		match:{nombre:req.query.nombre}
	}).exec().then(function (user) {
		res.send(user.clientes);
	}).catch(function (err) {
		res.sendStatus(500);
	});
}

function listarClientesByCedula(req,res) {
	usuarios.findOne({idUsuario:req.params.idUsuario}).
	populate({
		path:'clientes',
		match:{identificacion:req.query.cedula}
	}).exec().then(	function (user) {
		if(user){
			res.send(user.clientes);	
		}else{
			throw new Error('no se ha enontrado usuario');
		}
		
	}).catch(function (err) {
		console.log(err);
		res.sendStatus(500);
	});
}

function agregarPlan(req,res) {
	var usuarioActual = JSON.parse(req.cookies.idUsuario); 
	var newPlan = new planes({
		nombre : req.body.nombre,
		gimnacio: usuarioActual._id,
		duracion : req.body.duracion,
		horaIngreso : req.body.horaIngreso,
		horaIngresoMax : req.body.horaIngresoMax,
		precio : req.body.precio
	});
	
	newPlan.save(function (err,planGuardado) {
		if (err) {
			console.log('error al guardar nuevo plan')
			console.log(err);
			res.sendStatus(500);
		} else {
			asociarGym(req,res,planGuardado);
		}
	})
}

function asociarGym(req,res,planGuardado) {

	var query = usuarios.findOne({idUsuario:req.params.idUsuario});
	query.exec(function (err,usuario) {
		if (err) {

			console.log('error al buscar usuario');
			console.log(err);
		} else {
			usuario.planes.push(planGuardado._id);
			usuario.save(function (err,usuarioGuardado) {
				if (err) {					
					console.log('error al guardar usuario');
					console.log(err)
				} else {
					console.log('plan guardado: ' + planGuardado);
					res.send(planGuardado);
				}
			});
		}
	});	
}

function listarPlanes(req,res){
	/*usuarios.findOne({idUsuario:req.params.idUsuario}).populate('planes')
	.exec(function(err,user){
		if(err){
			console.log('error al buscar usuario');
			console.log(err);
			res.sendStatus(500);
		}else {			
			console.log(user.planes);
			res.send(user.planes);
		}
	});*/

	usuarios.findOne({idUsuario:req.params.idUsuario}).populate('planes')
	.exec().then(function(user) {
		if(user){
			res.send(user.planes);
		}else{
			console.log(err);
			throw new Error('usuario no encontrado');
		}
	}).catch(function (err) {
		console.log(err);
		res.sendStatus(500);
	});
}

function getUsuarios(req,res){
	usuarios.find().exec().then(function (users) {
		res.send(users);
	}).catch(function (err) {
		console.log(err);
		res.sendStatus(500);
	});
}

function getOneUsuario(req,res){
	usuarios.findOne({idUsuario:req.params.idUsuario}).exec()
	.then(function(user){
		res.send(user);
	}).catch(function (err){
		console.log(err);
		res.sendStatus(500);
	});
}




// falta esta funcion por implementar




function delUser(req,res){
	usuarios.findOne({idUsuario:req.params.idUsuario}).exec(function (err,user) {
		user.remove(function (err) {
			if (err) {
				console.log(err);
				res.sendStatus(500);
			} else {
				res.sendStatus(200);
			}
		});
	})
}


// falta esta funcion por implementar


function delUsuarios (argument) {
	usuarios.find().remove.exec(function (err) {
		if(err){
			console.log(err);
			res.sendStatus(500);
		}else{
			res.sendStatus(200);
		}
	})
}

router.post('/login', login);
router.post('/logout', logout);
router.post('/usuarios', agregar);
router.get('/usuarios', getUsuarios);
router.delete('/usuarios',delUsuarios); //pendiente 

router.get('/usuarios/:idUsuario',getOneUsuario);
router.delete('/usuarios/:idUsuario',delUser); //pendiente
router.get('/usuarios/:idUsuario/clientes',listarClientes);

router.get('/usuarios/:idUsuario/planes',listarPlanes);


module.exports = router;