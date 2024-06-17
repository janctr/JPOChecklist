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

class QlikObject {
    constructor(objectId, size, customSize) {
        this.objectId = objectId;
        this.size = size;
        this.customSize = customSize || null;
    }
}

define(['angular', 'js/qlik'], function (angular, qlik) {
    const SIZE = {
        XSMALL: 'xs',
        SMALL: 's',
        MEDIUM: 'm',
        LARGE: 'l',
        XLARGE: 'xl',
    };
    const SIZE_PX = { xs: 100, s: 200, m: 300, l: 500, xl: 1000 };

    function AppController($scope) {
        this.pageTitle = 'HEYOOOOO';
        this.appId = '';
        this.app = null;
        this.qlikObjects = [];
        this.config = {
            host: window.location.hostname,
            prefix: prefix,
            port: window.location.port,
            isSecure: window.location.protocol === 'https:',
        };

        console.log('yo');
        const appId = '1a7f9a38-c7c2-47ae-b7f0-82dea6bf830a';
        const qlikObjects = [new QlikObject('nMpQZM', SIZE.LARGE)];

        this.loadQlikObjects(appId, qlikObjects);

        // this.openQlikApp(appId);
        // this.setQlikObjects(qlikObjects);
        // this.loadQlikObjects(this.app, this.qlikObjects);
    }

    AppController.prototype.openQlikApp = function (appId) {
        console.log('opening qlik app: ', appId);
        this.app = qlik.openApp(appId, this.config);
    };

    AppController.prototype.setQlikObjects = function (qlikObjects) {
        const newQlikObjects = [];

        for (let i = 0; i < qlikObjects.length; i++) {
            if (!qlikObjects[i].elementId) {
                qlikObjects[i].elementId = 'qlik-object-' + i;
            }

            newQlikObjects.push(qlikObjects[i]);
        }

        this.qlikObjects = newQlikObjects;
    };

    AppController.prototype.createContainers = function () {
        for (var i = 0; i < this.qlikObjects.length; i++) {
            const qlikObject = this.qlikObjects[i];

            console.log('adding QV: ', qlikObject.objectId);

            var elementId = 'QV' + String(i).padStart(i < 10 ? 1 : 0, '0');
            const classNames = ['qvobject', 'qlik_object'].join(' ');

            const elementHeight = 500;

            const styles = [`height: ${elementHeight}px`].join('; ');

            $('main.content').append(
                `<div id="${elementId}" class="${classNames}" style="${styles}"></div>`
            );

            // Change height of object
            console.log(
                `Adjusting height for: #${elementId} .qv-object-content-container`,
                $(`#${elementId} .qv-object-content-container`)
            );
        }
    };

    AppController.prototype.loadQlikObjects = function (appId, qlikObjects) {
        console.log('loadQlikObjects called');

        const app = qlik.openApp(appId, {
            host: window.location.hostname,
            prefix: prefix,
            port: window.location.port,
            isSecure: window.location.protocol === 'https:',
        });

        for (var i = 0; i < qlikObjects.length; i++) {
            const qlikObject = qlikObjects[i];

            console.log('adding QV: ', qlikObject.objectId);

            var elementId = 'QV' + String(i).padStart(i < 10 ? 1 : 0, '0');
            const classNames = ['qvobject', 'qlik_object'].join(' ');

            const elementHeight = 500;

            const styles = [`height: ${elementHeight}px`].join('; ');

            $('main.content').append(
                `<div id="${elementId}" class="${classNames}" style="${styles}"></div>`
            );

            // Change height of object
            console.log(
                `Adjusting height for: #${elementId} .qv-object-content-container`,
                $(`#${elementId} .qv-object-content-container`)
            );
        }

        // Fetch qlik object and inserts into div

        for (const qlikObject of qlikObjects) {
            app.getObject(qlikObject.elementId, appId, {
                noInteraction: false,
            });
        }
    };

    angular
        .module('appControllerModule', [])
        .controller('AppController', AppController);
});
