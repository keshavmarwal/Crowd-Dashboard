import client from './client';

const post = async (path, body) => (await client.post(path, body)).data;


export const getFootfall = (p) => post('/api/analytics/footfall', p); 
export const getDwell = (p) => post('/api/analytics/dwell', p); 
export const getOccupancy = (p) => post('/api/analytics/occupancy', p); 
export const getDemographics = (p) => post('/api/analytics/demographics', p); 


export const getEntryExit = (p) => post('/api/analytics/entry-exit', p);
