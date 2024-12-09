/*
 * Basic reponsive mashup template
 * @owner Jan Iverson Eligio (janiverson.eligio.ctr@us.navy.mil)
 */

/*
 *  Fill in host and port for Qlik engine
 */
var prefix = window.location.pathname.substr(
    0,
    window.location.pathname.toLowerCase().lastIndexOf('/extensions') + 1
);
var config = {
    host: window.location.hostname,
    prefix: prefix,
    port: window.location.port,
    isSecure: window.location.protocol === 'https:',
};

require.config({
    baseUrl:
        (config.isSecure ? 'https://' : 'http://') +
        config.host +
        (config.port ? ':' + config.port : '') +
        config.prefix +
        'resources',
});

require(['js/qlik'], function (qlik) {
    qlik.setOnError(function (error) {
        $('#popupText').append(error.message + '<br>');
        $('#popup').fadeIn(1000);
    });
    $('#closePopup').click(function () {
        $('#popup').hide();
    });

    //open apps -- inserted here --

    const isSipr = window.location.href.includes('smil');
    const appId = isSipr
        ? '30961999-b263-42e1-b4aa-5bf23fa315cd'
        : '51302cfb-504c-4aad-8318-7e001ba8576a';
    const JPOSiteSurveyApp = qlik.openApp(appId, config);

    //get objects -- inserted here --
    [
        {
            elementId: 'site-title',
            objectId: '031006f5-91c7-4826-a6c9-001dbbb206ae',
        },
        { elementId: 'site-dropdown', objectId: isSipr ? 'vrSjt' : 'GQZpH' },
        {
            elementId: 'poc-table',
            objectId: isSipr
                ? 'dabe8786-0c4f-4a2e-9a19-b6e38a5090c1'
                : '22df8fa4-9cf9-4797-a954-0612647bf3dd',
        },
    ].forEach((o) => {
        JPOSiteSurveyApp.getObject(o.elementId, o.objectId, {
            noInteraction: false,
        });
    });

    setInterval(() => {
        const buttonElements = $('#xrwamkt_content button');
        const printButtonHeaderElement = $('header#xrwamkt_title');

        /* Style Export to PDF button */
        if (printButtonHeaderElement.length) {
            printButtonHeaderElement.remove();
        }

        if (
            buttonElements.length &&
            buttonElements.attr('class') !== 'btn btn-dark'
        ) {
            console.log('changing class');
            buttonElements.removeClass();
            buttonElements.addClass('btn btn-dark');
        }
        /***************************/
    }, 2500);

    //create cubes and lists -- inserted here --
});
