
var liveUrl = 'http://ec2-52-57-163-201.eu-central-1.compute.amazonaws.com/api/';
var devUrl = 'http://ec2-52-58-173-97.eu-central-1.compute.amazonaws.com/api/';

var constants = {
    installationData: 'installationData',
    installationTime: 'installationTime',
    InstallationFetchIntervalInMinutes: 30,
    yrTime: 'yrTime',
    yrData: 'yrData',
    yrFetchIntervalInMinutes: 30,
    yrExpireHours: 6,
    chartRawdataTime: 'chartRawdataTime',
    chartRawdataData: 'chartRawdataData',
    chartRawdataExpireMinutes: 30,
    chart1CalcualtedTime: 'chart1CalcualtedTime',
    chart1CalcualtedData: 'chart1CalcualtedData',
    chart1FetchIntervalInHours: 24,
    chart1ExpireMonths: 1,
    chart2CalcualtedTime: 'chart2CalcualtedTime',
    chart2CalcualtedData: 'chart2CalcualtedData',
    chart2FetchIntervalInMinutes: 30,
    chart2ExpireHours: 24,
    informasjonTime: 'informasjonTime',
    informasjonData: 'informasjonData',
    informasjonFetchIntervalInMinutes: 30,
    informasjonExpireHours: 12,
    api: devUrl,
    installation: 'installation/{key}',
    client: 'installation/{key}/clients',
    informasjonssider: 'client/{clientKey}/informationPages',
    informasjonsside: 'informationpage/{informationpageId}',
    dataview: 'installation/{id}/dataview',
    ping: 'installation/{id}/ping',
    content1: '#content1',
    content2: '#content2'
};