const popupButtonsTypes = {
    OKONLY: 1,
    YESNO: 2,
};

(function ($) {

    const POPUP_TEMPLATE = `
        <div class="jmwfrPopup">
            <div class="wrapper container-fluid h-100">
                <div class="col-12 h-100">
                    <div class="row h-100 align-items-center justify-content-center">
                        <div class="card">
                            <div class="card-header"></div>
                            <div class="card-body"></div>
                            <div class="card-footer"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    const OK_ONLY_BUTTONS = `
        <div class="col-12">
            <div class="row justify-content-around">
                <button class="btn btn-primary btnOK"></button>
            </div>
        </div>
    `;
    const YESNO_BUTTONS = `
        <div class="col-12">
            <div class="row justify-content-around">
                <button class="btn btn-primary btnYES"></button>
                <button class="btn btn-primary btnNO"></button>
            </div>
        </div>
    `;

    const CLOSE_BUTTON = `
        <div class="closeButton">

        </div>
    `;

    $.fn.jmwfrPopup = function (action, options) {

        var defaults = {
            buttonsType: popupButtonsTypes.OKONLY,
            width: 25,
            showHeader: true,
            title: "Sample title",
            text: "Sample content",
            btnOkText: "OK",
            btnYesText: "YES",
            btnNoText: "NO",
            showCloseButton: false,
            closeOnOverlayClick: true
        };

        var options = $.extend({}, defaults, options);

        //Actions
        if(action.trim() === "")
            throw "[jmwfrPopup] - An action is needed in order to show/hide the plugin!";

        switch (action) {
            case "show":
                showPopup(this);
                return this;
                break;
            case "hide":
                hidePopup(this);
                return this;
                break;
        }

        function showPopup(target) {
            let newTemplate = $(POPUP_TEMPLATE);

            /**************** Wrapper ****************/
            let className = "w-25";

            switch(options.width) {
                case 50:
                    className = "w-50";
                break;
                case 75:
                    className = "w-75";
                break;
                case 100:
                    className = "w-100";
                break;
            }

            newTemplate.find(".card").addClass(className);

            if(options.closeOnOverlayClick) {
                newTemplate.find(".wrapper").click(function() {
                    hidePopup(target); 
                });
            }

            /**************** Header ****************/
            if(!options.showHeader) {
                newTemplate.find('.card-header').remove();
            }
            else {
                newTemplate.find('.card-header').html(options.title);
            }

            /**************** Body ****************/
            newTemplate.find('.card-body').html(options.text);
            
            /**************** Footer/Buttons ****************/
            let buttonsTemplate;
            switch(options.buttonsType) {
                case popupButtonsTypes.OKONLY:
                    buttonsTemplate = $(OK_ONLY_BUTTONS);
                    buttonsTemplate.find('.btnOK').text(options.btnOkText);

                    buttonsTemplate.find('.btnOK').click(function() { 
                        hidePopup(target); 
                    });

                    newTemplate.find('.card-footer').append(buttonsTemplate);

                break;
                case popupButtonsTypes.YESNO:
                    buttonsTemplate = $(YESNO_BUTTONS);
                    buttonsTemplate.find('.btnYES').text(options.btnYesText);
                    buttonsTemplate.find('.btnNO').text(options.btnNoText);
                    newTemplate.find('.card-footer').append(buttonsTemplate);
                break;
            }
            
            $(target).append(newTemplate);
        }

        function hidePopup(target) {
            $(target).find('.jmwfrPopup').remove();
        }
    }
}(jQuery));
