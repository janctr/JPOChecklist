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
    // paths: {
    //     appControllerModule: '../extensions/JIRAMashup/AppController',
    // },
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
    const JPOSiteSurveyApp = qlik.openApp(
        '51302cfb-504c-4aad-8318-7e001ba8576a',
        config
    );

    //get objects -- inserted here --
    [
        {
            elementId: 'site-title',
            objectId: '031006f5-91c7-4826-a6c9-001dbbb206ae',
        },
        { elementId: 'site-dropdown', objectId: 'GQZpH' },
        {
            elementId: 'poc-table',
            objectId: '22df8fa4-9cf9-4797-a954-0612647bf3dd',
        },
        {
            elementId: 'receipt-table',
            objectId: '04b06636-05bf-43c1-9dc3-69f6698727fb',
        },
        {
            elementId: 'refuel-table',
            objectId: '3fd19103-1529-4ab0-8bd3-860f4f44ac6a',
        },
        {
            elementId: 'bulk-table',
            objectId: '2fa96355-5853-4400-8bad-491996f86b39',
        },
        {
            elementId: 'fillstand-table',
            objectId: '9a39e7ae-5653-4702-b804-1c87c412c0d6',
        },
        {
            elementId: 'hydrant-table',
            objectId: '72163044-2da5-49c3-8fe9-2f015019ab41',
        },
        {
            elementId: 'mobile-table',
            objectId: 'b35f8c08-2a61-44ca-aec6-3c2b2efc1864',
        },
        {
            elementId: 'additive-table',
            objectId: 'a80cb9a4-3cc9-4df9-b856-85537ae6d28b',
        },
        {
            elementId: 'sus-max-table',
            objectId: 'bc2d0186-40ab-4241-8140-d19ab2bee4b8',
        },
        {
            elementId: 'truck-table',
            objectId: 'bd997755-0f10-470f-8078-0bc5722f945d',
        },
        { elementId: 'miscallaneous-notes', objectId: 'DhvUgt' },
    ].forEach((o) => {
        JPOSiteSurveyApp.getObject(o.elementId, o.objectId, {
            noInteraction: false,
        });
    });

    $('#gantt-chart').addClass('loading');
    $('#update-table').addClass('loading');
    $('#apps-in-development-kpi').addClass('loading');
    $('#apps-in-ioc-kpi').addClass('loading');

    setInterval(() => {
        const buttonElements = $('#xrwamkt_content button');
        const printButtonHeaderElement = $('header#xrwamkt_title');

        /* These containers have loaders */
        const ganttChartElement = $('#nMpQZM_content');
        const updateTableElement = $(
            '#74bba754-a43f-47bb-902f-f4f645aace1c_content'
        );
        const appsInDevelopmentKpiElemenet = $(
            '#831ebd2f-4fd0-49b7-b827-5b80182b67a3_content'
        );
        const appsInIocKpiElemenet = $(
            '#253c0677-a625-4fc9-8f34-3645e209692f_content'
        );
        /*********************************/

        /* Remove loaders once elements has finished loading */
        if (ganttChartElement.length) {
            $('#gantt-chart').removeClass('loading');
        }

        if (updateTableElement.length) {
            $('#update-table').removeClass('loading');
        }

        if (appsInDevelopmentKpiElemenet.length) {
            $('#apps-in-development-kpi').removeClass('loading');
        }

        if (appsInIocKpiElemenet.length) {
            $('#apps-in-ioc-kpi').removeClass('loading');
        }
        /*********************************************/

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
