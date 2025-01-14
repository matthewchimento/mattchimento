const { BetaAnalyticsDataClient } = require('@google-analytics/data');
const express = require('express');
const cors = require('cors');

// Initialize Express app
const app = express();
app.use(cors());

// Initialize Google Analytics Data API Client
const analyticsDataClient = new BetaAnalyticsDataClient({
    keyFilename: 'path-to-your-service-account.json', // Replace with your JSON file path
});

const propertyId = 'G-XGMYDB8Z40'; // Replace with your GA4 Property ID

app.get('/visitor-count', async (req, res) => {
    try {
        const [response] = await analyticsDataClient.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
            metrics: [{ name: 'activeUsers' }], // Fetches the active users
        });

        const visitorCount = response.rows[0].metricValues[0].value;
        res.json({ visitors: visitorCount });
    } catch (error) {
        console.error('Error fetching data from Google Analytics API:', error);
        res.status(500).json({ error: 'Failed to fetch visitor count' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
