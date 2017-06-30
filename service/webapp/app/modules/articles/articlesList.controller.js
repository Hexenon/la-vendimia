/**
 * Created by Ben on 28/06/2017.
 */


((angular)=>{
    angular.module('articles').controller('articlesListController',['$scope','$common', '$dataService',($scope, $common, $dataService)=>{
        $scope.editArticle = (_id)=>{
            $common.$location.path('articles/create').search('articleId', _id);
            $scope.$apply();
        };
        $scope.deleteArticle = (_id)=>{
            _id = _id.replace('d-','');
            bootbox.dialog({
                message: "<h2 class='text-danger text-center'>Estas a punto de borrar un artículo.</h2><h3 class='text-danger text-center'>¿Está seguro?</h3>",
                buttons: {
                    success: {
                        label: "Cancelar",
                        className: "btn-default"
                    },
                    danger: {
                        label: "Si, Eliminar",
                        className: "btn-danger",
                        callback: function() {
                            $dataService.delete('articles',{_id:_id})
                                .then((result)=>{
                                    if (result.isValid){
                                        let notice = new PNotify({
                                            type: 'info',
                                            title: 'Artículo Eliminado',
                                            text: 'El artículo ha sido eliminado',
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

        $dataService.on('remove-articles',(article)=>{
            let removed = $scope.articles.filter((o)=>{
                return o._id === article._id;
            });
            if (removed.length > 0){
                let index = $scope.articles.indexOf(removed[0]);
                $scope.articles.splice(index, 1);

                $scope.table.fnClearTable();
                if ( $scope.articles.length > 0) {
                    $scope.table.fnAddData($scope.articles);
                }
                $scope.table.fnDraw();
                $scope.setEvents();
            }
            $scope.$apply();
        });

        $dataService.on('save-articles',(article)=>{
            $scope.articles.push(article);

            $scope.table.fnClearTable();
            if ( $scope.articles.length > 0) {
                $scope.table.fnAddData($scope.articles);
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
                $scope.editArticle(this.id.replace('e-',''));
            });
            $('.delete-button').unbind('click');
            $('.delete-button').click(function(e){
                e.stopPropagation();
                e.preventDefault();
                $scope.deleteArticle(this.id.replace('e-',''));
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
                    {"sTitle": "Código", "sClass": "header", "mDataProp": "code", "bSearchable": true},
                    {"sTitle": "Descripción", "sClass": "header", "mDataProp": "description", "bSearchable": true},
                    {"sTitle": "Modelo", "sClass": "header", "mDataProp": "model", "bSearchable": true},
                    {"sTitle": "Precio", "sClass": "header", "mDataProp": "price", "bSearchable": true},
                    {"sTitle": "Existencias", "sClass": "header", "mDataProp": "stock", "bSearchable": true},
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
                    {
                        "sTitle": "<i class='fa fa-bolt'></i>",
                        "sType": "status-bar",
                        "sWidth": "100px",
                        "sClass": "header",
                        "mDataProp": "_id",
                        "mData": function(source, type, value){
                            let $edit = $("<div>", {id: `e-${source['_id']}`, "class": "btn btn-sm btn-default edit-button", html: '<i class="fa fa-pencil"></i>'});
                            let $delete = $("<div>", {id: `d-${source['_id']}`, "class": "btn btn-sm btn-default delete-button", html: '<i class="fa fa-trash"></i>'});
                            let $container = $("<div />");
                            $container.append($edit);
                            $container.append($delete);
                            return $container.html();
                        }
                    }
                ]
            });

            $scope.setEvents();
            $('.dataTables_filter input').attr('placeholder','Buscar...');
            //DOM Manipulation to move datatable elements integrate to panel
            $('.panel-ctrls').append($('.dataTables_filter').addClass("pull-right")).find("label").addClass("panel-ctrls-center");
            $('.panel-ctrls').append("<i class='separator'></i>");
            $('.panel-ctrls').append($('.dataTables_length').addClass("pull-left")).find("label").addClass("panel-ctrls-center");

            $('.panel-footer').append($(".dataTable+.row"));
            $('.dataTables_paginate>ul.pagination').addClass("pull-right m-n");
        };

        $scope.articles = [];

        $dataService.find({
                model:'articles',
                query: {active: true}
            })
            .then((result)=>{
                if (result.isValid){
                    $scope.articles = result.data;
                    $scope.initTable($scope.articles);
                }
                $scope.$apply();
            })
            .catch((err)=>{
                console.log(err);
            })


    }])
})(angular);