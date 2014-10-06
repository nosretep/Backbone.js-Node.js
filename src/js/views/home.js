define(['jquery', 'underscore', 'backbone', 'views/proto', 'text!templates/home.html'],
    function ($, _, Backbone, ProtoView, homeViewTemplate) {

        var preloadImages = _.once(function($el) {
            $el.find('div.image-bg').each(function() {
                $('<img />').attr('src', this.style.backgroundImage.slice(4, -1));
            });
        });
        
        return ProtoView.extend({
            title: 'Home',
            className: 'home_content',
            template: _.template(homeViewTemplate),
            render : function() {
                this.$el.html(this.template());
                preloadImages(this.$el);
                return this;
            }
        });
    }
);