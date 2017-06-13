var express = require("express")
, router = express.Router()
, mongoose = require('mongoose');

var plan = mongoose.model('plan');
var usuarios = mongoose.model('usuario');

function agregar(req,res){
	/*usuarios.findOne({'idUsuario':req.cookies.idUsuario}).exec(function (err,user) {
		if(err){
			console.log(err);
			res.sendStatus(500);
		}else {
			var newPlan = new plan({
				gimnacio:user._id,
				nombre : req.body.nombre,
				duracion : req.body.duracion,
				precio : req.body.precio
			});

			newPlan.save(function (err,planGuardado) {
				if(err){
					console.log(err);
					res.sendStatus(500);
				}else{
					user.planes.push(planGuardado._id);
					user.save(function (err,user) {
						if(err){
							console.log(err);
							res.sendStatus(500);
						}else{
							res.send(planGuardado);		
						}
					});					
				}
			})
		}
	});*/

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
	plan.findById(req.params.plan).exec(function (err,plan) {
		if (err) {
			console.log(err);
			res.sendStatus(500);
		} else {
			res.send(plan);
		}
	})
}

function getAllPlanes(req,res) {
	plan.find().exec(function(err,planEncontrado) {
		if (err) {
			console.log(err);
			res.sendStatus(500);
		} else {
			res.send(planEncontrado);
		}
	});
}

function delPlanes (req,res) {
	plan.find().remove().exec(function (err) {
		if (err) {
			console.log(err);
			res.sendStatus(500);
		} else {
			res.sendStatus(200);
		}
	});
}
function delPlan (req,res) {
	plan.remove({_id:req.params.plan},
		function (err) {
			if(err){
				console.log(err);
				res.sendStatus(500);
			}
			else{
				usuarios.update({idUsuario:req.cookies.idUsuario},
				{ $pull: {planes: req.params.plan } },function () {
					res.sendStatus(200);
				} );
			}
		});
}

router.post('/planes',agregar);
router.delete('/planes',delPlanes);
router.get('/planes',getAllPlanes);
router.get('/planes/:plan',getPlan);
router.delete('/planes/:plan',delPlan);

module.exports = router;