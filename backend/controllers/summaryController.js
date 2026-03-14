const summaryService = require('../services/summaryService');

exports.generatePatientSummary = async (req, res) => {
  try {
    const { adimeData } = req.body;
    
    if (!adimeData) {
      return res.status(400).json({ error: 'ADIME data is required to generate a summary.' });
    }

    const summaryOutput = await summaryService.generateSummary(adimeData);
    
    if (!summaryOutput) {
      return res.status(500).json({ error: 'Failed to generate patient summary.' });
    }

    res.json(summaryOutput);
  } catch (error) {
    console.error('Error generating summary:', error);
    res.status(500).json({ error: error.message || 'Internal server error during summary generation.' });
  }
};
