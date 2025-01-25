import fs from 'fs';
import data from './package.json' with {type: "json"};

const cname = data.homepage.replace('https://', '');

if (!fs.existsSync('dist')) {
  throw new Error('No dist folder found');
}

fs.appendFileSync('dist/CNAME', cname);