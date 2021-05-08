import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
    uri: "https://api.baseql.com/airtable/graphql/appWxEK9hGSlXeIVR",
    cache: new InMemoryCache(),
});

export default client;