angular.module("gymApp").service('usuariosService', ['Restangular','$q', function(Restangular,$q){
	var usuarios = Restangular.all('usuarios');

	this.getListaUsuarios = function(){
		var deferred = $q.defer();
		usuarios.getList().then(
			function(listaUsuarios){
				deferred.resolve(listaUsuarios);
			},
			function(response){
				deferred.reject('error: ' + response.status)
			}
			);
		return deferred.promise;
	}

	this.agregarUsuario = function(usuario){
		var deferred = $q.defer();
		usuarios.post(usuario).then(
			function(response){				
				deferred.resolve(response);
			},
			function(response){
				deferred.reject('error: ', response.status);
			});
		return deferred.promise;
	}

	this.getUsuario = function (idUsuario) {
		var deferred = $q.defer();
		Restangular.one('usuarios',idUsuario).get().then(
			function(response){				
				deferred.resolve(response);
			},
			function(error){
				deferred.reject(error);
			});
		return deferred.promise;
	}

	this.login = function (usuario) {
		var deferred = $q.defer();
		Restangular.all('login').post({'idUsuario':usuario.idUsuario,'contrasena':usuario.contrasena}).then(function(response){
			deferred.resolve(response);
		},function(response){
			deferred.reject(response.status);
		});
		return deferred.promise;
	}

	this.logout = function () {
		var deferred = $q.defer();
		Restangular.all('logout').post().then(function(response){
			deferred.resolve(response);
		},function(response){
			deferred.reject(response.status);
		});
		return deferred.promise;
	}

}]).
service('planesService', ['Restangular','$q','$cookies', function(Restangular,$q,$cookies){
	this.agregarPlan = function(plan){
		var deferred = $q.defer();
		Restangular.all('planes').post(plan).then(function(response) {
			deferred.resolve(response);
		},function (err) {
			deferred.reject(err);
		})
		return deferred.promise;
	}

	this.getPlanes = function(){
		var	usuarioPlanes = Restangular.one('usuarios',$cookies.get('idUsuario')).all('planes');
		var deferred = $q.defer();
		usuarioPlanes.getList().then(function(planes){
			deferred.resolve(planes);
		},function(err){
			deferred.reject(err);
		})
		return deferred.promise;
	}

	this.getPlan = function(plan){
		var deferred = $q.defer();
		Restangular.one('planes',plan).get().then(function (planRecivido) {
			deferred.resolve(planRecivido);
		},function(err){
			deferred.reject(err);
		})
		return deferred.promise;
	}

	this.eliminarPlan = function(plan){
		var deferred = $q.defer();
		Restangular.one('planes',plan).remove().then(function (response) {
			deferred.resolve(response); 
		},function (err) {
			deferred.reject(err);
		});
		return deferred.promise;
	}
	
}])
.service('clientesService', ['Restangular','$q','$cookies', function(Restangular,$q,$cookies){
	var clientes = Restangular.all('clientes');	
	this.agregarCliente = function(cliente) {
		var deferred = $q.defer();
		clientes.post(cliente).then(
			function(response) {
				deferred.resolve(response);
			},function(err) {
				deferred.reject(err);
			})
		return deferred.promise;
	}

	this.actualizarCliente = function (cliente) {
		var deferred = $q.defer();
		var clienteRest = Restangular.one('clientes',cliente._id);
					clienteRest.nombre = cliente.nombre;
					clienteRest.sexo = cliente.sexo;
					clienteRest.edad = cliente.edad;
					clienteRest.telefono = cliente.telefono;
					clienteRest.direccion = cliente.direccion;
					clienteRest.pesoInicial = cliente.pesoInicial;
					clienteRest.pesoIdeal = cliente.pesoIdeal;

		clienteRest.put().then(
			function (clienteRecibido){
				deferred.resolve(clienteRecibido);
			},function (err){
				deferred.reject(err);
			});
		return deferred.promise;
	}

	this.eliminarCliente = function(cliente) {
		var deferred = $q.defer();
		var cliente = Restangular.one('clientes',cliente._id);
		cliente.remove().then(
			function(response) {
				deferred.resolve(response);
			},function(err) {
				deferred.reject(err);
		});
		return deferred.promise;
	}

	this.listarClientes = function() {
		var usuario = Restangular.one('usuarios',$cookies.get('idUsuario'));
		var deferred = $q.defer();
		usuario.getList('clientes').then(
			function(clientes) {
				deferred.resolve(clientes);
			},function(err) {
				deferred.reject;
			});
		return deferred.promise;
	}

	this.getCliente = function(idCliente) {
		var cliente = Restangular.one('clientes',idCliente);
		var deferred = $q.defer();
		cliente.get().then(
			function(clienteRecibido) {
				deferred.resolve(clienteRecibido);
			},
			function(err) {
				deferred.reject(err);
			});
		return deferred.promise;
	}

	this.subscribir = function (plan,idCliente) {
		var subscripciones = Restangular.one('clientes',idCliente).all('subscripcion');
		var deferred = $q.defer();
		var subscripcion = {
			'plan':plan,
			fechaInicio: moment().format("DD/M/YYYY")
		}
		subscripciones.post(subscripcion).then(function (subscripcion) {
			deferred.resolve(subscripcion);
		},function (err) {
			deferred.reject(err);
		})
		return deferred.promise;
	}

	this.delSubs = function (idSubs,idCliente) {
		var deferred = $q.defer();
		Restangular.one('clientes',idCliente).one('subscripcion',idSubs).remove().then(
			function (response) {
				deferred.resolve(response);
			},function (err) {
				deferred.reject(err);
			})
		return deferred.promise;
	}

	this.buscarPorNombre = function (nombre) {
		var deferred = $q.defer();
		Restangular.one('usuarios',$cookies.get('idUsuario')).getList('clientes',{'nombre':nombre}).then(
			function (clientes) {
				deferred.resolve(clientes);
			},function (err) {
				deferred.reject(err);
			});
		return deferred.promise;
	}

	this.buscarPorCedula = function (nombre) {
		var deferred = $q.defer();
		Restangular.one('usuarios',$cookies.get('idUsuario')).getList('clientes',{'cedula':nombre}).then(
			function (clientes) {
				deferred.resolve(clientes);
			},function (err) {
				deferred.reject(err);
			});
		return deferred.promise;
	}

	this.buscarPorEstado = function (estado) {
		var deferred = $q.defer();
		Restangular.one('usuarios',$cookies.get('idUsuario')).getList('clientes',{'estado':estado}).then(
			function (clientes) {
				deferred.resolve(clientes);
			},function (err) {
				deferred.reject(err);
			});
		return deferred.promise;
	}

	this.suspenderSubs = function (idSubs,idCliente){
		var deferred = $q.defer();
		Restangular.one('clientes',idCliente).one('subscripcion',idSubs).put({'estado':'suspendida'}).then(
		function (response) {
			deferred.resolve(response);
		},function (err) {
			deferred.reject(err);
		})
		return deferred.promise;
	}

	this.activarSubs = function (idSubs,idCliente){
		var deferred = $q.defer();
		Restangular.one('clientes',idCliente).one('subscripcion',idSubs).put({'estado':'activa'}).then(
		function (response) {
			deferred.resolve(response);
		},function (err) {
			deferred.reject(err);
		})
		return deferred.promise;
	}

	this.actualizarUltimoIngreso = function (idCliente) {
		var deferred = $q.defer();
		var ahora = moment().format("DD/M/YYYY");
		Restangular.one('clientes',idCliente).put({'ultimoIngreso':ahora}).then(
			function (clienteRecibido) {
				deferred.resolve(clienteRecibido);
			},function (err) {
				deferred.reject(err);
			});
		return deferred.promise;
	}
}]);