/**
 * Created by Ben on 28/06/2017.
 */


((angular)=>{
    angular.module('sales').controller('salesListController',['$scope','$common', '$dataService',($scope, $common, $dataService)=>{
        $scope.editSale = (_id)=>{
            $common.$location.path('sales/create').search('saleId', _id);
            $scope.$apply();
        };
        $scope.deleteSale = (_id)=>{
            _id = _id.replace('d-','');
            bootbox.dialog({
                message: "<h2 class='text-danger text-center'>Estas a punto de eliminar una venta</h2><h3 class='text-danger text-center'>¿Está seguro?</h3>",
                buttons: {
                    success: {
                        label: "Cancelar",
                        className: "btn-default"
                    },
                    danger: {
                        label: "Si, Eliminar",
                        className: "btn-danger",
                        callback: function() {
                            $dataService.delete('sales',{_id:_id})
                                .then((result)=>{
                                    if (result.isValid){
                                        let notice = new PNotify({
                                            type: 'info',
                                            title: 'Venta eliminada',
                                            text: 'La venta ha sido eliminada exitosamente',
                                            icon: 'fa fa-trash',
                                            styling: 'fontawesome'
                                        });
                                    }
                                })
                                .catch((err)=>{
                                    console.log(err);
                                });
                        }
                    }
                }
            });
        };

        $dataService.on('remove-sales',(sale)=>{
            let removed = $scope.sales.filter((o)=>{
                return o._id === sale._id;
            });
            if (removed.length > 0){
                let index = $scope.sales.indexOf(removed[0]);
                $scope.sales.splice(index, 1);

                $scope.table.fnClearTable();
                if ( $scope.sales.length > 0) {
                    $scope.table.fnAddData($scope.sales);
                }
                $scope.table.fnDraw();
                $scope.setEvents();
            }
            $scope.$apply();
        });

        $dataService.on('save-sales',(sale)=>{
            $scope.sales.push(sale);

            $scope.table.fnClearTable();
            if ( $scope.sales.length > 0) {
                $scope.table.fnAddData($scope.sales);
            }
            $scope.table.fnDraw();
            $scope.setEvents();

            $scope.$apply();
        });
        
        $scope.setEvents = ()=>{

            $('.edit-button').unbind('click');
            $('.edit-button').click(function(e){
                e.stopPropagation();
                e.preventDefault();
                $scope.editSale(this.id.replace('e-',''));
            });
            $('.delete-button').unbind('click');
            $('.delete-button').click(function(e){
                e.stopPropagation();
                e.preventDefault();
                $scope.deleteSale(this.id.replace('e-',''));
            });
        };

        $scope.initTable = (data)=>{
            $scope.table = $('#example').dataTable({
                "language": {
                    "lengthMenu": "_MENU_",
                    "sProcessing": "Procesando...",
                    "sZeroRecords": "No se encontraron resultados",
                    "sEmptyTable": "Ningún dato disponible en esta tabla",
                    "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
                    "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
                    "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
                    "sInfoPostFix": "",
                    "sSearch": "Buscar:",
                    "sUrl": "",
                    "sInfoThousands": ",",
                    "sLoadingRecords": "Cargando...",
                    "oPaginate": {
                        "sFirst": "Primero",
                        "sLast": "Último",
                        "sNext": "Siguiente",
                        "sPrevious": "Anterior"
                    },
                    "oAria": {
                        "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                        "sSortDescending": ": Activar para ordenar la columna de manera descendente"
                    }
                },
                data: data,
                aoColumns: [
                    {"sTitle": "Folio", "sClass": "header", "mDataProp": "_id", "bSearchable": true},
                    {  "sTitle": "Cliente", "sWidth": "100px", "sClass": "header", "mDataProp": "client",
                        "render": function ( data, type, row ) {
                            return `${data.name}&nbsp;${data.lastName}&nbsp;${data.maternalSurname || '' }&nbsp;&nbsp;<span class="label label-primary"><strong>${data.rfc}</strong></span>`;
                        }
                    },
                    {  "sTitle": "Articulos", "sWidth": "100px", "sClass": "header", "mDataProp": "articles",
                        "render": function ( data, type, row ) {
                            return `${data.length} artículos`;
                        }
                    },
                    {"sTitle": "Total", "sClass": "header", "mDataProp": "total", "bSearchable": true,
                        render: function(data, type, row){
                            return "$ " + data.toFixed(2);
                        }
                    },
                    {  "sTitle": "Fecha", "sWidth": "100px", "sClass": "header", "mDataProp": "createdAt",
                        "render": function ( data, type, row ) {
                            // If display or filter data is requested, format the date
                            if ( type === 'display' || type === 'filter' ) {
                                return $common.$formatDate(new Date(data));
                            }
                            // Otherwise the data type requested (`type`) is type detection or
                            // sorting data, for which we want to use the raw date value, so just return
                            // that, unaltered
                            return data;
                        }
                    },
                    {"sTitle": "Estatus", "sClass": "header", "mDataProp": "status", "bSearchable": true, defaultContent: `<span class="label label-success">Activa</span>`,
                        render: function(data){
                            return `<span class="label label-${data ? 'success' : 'danger'}">${data? 'Activa' : 'Inactiva'}</span>`
                        }
                    },
                    {
                        "sTitle": "<i class='fa fa-bolt'></i>",
                        "sType": "status-bar",
                        "sWidth": "100px",
                        "sClass": "header",
                        "mDataProp": "_id",
                        "mData": function(source, type, value){
                            let $edit = $("<div>", {id: `e-${source['_id']}`, "class": "btn btn-sm btn-default edit-button", "title":"Editar", html: '<i class="fa fa-pencil"></i>'});
                            let $delete = $("<div>", {id: `d-${source['_id']}`, "class": "btn btn-sm btn-default delete-button", "title":"Eliminar", html: '<i class="fa fa-trash"></i>'});
                            let $container = $("<div />");
                            $container.append($edit);
                            $container.append($delete);
                            return $container.html();
                        }
                    }
                ]
            });

            $scope.setEvents();
            $('.dataTables_filter input').attr('placeholder','Search...');
            //DOM Manipulation to move datatable elements integrate to panel
            $('.panel-ctrls').append($('.dataTables_filter').addClass("pull-right")).find("label").addClass("panel-ctrls-center");
            $('.panel-ctrls').append("<i class='separator'></i>");
            $('.panel-ctrls').append($('.dataTables_length').addClass("pull-left")).find("label").addClass("panel-ctrls-center");

            $('.panel-footer').append($(".dataTable+.row"));
            $('.dataTables_paginate>ul.pagination').addClass("pull-right m-n");
        };

        $scope.sales = [];

        $dataService.find({
                model:'sales',
                query: {active: true},
                populate: [{path:'articles',model:'articles'},{path:'client',model:'clients'}]
            })
            .then((result)=>{
                if (result.isValid){
                    $scope.sales = result.data;
                    console.log($scope.sales);
                    $scope.initTable($scope.sales);
                }
                $scope.$apply();
            })
            .catch((err)=>{
                console.log(err);
            })


    }])
})(angular);