const axios = require('axios')
const { SubscriptionClient } = require('graphql-subscriptions-client');

const client = (url, params) => {
    new SubscriptionClient(url, {
        reconnect: true,
        connectionParams: params,
        lazy: true, // only connect when there is a query
        connectionCallback: (error) => {
            error && console.error(error);
        },
    });
}


// FETCH
async function fetchGraphQL(url, operationsDoc, operationName, variables, params) {
    const res = await axios.post(url, JSON.stringify({
        query: operationsDoc,
        variables: variables,
        operationName: operationName
    }), { params });
    return res.data;
}

function executeQuery(url, operationsDoc, operationName, variables, params) {
    return fetchGraphQL(
        url,
        operationsDoc,
        operationName,
        variables,
        params
    );
}

exports.subscriptionClient = (url, params = {}) => client(url, params);
exports.fetchData = (url, query, operationName, variables = {}, params = {}) => executeQuery(url, query, operationName, variables, params);