// pages/api/token-info.js

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({message: 'Method Not Allowed'});
    }

    const {accessToken} = req.body;

    if (!accessToken) {
        return res.status(400).json({message: 'Access token is required'});
    }

    try {
        // Make request to Wix API
        const tokenInfo = await fetch("https://www.wixapis.com/oauth2/token-info", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: accessToken,
            }),
        });

        const tokenData = await tokenInfo.json();

        // Send the siteId in the response
        res.status(200).json({siteId: tokenData.siteId});
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({message: 'Internal Server Error'});
    }
}