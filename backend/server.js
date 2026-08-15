import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';

app.use(cors({ origin: FRONTEND_ORIGIN }));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'Bangalore Pincode Explorer API' });
});

app.get('/api/pincode/:pincode', async (req, res) => {
  const { pincode } = req.params;

  if (!/^\d{6}$/.test(pincode)) {
    return res.status(400).json({ message: 'Enter a valid 6-digit PIN code.' });
  }

  try {
    const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);

    if (!response.ok) {
      return res.status(502).json({ message: 'Postal service is temporarily unavailable.' });
    }

    const payload = await response.json();
    const offices = payload?.[0]?.PostOffice || [];

    const bangaloreOffices = offices.filter((office) => {
      const state = (office.State || '').toLowerCase();
      const district = (office.District || '').toLowerCase();
      return state === 'karnataka' && (district.includes('bangalore') || district.includes('bengaluru'));
    });

    if (!bangaloreOffices.length) {
      return res.status(404).json({ message: 'That PIN code was not found in Bangalore.' });
    }

    const uniqueOffices = [...new Map(
      bangaloreOffices.map((office) => [office.Name, {
        name: office.Name,
        district: office.District,
        state: office.State,
        pinCode: office.PINCode
      }])
    ).values()];

    return res.json({
      pincode,
      areaCount: uniqueOffices.length,
      areas: uniqueOffices
    });
  } catch (error) {
    console.error('Pincode lookup failed:', error);
    return res.status(500).json({ message: 'Unable to complete the lookup right now.' });
  }
});



app.listen(PORT, '0.0.0.0', () => {
  console.log(`API running on port ${PORT}`);
});