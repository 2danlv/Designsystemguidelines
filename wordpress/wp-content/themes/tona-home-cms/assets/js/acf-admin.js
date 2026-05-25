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

    function moveInstructionsBelowInputs($scope) {
        var $fields = $scope
            .find('.acf-field')
            .add($scope.filter('.acf-field'));

        $fields.each(function () {
            var $field = $(this);
            var $labelDescription = $field.children('.acf-label').children('.description');
            var $input = $field.children('.acf-input');

            if (!$labelDescription.length || !$input.length || $input.children('.description').length) {
                return;
            }

            $labelDescription.appendTo($input);
        });
    }

    if (typeof acf !== 'undefined') {
        acf.addAction('ready append', function ($el) {
            var $scope = $el || $(document);
            enforceSingleFeaturedCard($scope);
            moveInstructionsBelowInputs($scope);
        });
    }

    $(function () {
        enforceSingleFeaturedCard($(document));
        moveInstructionsBelowInputs($(document));
    });
})(jQuery);
