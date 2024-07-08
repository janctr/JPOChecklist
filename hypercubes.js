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
    function getTableHeaders(qHyperCube) {
        return qHyperCube.qDimensionInfo.map(
            (dimension) => dimension.qAlias || dimension.qFallbackTitle
        );
    }

    function getTableHeadersWithoutNotes(qHyperCube) {
        return qHyperCube.qDimensionInfo
            .map((dimension) => dimension.qAlias || dimension.qFallbackTitle)
            .filter((header) => header !== 'Notes');
    }

    function getMatrixDataWithoutNotesColumn(qHyperCube) {
        const notesIndex = getTableHeaders(qHyperCube).indexOf('Notes');

        if (notesIndex < 0) {
            return;
        }

        const data = [];

        for (const row of qHyperCube?.qDataPages[0]?.qMatrix) {
            const tempRow = [];
            for (const [index, value] of row.entries()) {
                if (index !== notesIndex) {
                    tempRow.push(value);
                }
            }
            data.push(tempRow);
        }

        return data;
    }

    function createHypercubeDimensionsDefinition(
        dimensions,
        qNullSupression = false
    ) {
        return dimensions.map((dimension) => {
            return {
                qLabel: dimension.name,
                qDef: {
                    qAlias: dimension.name,
                    qFieldDefs: [dimension.column],
                },
                qNullSupression,
            };
        });
    }

    function createHypercubeDefinition(qDimensions, qHeight = 100) {
        return {
            qDimensions: qDimensions,
            qMeasure: [],
            qInitialDataFetch: [
                {
                    qWidth: qDimensions.length,
                    qHeight,
                },
            ],
        };
    }

    function createNotesSectionElement(qHyperCube) {
        const tableNotesEl = $(
            '<section class="notes-section"><h2 class="notes-header">Notes</h2></section>'
        );

        const notesIndex = getTableHeaders(qHyperCube).indexOf('Notes');

        if (notesIndex < 0) {
            return;
        }

        const notes = [];

        for (const row of qHyperCube.qDataPages[0].qMatrix) {
            if (
                typeof row[notesIndex].qText === 'undefined' ||
                row[notesIndex].qText === '-' ||
                !row[notesIndex].qText
            ) {
                continue;
            }

            notes.push(row[notesIndex]);
        }

        if (notes.length === 0) {
            return null;
        }

        for (const note of notes) {
            tableNotesEl.append(`<p class="notes-body">${note.qText}</p>`);
        }

        return tableNotesEl;
    }

    function populateTable(qHyperCube, elementId) {
        const tableContainerEl = $(`#${elementId}`);

        if (!tableContainerEl.length) {
            console.log(`element: ${elementId} not found.`);
        }

        tableContainerEl.empty();

        const headers = getTableHeadersWithoutNotes(qHyperCube);
        const data = getMatrixDataWithoutNotesColumn(qHyperCube);
        // const data = qHyperCube?.qDataPages[0]?.qMatrix;

        console.log('data: ', data);

        const tableEl = $('<table>');
        const tableHeadEl = $('<thead>');
        const tableHeaderRowEl = $('<tr>');
        const tableBodyEl = $('<tbody>');
        const tableNotesEl = createNotesSectionElement(qHyperCube);

        // Insert table headers
        tableHeadEl.append(tableHeaderRowEl);
        for (const header of headers) {
            tableHeaderRowEl.append(`<th>${header}</th>`);
        }

        // Insert cells
        for (const row of data) {
            const tableRowEl = $('<tr>');

            for (const cell of row) {
                let cellData;

                if (cell.qNum === 'NaN') {
                    cellData = cell.qText;
                } else {
                    cellData = cell.qNum;
                }

                if (typeof cellData === 'undefined') {
                    cellData = ' - ';
                }

                tableRowEl.append(`<td>${cellData}</td>`);
            }
            tableBodyEl.append(tableRowEl);
        }

        // Insert notes section

        tableEl.append(tableHeadEl);
        tableEl.append(tableBodyEl);
        tableContainerEl.append(tableEl);
        if (tableNotesEl) {
            tableContainerEl.append(tableNotesEl);
        }

        console.log('tableEl: ', tableEl);
    }

    const JPOSiteSurveyApp = qlik.openApp(
        '51302cfb-504c-4aad-8318-7e001ba8576a',
        config
    );

    for (const table of tables) {
        const tableDimensions = createHypercubeDimensionsDefinition(
            table.dimensions
        );

        const hypercube = createHypercubeDefinition(tableDimensions);

        JPOSiteSurveyApp.createCube(hypercube, (reply, app) => {
            console.log(`${table.table} cube: `, reply);
            populateTable(reply.qHyperCube, table.tableId);
        });
    }

    // /***  Additive Cube ****/
    // const additiveDimensions = createHypercubeDimensionsDefinition([
    //     { column: 'additive_row', name: '' },
    //     { column: 'Additive', name: 'Additive' },
    //     // { column: 'Site', name: '' },
    //     { column: 'NSN', name: 'NSN' },
    //     { column: 'Manufacturer', name: 'Manufacturer' },
    //     { column: 'USG_on_Hand', name: 'USG On-Hand' },
    //     { column: 'additive_notes', name: 'Notes' },
    // ]);

    // const additiveCube = createHypercubeDefinition(additiveDimensions);

    // JPOSiteSurveyApp.createCube(additiveCube, (reply, app) => {
    //     console.log('additive cube: ', reply);
    //     getTableHeaders(reply.qHyperCube);
    // });

    // /************************/

    // // Receipt Cube

    // const receiptDimensions = [
    //     { column: 'receipt_row', name: '' },
    //     { column: 'receipt_product', name: 'Product' },
    //     { column: 'Site', name: '' },
    //     { column: 'primary_alt', name: 'Primary or Alt' },
    //     { column: 'delivery_mode', name: 'Delivery Mode' },
    //     { column: 'receipt_headers', name: '# Headers' },
    //     { column: 'receipt_max_sim_use', name: 'Max Sim Use' },
    //     { column: 'receipt_gpm', name: 'Avg GPM' },
    //     { column: 'receipt_gph', name: 'Avg GPH' },
    //     {
    //         column: 'receipt_20hr_src',
    //         name: '20 Hr Sustained Receipt Capability',
    //     },
    //     { column: 'receipt_20hr_mrc', name: '20 Hr Max Receipt Capability' },
    //     { column: 'receipt_notes', name: 'Notes' },
    // ].map((dimension) => {
    //     return {
    //         qLabel: dimension.name,
    //         qDef: { qFieldDefs: [dimension.column] },
    //         qNullSupression: false,
    //     };
    // });

    // const receiptCube = {
    //     qDimensions: receiptDimensions,
    //     qMeasure: [],
    //     qInitialDataFetch: [
    //         {
    //             qWidth: receiptDimensions.length,
    //             qHeight: 100,
    //         },
    //     ],
    // };

    // JPOSiteSurveyApp.createCube(receiptCube, (reply, app) => {
    //     console.log('receipt cube: ', reply);
    //     populateTable(reply.qHyperCube, 'test-table');
    // });

    // console.log('hypercubes: ', hypercubes);
});

const tables = [
    {
        table: 'Receipt Capabilities',
        tableId: 'receipt-table',
        dimensions: [
            { column: 'receipt_row', name: '' },
            { column: 'receipt_product', name: 'Product' },
            { column: 'Site', name: '' },
            { column: 'primary_alt', name: 'Primary or Alt' },
            { column: 'delivery_mode', name: 'Delivery Mode' },
            { column: 'receipt_headers', name: '# Headers' },
            { column: 'receipt_max_sim_use', name: 'Max Sim Use' },
            { column: 'receipt_gpm', name: 'Avg GPM' },
            { column: 'receipt_gph', name: 'Avg GPH' },
            {
                column: 'receipt_20hr_src',
                name: '20 Hr Sustained Receipt Capability',
            },
            {
                column: 'receipt_20hr_mrc',
                name: '20 Hr Max Receipt Capability',
            },
            { column: 'receipt_notes', name: 'Notes' },
        ],
    },
    {
        table: 'Refueling Pier Capabilities (as applicable)',
        tableId: 'refuel-table',
        dimensions: [
            { column: 'refuel_row', name: '' },
            { column: 'pier_no', name: 'Pier No.' },
            { column: 'Site', name: '' },
            { column: 'refuel_product', name: 'Product(s)' },
            { column: 'pier_depth', name: 'Depth @ Pier' },
            { column: 'refuel_headers', name: '# Headers' },
            { column: 'refuel_max_sim_use', name: 'Max Sim Use' },
            { column: 'refuel_gpm', name: 'Avg GPM' },
            { column: 'refuel_gph', name: 'Avg GPH' },
            {
                column: 'refuel_20hr_src',
                name: '20 Hr Sustained Receipt Capability',
            },
            { column: 'refuel_24hr_mrc', name: '24 Hr Max Receipt Capability' },
            { column: 'refuel_notes', name: 'Notes' },
        ],
    },
    {
        table: 'Bulk Tank Storage Capabilities',
        tableId: 'bulk-table',
        dimensions: [
            { column: 'bulk_row', name: '' },
            { column: 'tank_product', name: 'Product' },
            { column: 'Site', name: '' },
            { column: 'tank_no', name: 'Tank #' },
            { column: 'tank_capacity', name: 'Max Capacity (USG)' },
            { column: 'storage_operating', name: 'Storage/Operating' },
            { column: 'tank_type', name: 'Type' },
            { column: 'tank_status', name: 'Service Status' },
            { column: 'tank_return', name: 'Return to Svc. Date' },
            {
                column: 'tank_20hr_stc_gph',
                name: '20 Hr Sustained Transfer Capability (GPH)',
            },
            {
                column: 'tank_20hr_stc',
                name: '20 Hr Sustained Transfer Capability (per day)',
            },
            {
                column: 'tank_24hr_mtc_gph',
                name: '24 Hr Maximum Transfer Capability (GPH)',
            },
            {
                column: 'tank_24hr_mtc',
                name: '24 Hr Maximum Transfer Capability (per day)',
            },
            { column: 'tank_notes', name: 'Notes' },
        ],
    },
    {
        table: 'Fillstands',
        tableId: 'fillstand-table',
        dimensions: [
            { column: 'fillstands_row', name: '' },
            { column: 'fill_product', name: 'Product' },
            { column: 'Site', name: '' },
            { column: 'no_fillstands', name: 'No. of Fillstands' },
            { column: 'fill_gpm', name: 'Avg GPM per Fillstand' },
            { column: 'fill_max_sim_use', name: 'Max Sim Use' },
            { column: 'fill_loc', name: 'Fillstand Location' },
            { column: 'fill_turn_time', name: 'Fillstand Turn Time' },
            { column: 'fill_notes', name: 'Notes' },
        ],
    },
    {
        table: 'Hydrant Issue Capabilities',
        tableId: 'hydrant-table',
        dimensions: [
            { column: 'hydrant_row', name: '' },
            { column: 'type_system', name: 'Type System' },
            { column: 'Site', name: '' },
            { column: 'pump_houses', name: 'No. Pump Houses' },
            { column: 'lats_loops', name: 'No. Lats or Loops' },
            { column: 'no_outlets', name: 'No. Outlets' },
            { column: 'hydrant_max_sim_use', name: 'Max Sim Use' },
            { column: 'hydrant_gpm', name: 'Avg GPM per Outlet' },
            {
                column: 'hydrant_combined_sim_gpm',
                name: 'Avg Combined Max Sim Use GPM',
            },
            { column: 'hydrant_notes', name: 'Notes' },
        ],
    },
    {
        table: 'Individual Mobile Issue Capabilities',
        tableId: 'mobile-table',
        dimensions: [
            { column: 'mobile_row', name: '' },
            { column: 'mobile_type', name: 'Type' },
            { column: 'Site', name: '' },
            { column: 'on_hand', name: 'On-Hand' },
            { column: 'Loaded_Capacity', name: 'Loaded Capacity' },
            { column: 'mobile_gpm', name: 'Avg GPM' },
            {
                column: 'mobile_avg_response_time',
                name: 'Average Response Time (min)',
            },
            { column: 'mobile_max_response_time', name: 'Max Response Time' },
            { column: 'mobile_turn_time', name: 'Avg Turn Time' },
            { column: 'mobile_notes', name: 'Notes' },
        ],
    },
    {
        table: 'Sustained / Maximum Issue Capabilities',
        tableId: 'sus-max-table',
        dimensions: [
            { column: 'issue_row', name: '' },
            { column: 'issue_product', name: 'Product' },
            { column: 'issue_type', name: 'Capability Type' },
            { column: 'Site', name: '' },
            { column: 'issue_gph', name: 'GPH' },
            { column: 'issue_20hr_gph', name: 'Gal Per 20Hr' },
            { column: 'issue_24hr_gph', name: 'Gal Per 24Hr' },
            { column: 'issue_notes', name: 'Notes' },
        ],
    },
    {
        table: 'Additive Information',
        tableId: 'additive-table',
        dimensions: [
            { column: 'additive_row', name: '' },
            { column: 'Additive', name: 'Additive' },
            { column: 'Site', name: '' },
            { column: 'NSN', name: 'NSN' },
            { column: 'Manufacturer', name: 'Manufacturer' },
            { column: 'USG_on_Hand', name: 'USG On-Hand' },
            { column: 'additive_notes', name: 'Notes' },
        ],
    },
    {
        table: 'Truck Information',
        tableId: 'truck-table',
        dimensions: [
            { column: 'truck_row', name: '' },
            { column: 'Truck_Type', name: 'Truck Type' },
            { column: 'Site', name: '' },
            { column: 'truck_on_hand', name: 'On Hand' },
            { column: 'truck_total_required', name: 'Total Required' },
            { column: 'truck_loaded_capacity', name: 'Loaded Capacity' },
            { column: 'truck_avg_gpm', name: 'Truck Avg GPM' },
            { column: 'truck_avg_turn_time', name: 'Truck Avg Turn Time' },
            { column: 'truck_max_turn_time', name: 'Truck Max Turn Time' },
            { column: 'truck_notes', name: 'Notes' },
        ],
    },
    {
        table: 'Other Miscellaneous Information',
        tableId: 'miscallaneous-notes',
        dimensions: [
            { column: 'notes_row', name: '' },
            { column: 'Site', name: '' },
            { column: 'notes_table', name: '' },
            { column: 'Notes', name: '' },
        ],
    },
];
