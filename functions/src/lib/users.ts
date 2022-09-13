export const getUserInfo = async (uid: string) => {
    const wallet = await fetchNFTs(uid)

    return {
        uid,
        token: wallet.tokens
    }
}

interface GraphWallet {
    id: string
    tokens: GraphToken[]
}

interface GraphToken {
    contractAddress: string
    tokenId: string
}
const fetchNFTs = async (address: string): Promise<GraphWallet> => {
    var axios = require('axios');
    var data = JSON.stringify({
        query: `{
                    wallets(where: {id: "${address}"}) {
                        id
                        tokens {
                            tokenId
                            contractAddress
                            tokenURI
                        }
                    }
                }`,
        variables: {}
    });

    var config = {
        method: 'post',
        url: 'https://api.thegraph.com/subgraphs/name/pschoffer/egoblock',
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    };

    const response = await axios(config);

    if (response?.data?.data?.wallets?.length > 0) {
        return response.data.data.wallets[0];
    }

    return {
        id: address,
        tokens: []
    }
}