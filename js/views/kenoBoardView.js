/**
 * kenoBoardView
 *
 * This view is the keno board itself. Numbers 1-80 as fronted by the numberModel.
 * Provides helpers for interfacing with the numbers collection.
 *
 */

define([
    'jquery',
    'underscore',
    'backbone',
    'mustache',
    'utils',

    'models/numberModel',

    'views/numberView'
],
function(
    $,
    _,
    Backbone,
    Mustache,
    Utils,

    NumberModel,

    NumberView

){
    return Backbone.View.extend({

        draws: 0,

        initialize:function(){
            this.drawBoard();
        },

        /**
         * showFrequency
         *
         * This helper is called from the main visualizer where the current draws are fetched.
         * The days draws need to be parsed to determine each numbers frequency. This data is
         * stored in the frequency matrix and passed to the collection where its data is set
         * on the collection's number models.
         *
         * @param draws
         */
        showFrequency:function(draws){
            this.draws = draws.length;
            var frequencyMatrix = [];
            _.each(draws,function(draw){
                var thisDraw =_.countBy(draw.parseDraw(),function(num){
                    return num;
                });
                frequencyMatrix = Utils.mergeObjects(frequencyMatrix,thisDraw);
            });

            this.collection.update(frequencyMatrix);
        },

        /**
         * drawBoard
         *
         * Method responsible for hooking together the number models in the collection
         * with the number views that make up the keno board.
         */
        drawBoard:function(){

            var _this = this;
            this.collection.each(function(num){
                var numView = new NumberView({model: num});

                numView.on('number-clicked', function(model){
                    _this.trigger('number-clicked',model);
                });

                _this.$el.append(numView.render());
            });

        },

        /**
         * showHotCold
         *
         * Helper to interface with the collection's hot/cold functionality
         *
         */
        showHotCold:function(){
            this.collection.resetHotCold();
            if(this.draws > 2){
                this.collection.setHot();
                this.collection.setCold();
            }
        },

        /**
         * hideHotCold
         *
         * Helper to interface with the collection's hot/cold functionality
         *
         */
        hideHotCold:function(){
            this.collection.resetHotCold();
        }

    });
});