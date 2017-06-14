var express = require("express")
, router = express.Router()
, mongoose = require('mongoose');

var plan = mongoose.model('plan');
var usuarios = mongoose.model('usuario');

function agregar(req,res){
	usuarios.findOne({'idUsuario':req.cookies.idUsuario}).exec()
	.then(function (user) {
		if(user){
			var newPlan = new plan({
				gimnacio:user._id,
				nombre : req.body.nombre,
				duracion : req.body.duracion,
				precio : req.body.precio
			});
			return [user,newPlan.save()];
		}else{
			throw new Error('usuario no encontrado');
		}
	}).spread(function (user,planGuardado) {
		user.planes.push(planGuardado._id);
		return [planGuardado,user.save()];
	}).spread(function (planGuardado,user) {
		res.send(planGuardado);
	}).catch(function (err) {
		console.log(err);
		res.sendStatus(500);
	});
}

function getPlan(req,res){
	plan.findById(req.params.plan).exec().then(function (plan){
		res.send(plan);
	}).catch(function (err) {
		console.log(err);
		res.sendStatus(500);
	});
}

function getAllPlanes(req,res) {
	plan.find().exec().then(function (planes) {
		res.send(planEncontrado);
	}).catch(function (err) {
		console.log(err);
		res.sendStatus(500);
	});
}

function delPlanes (req,res) {
	plan.find().remove().exec().then(function (planes) {
		res.sendStatus(200);
	}).catch(function (err) {
		console.log(err);
		res.sendStatus(500);
	});
}

function delPlan (req,res) {
	plan.remove({_id:req.params.plan})
	.then(function (){
		return usuarios.update({idUsuario:req.cookies.idUsuario},
				{ $pull: {planes: req.params.plan } });
	}).then(function () {
		res.sendStatus(200);
	}).catch(function (err) {
		console.log(err);
		res.sendStatus(500);
	});
}

router.post('/planes',agregar);
router.delete('/planes',delPlanes);
router.get('/planes',getAllPlanes);
router.get('/planes/:plan',getPlan);
router.delete('/planes/:plan',delPlan);

module.exports = router;