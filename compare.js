const fs = require('fs');

const args = process.argv.slice(2);

let custom = false;

const toRead = args.length ? args.reduce((acc, arg) => {
    const [key, value] = arg.split('=');

    // if we're passed a file list, strip quotation marks and split into array
    if (key === 'files') {
        const files = value.replace(/\"\'\`/g, '').split(' ');

        custom = true;

        return {
            ...acc,
            [key]: files.map(file => require(file)),
        }
    }

    return {
        ...acc,
        [key]: value,
    };
}, {}) : {
    type: 'Before',
    group: 'Homepage',
    site: 'Local',
};

console.log(`Reviewing ${toRead.group} ${toRead.type} for site ${toRead.site}...`);

const files = toRead.files && toRead.files.length ? { Custom: toRead.files } : {
    Desktop: [
        require(`./raw/${toRead.type}/${toRead.site}/${toRead.group}/desk-01.json`),
        require(`./raw/${toRead.type}/${toRead.site}/${toRead.group}/desk-02.json`),
        require(`./raw/${toRead.type}/${toRead.site}/${toRead.group}/desk-03.json`),
    ],
    Mobile: [
        require(`./raw/${toRead.type}/${toRead.site}/${toRead.group}/mob-01.json`),
        require(`./raw/${toRead.type}/${toRead.site}/${toRead.group}/mob-02.json`),
        require(`./raw/${toRead.type}/${toRead.site}/${toRead.group}/mob-03.json`),
    ],
};

const formatData = (json) => {
    if (!json) {
        console.error('No JSON object found');
        return {};
    }

    const getByUrl = (data, info) => {
        const value = data.details.items.find(({ url }) => url.includes('vendors~client'));

        if (!value) {
            return null;
        }

        return value[info];
    }

    const audits = {
        'total-blocking-time': (data) => {
            return data.numericValue;
        },
        'mainthread-work-breakdown': (data) => {
            return data.details.items.find(({ group }) => group === 'scriptEvaluation').duration;
        },
        'third-party-summary': (data) => {
            const gMaps = data.details.items.find(({ entity }) => entity.text === 'Google Maps');

            if (!gMaps) {
                return null;
            }

            return gMaps.mainThreadTime;
        },
        'long-tasks': (data) => getByUrl(data, 'duration'),
        'legacy-javascript': (data) => getByUrl(data, 'wastedBytes'),
        'unused-javascript': (data) => getByUrl(data, 'wastedBytes'),
        'unminified-javascript': (data) => getByUrl(data, 'wastedBytes')
    };

    return Object.keys(audits).reduce((acc, audit) => ({
        ...acc,
        [audit]: audits[audit](json.audits[audit]),
    }), {});
}

const data = Object.keys(files).reduce((acc, view) => {
    files[view].map((json, i) => {
        acc = {
            ...acc,
            [`${view} ${i + 1}`]: formatData(json)
        };

        return json;
    });

    return acc;
}, {});

console.log(data);

const outFolder = custom ? (toRead.customFolder || 'custom') : toRead.type.toLowerCase();
const outFile = custom ? (toRead.customFile || 'custom') : toRead.group.toLowerCase();

if (!fs.existsSync(`./formatted/${outFolder}`)) {
    fs.mkdirSync(`./formatted/${outFolder}`);
}

fs.writeFileSync(`./formatted/${outFolder}/${outFile}.json`, JSON.stringify(data));

// try {
//     const csv = parse(data, { fields });
//     fs.writeFileSync('./CMSes-before.csv', csv);
// } catch (e) {
//     console.error(e);
// }


// const fields = [
//     'Desktop 1',
//     'Desktop 2',
//     'Desktop 3',
//     'Mobile 1',
//     'Mobile 2',
//     'Mobile 3',
// ]

/*
categories.performance.auditRefs.find(({ id }) id === 'total-blocking-time').relevantAudits

total-blocking-time
    .title
    .numericValue

mainthread-work-breakdown
    .title
    .details.items.find(({ group }) => group === 'scriptEvaluation')
        .duration

third-party-summary
    .title
    .details.items.find(({ entity }) => entity.text === 'Google Maps')
        .mainThreadTime
        .blockingTime

long-tasks
    .title
    .details.items.find(({ url }) => url.includes('vendors~client'))
        .url
        .duration

legacy-javascript
    .title
    .details.items.find(({ url }) => url.includes('vendors~client'))
        .url
        .wastedBytes

unused-javascript
    .title
    .details.items.find(({ url }) => url.includes('vendors~client'))
        .url
        .wastedBytes

unminified-javascript
    .title
    .details.items.find(({ url }) => url.includes('vendors~client'))
        .url
        .wastedBytes
*/
