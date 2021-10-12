const axios = require('axios')
const { execute } = require('apollo-link');
const { WebSocketLink } = require('apollo-link-ws');
const { SubscriptionClient } = require('subscriptions-transport-ws');
const gql = require('graphql-tag');

const getWsClient = function(wsurl, params) {
    const client =  new SubscriptionClient(wsurl, { connectionParams: params });
    return client;
};

// SUBSCRIBE
const createSubscriptionObservable = (wsurl, params, query, variables) => {
    const link = new WebSocketLink(getWsClient(wsurl, params));
    return execute(link, {query: createQuery(query), variables: variables});
};

const createQuery = (query) => gql`${query}`

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

exports.subscriptionClient = (url, params = {}, query, variables = {}) => createSubscriptionObservable(url, params, query, variables);
exports.fetchData = (url, query, operationName, variables = {}, params = {}) => executeQuery(url, query, operationName, variables, params);