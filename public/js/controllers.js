angular.module('gymApp')
.controller('controllerLanding', ['$scope','$state', function($scope,$state){
	$state.go('login');
}])
.controller('controllerRegistro', ['$scope','usuariosService','$state', function($scope,usuariosService,$state){
	$scope.usuario = {};
	$scope.estadoLogin = 'no login';
	$scope.agregarUsuario = function(usuario){
		usuariosService.agregarUsuario(usuario).then(
			function(data){
				$scope.usuarioAgregado = {'idUsuario': data.idUsuario}
				console.log('agregado correctamente');
				$state.go('login');
			},
			function(err){
				console.log('error al agregar');
				console.log(err);
			})
	}

	$scope.login = function(usuario){

		usuariosService.login(usuario).then(
			function(data){
				console.log('autenticado correctamente');
				$scope.estadoLogin = 'login aceptado';
				$state.go('dashBoard');		
			},
			function(err){
				console.log('no autenticado');
				$scope.estadoLogin = 'login rechazado';
			})
	}
}])
.controller('controllerDashBoard', ['$scope','$state','$cookies','usuariosService', function($scope,$state,$cookies,usuariosService){
	$state.go('dashBoard.clientes');
	usuariosService.getUsuario($cookies.get('idUsuario')).then(
		function (usuarioDevuelto) {
			$scope.gimnacio = usuarioDevuelto.gimnacio;		
		},function (err) {
			console.log(err);
		});
	$scope.logout = function(){
		usuariosService.logout();
		$state.go('login');
	}
}])
.controller('controllerClienteNuevo', ['$scope','$stateParams','clientesService','planesService', function($scope,$stateParams,clientesService,planesService){
	console.log('controller nuevo cliente');
	$scope.planes = new Array();
	planesService.getPlanes().then(
		function (planes) {
			$scope.planes = planes;
		},function (err) {
			console.log(err);
		});
}])
.controller('controllerClientes', ['$scope','clientesService', '$state',function($scope,clientesService,$state){
	$scope.cliente = $scope.cliente || {};
	$scope.clientes = $scope.clientes || new Array();
	$scope.tipoBusqueda = 'cedula';
	$scope.txtBusqueda = 'buscar por cedula';
	$scope.busquedaPlaceHold = 'cedula';
	$scope.estadoActivo = 'activo';
	$scope.estadoInactivo = 'inactivo';
	$scope.agregarNuevo = function (cliente) {		
		clientesService.agregarCliente(cliente).then(function (clienteAgregado) {
			$scope.clientes.push(clienteAgregado);
			$state.go('dashBoard.clientes');
		},function (err) {
			console.log(err);
		});
	}

	$scope.listarClientes = function(){
		clientesService.listarClientes().then(function (clientes) {
			$scope.clientesRecividos = true;
			$scope.clientes = clientes;
			clientes.forEach(function(cliente,index) {
				clientesService.getCliente(cliente._id).then(
				function (clienteRecibido) {
					console.log(clienteRecibido)
					$scope.clientes[index]	= clienteRecibido;
				},function (err) {
					console.log(err);
				});
			});
		},function (err) {
			console.log(err);
		});
	}

	if(!$scope.clientesRecividos){
		$scope.listarClientes();
	}

	$scope.verPerfil = function(cliente,index){		
		$state.go('dashBoard.clientes.perfil',
			{'idCliente':cliente._id,'index':index});
	}

	$scope.eliminarCliente = function(cliente,index) {
		clientesService.eliminarCliente(cliente).then(
			function (response) {
				var clienteRemovido = $scope.clientes.splice(index, 1);
				console.log('eliminado: ' + clienteRemovido);

			},function (err) {
				console.log(err);
			});
	}

	$scope.buscar = function (campo) {
		if(campo){
			if($scope.tipoBusqueda == 'nombre'){
				$scope.buscarPorNombre(campo);
			}else if ($scope.tipoBusqueda == 'cedula'){
				$scope.buscarPorCedula(campo);
			}	
		}else{
			$scope.listarClientes();
		}
	}

	$scope.buscarPorNombre = function (nombre) {
		clientesService.buscarPorNombre(nombre).then(
			function (clientes) {
			$scope.clientes = clientes;
		},function (err) {
			console.log(err);
		})
	}

	$scope.buscarPorCedula = function (cedula) {
		clientesService.buscarPorCedula(cedula).then(
			function (clientes) {
			$scope.clientes = clientes;
		},function (err) {
			console.log(err);
		})
	}

	$scope.busquedaNombre = function () {
		$scope.tipoBusqueda = 'nombre';
		$scope.txtBusqueda = 'Buscar por nombre';
		$scope.busquedaPlaceHold = 'nombre';
	}

	$scope.busquedaCedula = function () {
		$scope.tipoBusqueda ='cedula';
		$scope.txtBusqueda = 'Buscar por cedula';
		$scope.busquedaPlaceHold = 'cedula';
	}

	$scope.calcularColor = function(cliente){
		if(cliente.estado == 'activo'){
			return 'table-info';
		}else{
			return 'table-danger';
		}
	}

	$scope.buscarPorEstado = function(estado){
		clientesService.buscarPorEstado(estado).then(
		function (clientesRecividos) {
			$scope.clientes = clientesRecividos;
		},function (err) {
			console.log(err);
		});
	}

	$scope.actualizarUltimoIngreso = function(idCliente,index) {
		clientesService.actualizarUltimoIngreso(idCliente).then(
			function (clienteRecibido) {
			 $scope.clientes[index] = clienteRecibido;
		},function (err) {
			console.log(err);
		});
	}
}])
.controller('controllerClientesPerfil', ['$scope','$state','clientesService','$stateParams','planesService', function($scope,$state,clientesService,$stateParams,planesService){
	$scope.agregarClienteFlg = true;
	$scope.cliente = $scope.cliente || {};
	$scope.planes = new Array();

	$scope.cargarCliente = function (idCliente){
		clientesService.getCliente(idCliente).then(
			function (cliente) {
				$scope.cliente = cliente;
			},function (err) {
				console.log(err);
			});
	}

	$scope.calcDiasRestantes = function (idPlan,fechaInicio){
		var plan = $scope.planById(idPlan);
		if(plan){
			var fechaInicio = moment(fechaInicio,'DD/M/YYYY');
			var fechaFinal = fechaInicio.add(plan.duracion,'days');
				return fechaFinal.diff(moment(),'days');					
		}else{
			return '?';
		}		
	}

	$scope.numeroInfoDias = function(idPlan,fechaInicio){
		var plan = $scope.planById(idPlan);		
		var fechaInicio = moment(fechaInicio,'DD/M/YYYY');
		var fechaFinal = fechaInicio.add(plan.duracion - 1,'days');
		if(fechaFinal.isAfter(moment(),'day')){
			return fechaFinal.diff(moment(),'days') + 1;
		}else if (fechaFinal.isSame(moment(),'day')){
			return 'Hoy';
		}else if (fechaFinal.isBefore(moment(),'day')) {
			return 'Fin';
		}else{
			return 'error';
		}
	}

	$scope.calcFechaFinal = function (idPlan,fechaInicio){
		var plan = $scope.planById(idPlan);
		if(plan){
			var fechaInicio = moment(fechaInicio,'DD/M/YYYY');
			var fechaFinal = fechaInicio.add(plan.duracion,'days');
			return fechaFinal.format("DD/M/YYYY") || '??/??/??';
		}else{
			return '??/??/??';
		}		
	}	

	$scope.nombrePlan = function (idPlan){
		var plan = $scope.planById(idPlan);
		if(plan){
			return plan.nombre;
		}else{
			return 'unknown';
		}		
	}	

	$scope.planById = function (id){
		for(var i = 0; i < $scope.planes.length; i ++){
			if($scope.planes[i]._id == id){
				return $scope.planes[i];
			}
		}
		return null
	}

	$scope.cargarPlanes = function (){
		planesService.getPlanes().then(
		function (planesRecibidos) {
			$scope.planes = planesRecibidos;
			console.log($scope.planes);
		},function (err) {
			console.log(err);
		});
	}

	$scope.subscribir = function (plan){
		console.log(plan);
		clientesService.subscribir(plan,$scope.cliente._id).then(
		function (planRecivido) {
			console.log(planRecivido);
			$scope.cliente.subscripcion.push(planRecivido);
			$scope.agregarClienteFlg = true;
			$scope.actualizarClienteEnLista();
		},function (err) {
			console.log(err);
		});
	}

	$scope.eliminarSubs = function (idSubs,index){
		clientesService.delSubs(idSubs,$scope.cliente._id).then(
			function (data) {
			$scope.cliente.subscripcion.splice(index, 1);
			$scope.actualizarClienteEnLista();
		},function (err) {
			console.log(err);
		})
	}

	$scope.mostrarOpciones = function (){
		$scope.agregarClienteFlg = false;
		console.log('mostrar opciones');
	}

	$scope.suspenderSubs = function (idSubs,index){
			clientesService.suspenderSubs(idSubs,$scope.cliente._id).then(
			function (response) {
				$scope.cliente.subscripcion[index] = response;
				$scope.actualizarClienteEnLista();
			},function (err) {
				console.log(err);
			});
	}

	$scope.activarSubs = function (idSubs,index){
			clientesService.activarSubs(idSubs,$scope.cliente._id).then(
			function (response) {
				$scope.cliente.subscripcion[index] = response;
				$scope.actualizarClienteEnLista();
			},function (err) {
				console.log(err);
			});
	}

	$scope.actualizarClienteEnLista = function (){
		console.log('actualizarClienteEnLista');
		clientesService.getCliente($scope.cliente._id).then(function(clienteNuevo) {
			$scope.clientes[$stateParams.index] = clienteNuevo;
		},function (err) {
			console.log(err);
		});		
	}

	$scope.actualizarCliente = function (){
		console.log('controller function actualizarCliente');
		clientesService.actualizarCliente($scope.cliente).then(
			function (clienteRecibido) {
			console.log('se actualizo cliente con exito');
			$scope.cargarCliente($stateParams.idCliente);
			$state.go('dashBoard.clientes.perfil');
		},function  (err) {
			console.log('error al actualizar cliente');
			console.log(err);
		});		
	}

	$scope.cargarPlanes();
	$scope.cargarCliente($stateParams.idCliente);
}])
.controller('controllerSubs', ['$scope','$state','planesService','$cookies', function($scope,$state,planesService,$cookies){
	$state.go('dashBoard.subscripciones.planes');
	$scope.plan = $scope.plan || {};
	$scope.planes = $scope.planes || new Array();
	$scope.agregarPlan = function(plan){
		planesService.agregarPlan(plan).then(function (planGuardado) {
			console.log('planes sin nuevo: ' +$scope.planes);
			$scope.planes.push(planGuardado);
			console.log('plan agregado correctamente: ' + $scope.planes);
			$state.go('dashBoard.subscripciones.planes');
		},function (err) {
			console.log(err);
		});
	}

	$scope.listarPlanes = function (idUsuario) {
		planesService.getPlanes(idUsuario).then(function(planes) {
			console.log(planes);
			$scope.planes = planes;
			$scope.planesRecibidos = true;
		},function(err){
			console.log(err);
		})
	}

	$scope.eliminarPlan = function(plan,index) {
		planesService.eliminarPlan(plan).then(
			function (response) {
				var planRemovido = $scope.planes.splice(index, 1);
				console.log('eliminado: ' + planRemovido);
			},function (err) {
				console.log(err);
			});
	}

	if(!$scope.planesRecibidos){
		console.log('listando planes');
		$scope.listarPlanes($cookies.get('idUsuario'));
	}
}])
.controller('controllerPlanes', ['$scope','$state', function($scope,$state){
}])
.controller('controllerTiqueteras', ['$scope','$state', function($scope,$state){
}])
.controller('controllerRutinas', ['$scope', function($scope){
}])
.controller('controllerClases', ['$scope', function($scope){
}]);