(function ($) {
    function enforceSingleFeaturedCard($scope) {
        var $fields = $scope
            .find('.acf-field[data-name="services_items"] .acf-field[data-name="featured"] input[type="checkbox"]')
            .add($scope.filter('.acf-field[data-name="services_items"]').find('.acf-field[data-name="featured"] input[type="checkbox"]'));

        $fields.off('change.tonaFeaturedCard').on('change.tonaFeaturedCard', function () {
            var $current = $(this);

            if (!$current.is(':checked')) {
                return;
            }

            $fields.not($current).prop('checked', false).trigger('change');
        });
    }

    if (typeof acf !== 'undefined') {
        acf.addAction('ready append', function ($el) {
            enforceSingleFeaturedCard($el || $(document));
        });
    }

    $(function () {
        enforceSingleFeaturedCard($(document));
    });
})(jQuery);
