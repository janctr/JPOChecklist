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
            objectId: '2b3af1ff-178e-442b-8a0b-e2fd11434d52',
        },
        {
            elementId: 'receipt-notes-table',
            objectId: '624538bc-0aab-41cf-b3b0-958c27dbe0d2',
        },
        {
            elementId: 'refuel-table',
            objectId: '43b67960-89b1-4ec3-919f-01b4e0297232',
        },
        {
            elementId: 'refuel-notes-table',
            objectId: '86cbee58-b83e-4f7a-b246-320d64a2329d',
        },
        {
            elementId: 'bulk-table',
            objectId: '291b7968-ee31-4673-bc89-546dc70f44cb',
        },
        {
            elementId: 'bulk-notes-table',
            objectId: '64e63436-8b8a-4aed-9c5e-6d46fdbfd980',
        },
        {
            elementId: 'fillstand-table',
            objectId: 'ef2e4e70-a406-4513-add5-7732f7ec20a2',
        },
        {
            elementId: 'fillstand-notes-table',
            objectId: 'b2c9e8e8-c5bc-4d6e-a196-ae1e6e84fe0c',
        },
        {
            elementId: 'hydrant-table',
            objectId: '62cecf67-f9d6-4502-a8fe-43b2c43af429',
        },
        {
            elementId: 'hydrant-notes-table',
            objectId: '0daadd4c-88de-47f9-bb8f-8e4ced975d39',
        },
        {
            elementId: 'mobile-table',
            objectId: '5466f73b-2c85-431f-b9c2-5a257c7b12e8',
        },
        {
            elementId: 'mobile-notes-table',
            objectId: '9bb28df5-ceb3-408c-a0e6-7d45de95af73',
        },
        {
            elementId: 'additive-table',
            objectId: '8b9b69e1-4db3-4e84-83e7-5d81e03b817d',
        },
        {
            elementId: 'additive-notes-table',
            objectId: '5cdf28f0-a0d8-4ecd-983b-939052f80740',
        },
        {
            elementId: 'sus-max-table',
            objectId: 'bc2d0186-40ab-4241-8140-d19ab2bee4b8',
        },
        {
            elementId: 'sus-max-notes-table',
            objectId: '1a04e2ad-7622-4309-b541-938b560394eb',
        },
        {
            elementId: 'truck-table',
            objectId: '0431668a-9c05-484a-9a14-471fdfc7aeb3',
        },
        {
            elementId: 'truck-notes-table',
            objectId: '939ce16a-2760-4c0f-9501-3bbff2920d4e',
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
