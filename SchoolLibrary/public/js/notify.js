let notify = (() => {
        function showInfo(message) {
            let infoBox = $('#infoBox');
            infoBox.text(message);
            infoBox.fadeIn();
            setTimeout(() => infoBox.fadeOut(), 3000);
        }

        function showError(message) {
            let errorBox = $('#errorBox');
            errorBox.text(message);
            errorBox.fadeIn();
            setTimeout(() => errorBox.fadeOut(), 3000);
        }

        return {
            showInfo,
            showError,
        }
    }
)();