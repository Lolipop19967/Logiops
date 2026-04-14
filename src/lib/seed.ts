// seed.ts — run once to populate Firestore with rich demo data
// Usage: npx ts-node src/lib/seed.ts  OR import and call seedAll() in a page

import { db } from './firebase'
import { collection, doc, setDoc, writeBatch } from 'firebase/firestore'

export const SEED_CUSTOMERS = [
  { id: 'c1', name: 'Apex Distributors', industry: 'FMCG', region: 'Gauteng', tier: 'Premium', revenue: 285000, shipments: 42, balance: 18500, status: 'Active', phone: '011 555 0101', email: 'ops@apexdist.co.za', contact: 'Thandi Mokoena', credit: 30 },
  { id: 'c2', name: 'Cape Cargo Co.', industry: 'Retail', region: 'Western Cape', tier: 'Standard', revenue: 142000, shipments: 28, balance: 4200, status: 'Active', phone: '021 555 0202', email: 'finance@capecargo.co.za', contact: 'Johan van der Berg', credit: 60 },
  { id: 'c3', name: 'Highveld Logistics', industry: 'Mining', region: 'Mpumalanga', tier: 'Enterprise', revenue: 620000, shipments: 95, balance: 0, status: 'Active', phone: '013 555 0303', email: 'admin@highveld.co.za', contact: 'Sipho Dlamini', credit: 90 },
  { id: 'c4', name: 'Durban Direct', industry: 'Import/Export', region: 'KwaZulu-Natal', tier: 'Standard', revenue: 98000, shipments: 17, balance: 32100, status: 'On Hold', phone: '031 555 0404', email: 'info@durbandirect.co.za', contact: 'Priya Naidoo', credit: 30 },
  { id: 'c5', name: 'Bush Bulk Transport', industry: 'Agriculture', region: 'Limpopo', tier: 'Standard', revenue: 74000, shipments: 21, balance: 0, status: 'Active', phone: '015 555 0505', email: 'ops@bushbulk.co.za', contact: 'Petrus Viljoen', credit: 60 },
  { id: 'c6', name: 'Platinum Ridge Mining', industry: 'Mining', region: 'North West', tier: 'Enterprise', revenue: 890000, shipments: 112, balance: 0, status: 'Active', phone: '018 555 0606', email: 'logistics@platinumridge.co.za', contact: 'Koos Steyn', credit: 90 },
  { id: 'c7', name: 'Suncoast Foods', industry: 'FMCG', region: 'KwaZulu-Natal', tier: 'Premium', revenue: 312000, shipments: 56, balance: 8900, status: 'Active', phone: '031 555 0707', email: 'supply@suncoastfoods.co.za', contact: 'Naledi Dube', credit: 30 },
  { id: 'c8', name: 'Eastern Cape Agri', industry: 'Agriculture', region: 'Eastern Cape', tier: 'Standard', revenue: 56000, shipments: 14, balance: 0, status: 'Active', phone: '041 555 0808', email: 'farming@ecagri.co.za', contact: 'Pieter Bezuidenhout', credit: 60 },
  { id: 'c9', name: 'Tswane Tech Imports', industry: 'Electronics', region: 'Gauteng', tier: 'Premium', revenue: 445000, shipments: 38, balance: 12000, status: 'Active', phone: '012 555 0909', email: 'customs@tswanetech.co.za', contact: 'Yusuf Moosa', credit: 30 },
  { id: 'c10', name: 'Free State Grains', industry: 'Agriculture', region: 'Free State', tier: 'Standard', revenue: 67000, shipments: 19, balance: 3400, status: 'Active', phone: '051 555 1010', email: 'grain@fsgrains.co.za', contact: 'Elmarie Cronje', credit: 60 },
  { id: 'c11', name: 'Namaqua Minerals', industry: 'Mining', region: 'Northern Cape', tier: 'Enterprise', revenue: 730000, shipments: 88, balance: 0, status: 'Active', phone: '054 555 1111', email: 'ops@namaqua.co.za', contact: 'Louw van Zyl', credit: 90 },
  { id: 'c12', name: 'JHB Cold Chain', industry: 'Refrigerated', region: 'Gauteng', tier: 'Premium', revenue: 198000, shipments: 45, balance: 5100, status: 'Active', phone: '011 555 1212', email: 'cold@jhbchain.co.za', contact: 'Amina Patel', credit: 30 },
  { id: 'c13', name: 'Port Elizabeth Ports', industry: 'Import/Export', region: 'Eastern Cape', tier: 'Enterprise', revenue: 520000, shipments: 74, balance: 0, status: 'Active', phone: '041 555 1313', email: 'portops@peports.co.za', contact: 'Zandile Ntuli', credit: 90 },
  { id: 'c14', name: 'Bloemfontein Builders', industry: 'Construction', region: 'Free State', tier: 'Standard', revenue: 83000, shipments: 22, balance: 7600, status: 'On Hold', phone: '051 555 1414', email: 'site@bloembuilders.co.za', contact: 'Francois du Preez', credit: 30 },
  { id: 'c15', name: 'Maputo Express', industry: 'Cross-Border', region: 'Mozambique', tier: 'Premium', revenue: 267000, shipments: 33, balance: 0, status: 'Active', phone: '+258 21 555 1515', email: 'maputo@expressline.mz', contact: 'Carlos Machava', credit: 60 },
]

export const SEED_CONTACTS = [
  { id: 'ct1', customerId: 'c1', customerName: 'Apex Distributors', name: 'Thandi Mokoena', role: 'Operations Manager', email: 't.mokoena@apexdist.co.za', phone: '083 111 2222', dept: 'Operations' },
  { id: 'ct2', customerId: 'c1', customerName: 'Apex Distributors', name: 'Ravi Pillay', role: 'Finance Director', email: 'r.pillay@apexdist.co.za', phone: '082 333 4444', dept: 'Finance' },
  { id: 'ct3', customerId: 'c2', customerName: 'Cape Cargo Co.', name: 'Johan van der Berg', role: 'Procurement', email: 'j.vdberg@capecargo.co.za', phone: '073 555 6666', dept: 'Procurement' },
  { id: 'ct4', customerId: 'c3', customerName: 'Highveld Logistics', name: 'Sipho Dlamini', role: 'CEO', email: 's.dlamini@highveld.co.za', phone: '083 777 8888', dept: 'Executive' },
  { id: 'ct5', customerId: 'c4', customerName: 'Durban Direct', name: 'Priya Naidoo', role: 'Accounts', email: 'p.naidoo@durbandirect.co.za', phone: '071 999 0000', dept: 'Finance' },
  { id: 'ct6', customerId: 'c6', customerName: 'Platinum Ridge Mining', name: 'Koos Steyn', role: 'Logistics Director', email: 'k.steyn@platinumridge.co.za', phone: '082 100 1100', dept: 'Logistics' },
  { id: 'ct7', customerId: 'c7', customerName: 'Suncoast Foods', name: 'Naledi Dube', role: 'Supply Chain Manager', email: 'n.dube@suncoastfoods.co.za', phone: '076 200 2200', dept: 'Supply Chain' },
  { id: 'ct8', customerId: 'c9', customerName: 'Tswane Tech Imports', name: 'Yusuf Moosa', role: 'Import/Export Manager', email: 'y.moosa@tswanetech.co.za', phone: '084 300 3300', dept: 'Imports' },
  { id: 'ct9', customerId: 'c11', customerName: 'Namaqua Minerals', name: 'Louw van Zyl', role: 'Operations Director', email: 'l.vanzyl@namaqua.co.za', phone: '072 400 4400', dept: 'Operations' },
  { id: 'ct10', customerId: 'c12', customerName: 'JHB Cold Chain', name: 'Amina Patel', role: 'Cold Chain Coordinator', email: 'a.patel@jhbchain.co.za', phone: '083 500 5500', dept: 'Operations' },
  { id: 'ct11', customerId: 'c13', customerName: 'Port Elizabeth Ports', name: 'Zandile Ntuli', role: 'Port Operations Manager', email: 'z.ntuli@peports.co.za', phone: '071 600 6600', dept: 'Port Ops' },
  { id: 'ct12', customerId: 'c15', customerName: 'Maputo Express', name: 'Carlos Machava', role: 'Country Manager', email: 'c.machava@expressline.mz', phone: '+258 84 700 7700', dept: 'Management' },
  { id: 'ct13', customerId: 'c5', customerName: 'Bush Bulk Transport', name: 'Petrus Viljoen', role: 'Farmer / Owner', email: 'p.viljoen@bushbulk.co.za', phone: '072 800 8800', dept: 'Executive' },
  { id: 'ct14', customerId: 'c8', customerName: 'Eastern Cape Agri', name: 'Pieter Bezuidenhout', role: 'Farm Manager', email: 'p.bezuidenhout@ecagri.co.za', phone: '083 900 9900', dept: 'Operations' },
  { id: 'ct15', customerId: 'c10', customerName: 'Free State Grains', name: 'Elmarie Cronje', role: 'Procurement Officer', email: 'e.cronje@fsgrains.co.za', phone: '082 010 0101', dept: 'Procurement' },
]

export const SEED_LEADS = [
  { id: 'l1', company: 'Joburg Wholesale', contact: 'Mark Smith', value: 85000, stage: 'Qualified', source: 'Referral', rep: 'Ayanda K.', notes: 'Needs refrigerated capacity', created: '2025-01-10' },
  { id: 'l2', company: 'Pretoria Pharma', contact: 'Dr. E. Botha', value: 220000, stage: 'Quoted', source: 'Web', rep: 'Ayanda K.', notes: 'GDP certified required', created: '2025-01-15' },
  { id: 'l3', company: 'Kimberley Miners', contact: 'Fanie du Plessis', value: 390000, stage: 'Prospect', source: 'Cold Call', rep: 'Lwando M.', notes: 'Large oversize loads', created: '2025-01-18' },
  { id: 'l4', company: 'East Rand Cold Storage', contact: 'James Lee', value: 150000, stage: 'Won', source: 'Tender', rep: 'Lwando M.', notes: '', created: '2025-01-05' },
  { id: 'l5', company: 'Bloemfontein Foods', contact: 'Zanele Khumalo', value: 60000, stage: 'Lost', source: 'Referral', rep: 'Ayanda K.', notes: 'Lost on price', created: '2024-12-20' },
  { id: 'l6', company: 'Richards Bay Coal', contact: 'Bruno Ferreira', value: 580000, stage: 'Qualified', source: 'Tender', rep: 'Lwando M.', notes: 'Bulk coal haul, export route', created: '2025-01-22' },
  { id: 'l7', company: 'Harare Distributors', contact: 'Takeshi Mpofu', value: 320000, stage: 'Prospect', source: 'Cold Call', rep: 'Nomsa P.', notes: 'Cross-border Zim route', created: '2025-01-24' },
  { id: 'l8', company: 'Secunda Petrochemicals', contact: 'Rina Booysen', value: 480000, stage: 'Quoted', source: 'Web', rep: 'Ayanda K.', notes: 'Hazmat certified vehicles needed', created: '2025-01-19' },
  { id: 'l9', company: 'Cape Winelands Exports', contact: 'Dirk Hanekom', value: 145000, stage: 'Qualified', source: 'Referral', rep: 'Nomsa P.', notes: 'Temperature controlled wine shipments', created: '2025-01-26' },
  { id: 'l10', company: 'Lusaka Import Co.', contact: 'Grace Mwale', value: 275000, stage: 'Prospect', source: 'Cold Call', rep: 'Lwando M.', notes: 'Zambia corridor route interest', created: '2025-01-28' },
  { id: 'l11', company: 'Pietermaritzburg Steel', contact: 'Thabo Hadebe', value: 195000, stage: 'Qualified', source: 'Existing Customer', rep: 'Ayanda K.', notes: 'Heavy steel beams', created: '2025-01-20' },
  { id: 'l12', company: 'Nelspruit Fresh Produce', contact: 'Kobus Pretorius', value: 88000, stage: 'Won', source: 'Referral', rep: 'Nomsa P.', notes: 'Perishable reefer loads', created: '2025-01-12' },
]

export const SEED_SHIPMENTS = [
  { id: 'SH-1001', customerId: 'c1', customer: 'Apex Distributors', origin: 'Johannesburg', dest: 'Cape Town', status: 'In Transit', driver: 'Moses Sithole', vehicle: 'GP 12 ABC', weight: 4200, cargo: 'FMCG', eta: '2025-02-03', created: '2025-01-28', legs: 2, value: 8400, pod: false },
  { id: 'SH-1002', customerId: 'c3', customer: 'Highveld Logistics', origin: 'Witbank', dest: 'Durban', status: 'Delivered', driver: 'Sipho Ndlovu', vehicle: 'MP 34 DEF', weight: 18500, cargo: 'Mining Equipment', eta: '2025-01-30', created: '2025-01-27', legs: 1, value: 24000, pod: true },
  { id: 'SH-1003', customerId: 'c2', customer: 'Cape Cargo Co.', origin: 'Cape Town', dest: 'Johannesburg', status: 'Booked', driver: '—', vehicle: '—', weight: 2100, cargo: 'Retail Goods', eta: '2025-02-06', created: '2025-01-30', legs: 1, value: 5200, pod: false },
  { id: 'SH-1004', customerId: 'c4', customer: 'Durban Direct', origin: 'Durban', dest: 'Maputo', status: 'Customs Hold', driver: 'Themba Khoza', vehicle: 'KZN 56 GHI', weight: 6800, cargo: 'Import Goods', eta: '2025-02-04', created: '2025-01-29', legs: 3, value: 14800, pod: false },
  { id: 'SH-1005', customerId: 'c5', customer: 'Bush Bulk Transport', origin: 'Polokwane', dest: 'Beit Bridge', status: 'In Transit', driver: 'Andre Botha', vehicle: 'LP 78 JKL', weight: 22000, cargo: 'Agricultural', eta: '2025-02-02', created: '2025-01-28', legs: 2, value: 18600, pod: false },
  { id: 'SH-1006', customerId: 'c6', customer: 'Platinum Ridge Mining', origin: 'Rustenburg', dest: 'Durban Port', status: 'In Transit', driver: 'Bongani Sithole', vehicle: 'NW 11 ABC', weight: 32000, cargo: 'Platinum Ore', eta: '2025-02-04', created: '2025-01-29', legs: 2, value: 38500, pod: false },
  { id: 'SH-1007', customerId: 'c7', customer: 'Suncoast Foods', origin: 'Durban', dest: 'Johannesburg', status: 'Delivered', driver: 'Sipho Ndlovu', vehicle: 'KZN 22 XYZ', weight: 8600, cargo: 'Food Products', eta: '2025-01-31', created: '2025-01-28', legs: 1, value: 9800, pod: true },
  { id: 'SH-1008', customerId: 'c9', customer: 'Tswane Tech Imports', origin: 'Cape Town Port', dest: 'Pretoria', status: 'Booked', driver: '—', vehicle: '—', weight: 3400, cargo: 'Electronics', eta: '2025-02-07', created: '2025-01-31', legs: 2, value: 7600, pod: false },
  { id: 'SH-1009', customerId: 'c11', customer: 'Namaqua Minerals', origin: 'Springbok', dest: 'Port Nolloth', status: 'In Transit', driver: 'Leon Pretorius', vehicle: 'NC 55 MNO', weight: 28000, cargo: 'Diamonds / Minerals', eta: '2025-02-02', created: '2025-01-30', legs: 1, value: 31000, pod: false },
  { id: 'SH-1010', customerId: 'c12', customer: 'JHB Cold Chain', origin: 'Johannesburg', dest: 'Cape Town', status: 'In Transit', driver: 'Moses Sithole', vehicle: 'GP 88 CLD', weight: 5200, cargo: 'Frozen Goods', eta: '2025-02-03', created: '2025-01-29', legs: 2, value: 11200, pod: false },
  { id: 'SH-1011', customerId: 'c13', customer: 'Port Elizabeth Ports', origin: 'PE Port', dest: 'Johannesburg', status: 'Delivered', driver: 'Themba Khoza', vehicle: 'EC 33 PQR', weight: 14000, cargo: 'Container Cargo', eta: '2025-01-30', created: '2025-01-27', legs: 2, value: 19500, pod: true },
  { id: 'SH-1012', customerId: 'c15', customer: 'Maputo Express', origin: 'Johannesburg', dest: 'Maputo', status: 'Customs Hold', driver: 'Andre Botha', vehicle: 'LP 78 JKL', weight: 9800, cargo: 'General Goods', eta: '2025-02-05', created: '2025-01-30', legs: 3, value: 16400, pod: false },
  { id: 'SH-1013', customerId: 'c3', customer: 'Highveld Logistics', origin: 'Witbank', dest: 'Richards Bay', status: 'Booked', driver: '—', vehicle: '—', weight: 35000, cargo: 'Coal', eta: '2025-02-08', created: '2025-01-31', legs: 1, value: 42000, pod: false },
  { id: 'SH-1014', customerId: 'c6', customer: 'Platinum Ridge Mining', origin: 'Brits', dest: 'Saldanha Bay', status: 'In Transit', driver: 'Bongani Sithole', vehicle: 'NW 11 ABC', weight: 28000, cargo: 'Chrome Ore', eta: '2025-02-04', created: '2025-01-28', legs: 3, value: 34000, pod: false },
  { id: 'SH-1015', customerId: 'c1', customer: 'Apex Distributors', origin: 'Johannesburg', dest: 'Port Elizabeth', status: 'Delivered', driver: 'Zanele Mthembu', vehicle: 'GP 44 DEF', weight: 3800, cargo: 'FMCG', eta: '2025-01-29', created: '2025-01-26', legs: 1, value: 7200, pod: true },
  { id: 'SH-1016', customerId: 'c7', customer: 'Suncoast Foods', origin: 'Pietermaritzburg', dest: 'Cape Town', status: 'In Transit', driver: 'Leon Pretorius', vehicle: 'KZN 22 XYZ', weight: 6400, cargo: 'Perishable Food', eta: '2025-02-04', created: '2025-01-29', legs: 2, value: 9300, pod: false },
  { id: 'SH-1017', customerId: 'c2', customer: 'Cape Cargo Co.', origin: 'Cape Town', dest: 'Bloemfontein', status: 'Delivered', driver: 'Sipho Ndlovu', vehicle: 'MP 34 DEF', weight: 4100, cargo: 'Retail Goods', eta: '2025-01-28', created: '2025-01-26', legs: 1, value: 6800, pod: true },
  { id: 'SH-1018', customerId: 'c9', customer: 'Tswane Tech Imports', origin: 'OR Tambo', dest: 'Pretoria', status: 'Delivered', driver: 'Zanele Mthembu', vehicle: 'GP 44 DEF', weight: 1200, cargo: 'Electronics', eta: '2025-01-29', created: '2025-01-29', legs: 1, value: 4500, pod: true },
  { id: 'SH-1019', customerId: 'c10', customer: 'Free State Grains', origin: 'Bloemfontein', dest: 'Durban Port', status: 'Booked', driver: '—', vehicle: '—', weight: 42000, cargo: 'Grain / Wheat', eta: '2025-02-09', created: '2025-01-31', legs: 1, value: 28000, pod: false },
  { id: 'SH-1020', customerId: 'c8', customer: 'Eastern Cape Agri', origin: 'East London', dest: 'Johannesburg', status: 'Booked', driver: '—', vehicle: '—', weight: 18000, cargo: 'Agricultural Produce', eta: '2025-02-10', created: '2025-01-31', legs: 2, value: 14800, pod: false },
]

export const SEED_QUOTES = [
  { id: 'QT-2001', customerId: 'c1', customer: 'Apex Distributors', origin: 'Johannesburg', dest: 'Bloemfontein', cargo: 'FMCG', weight: 3000, amount: 6800, status: 'Sent', created: '2025-01-30', margin: 22, rep: 'Ayanda K.' },
  { id: 'QT-2002', customerId: 'c3', customer: 'Highveld Logistics', origin: 'Witbank', dest: 'Richards Bay', cargo: 'Coal', weight: 35000, amount: 42000, status: 'Accepted', created: '2025-01-28', margin: 18, rep: 'Lwando M.' },
  { id: 'QT-2003', customerId: 'c2', customer: 'Cape Cargo Co.', origin: 'Cape Town', dest: 'Port Elizabeth', cargo: 'Retail', weight: 1800, amount: 3400, status: 'Draft', created: '2025-01-31', margin: 28, rep: 'Ayanda K.' },
  { id: 'QT-2004', customerId: 'c5', customer: 'Bush Bulk Transport', origin: 'Musina', dest: 'Johannesburg', cargo: 'Produce', weight: 12000, amount: 14500, status: 'Rejected', created: '2025-01-25', margin: 15, rep: 'Lwando M.' },
  { id: 'QT-2005', customerId: 'c6', customer: 'Platinum Ridge Mining', origin: 'Rustenburg', dest: 'Durban Port', cargo: 'Platinum Ore', weight: 32000, amount: 38500, status: 'Accepted', created: '2025-01-27', margin: 21, rep: 'Lwando M.' },
  { id: 'QT-2006', customerId: 'c9', customer: 'Tswane Tech Imports', origin: 'Cape Town Port', dest: 'Pretoria', cargo: 'Electronics', weight: 3400, amount: 7600, status: 'Sent', created: '2025-01-30', margin: 24, rep: 'Nomsa P.' },
  { id: 'QT-2007', customerId: 'c15', customer: 'Maputo Express', origin: 'Johannesburg', dest: 'Maputo', cargo: 'General Goods', weight: 9800, amount: 16400, status: 'Accepted', created: '2025-01-28', margin: 19, rep: 'Nomsa P.' },
  { id: 'QT-2008', customerId: 'c12', customer: 'JHB Cold Chain', origin: 'Johannesburg', dest: 'Cape Town', cargo: 'Frozen Goods', weight: 5200, amount: 11200, status: 'Accepted', created: '2025-01-27', margin: 26, rep: 'Ayanda K.' },
  { id: 'QT-2009', customerId: 'c7', customer: 'Suncoast Foods', origin: 'Durban', dest: 'Johannesburg', cargo: 'Food Products', weight: 8600, amount: 9800, status: 'Accepted', created: '2025-01-26', margin: 17, rep: 'Nomsa P.' },
  { id: 'QT-2010', customerId: 'c11', customer: 'Namaqua Minerals', origin: 'Springbok', dest: 'Port Nolloth', cargo: 'Minerals', weight: 28000, amount: 31000, status: 'Sent', created: '2025-01-29', margin: 20, rep: 'Lwando M.' },
  { id: 'QT-2011', customerId: 'c13', customer: 'Port Elizabeth Ports', origin: 'PE Port', dest: 'Johannesburg', cargo: 'Container Cargo', weight: 14000, amount: 19500, status: 'Accepted', created: '2025-01-25', margin: 23, rep: 'Nomsa P.' },
  { id: 'QT-2012', customerId: 'c10', customer: 'Free State Grains', origin: 'Bloemfontein', dest: 'Durban Port', cargo: 'Grain', weight: 42000, amount: 28000, status: 'Draft', created: '2025-01-31', margin: 14, rep: 'Lwando M.' },
]

export const SEED_INVOICES = [
  { id: 'INV-3001', customerId: 'c1', customer: 'Apex Distributors', shipment: 'SH-1015', amount: 7200, status: 'Paid', issued: '2025-01-30', due: '2025-03-01', paid: 7200 },
  { id: 'INV-3002', customerId: 'c3', customer: 'Highveld Logistics', shipment: 'SH-1002', amount: 24000, status: 'Paid', issued: '2025-01-30', due: '2025-03-01', paid: 24000 },
  { id: 'INV-3003', customerId: 'c4', customer: 'Durban Direct', shipment: 'SH-1004', amount: 14800, status: 'Overdue', issued: '2025-01-01', due: '2025-01-31', paid: 5000 },
  { id: 'INV-3004', customerId: 'c2', customer: 'Cape Cargo Co.', shipment: 'SH-1017', amount: 6800, status: 'Paid', issued: '2025-01-29', due: '2025-03-01', paid: 6800 },
  { id: 'INV-3005', customerId: 'c6', customer: 'Platinum Ridge Mining', shipment: 'SH-1006', amount: 38500, status: 'Sent', issued: '2025-01-31', due: '2025-04-30', paid: 0 },
  { id: 'INV-3006', customerId: 'c7', customer: 'Suncoast Foods', shipment: 'SH-1007', amount: 9800, status: 'Paid', issued: '2025-02-01', due: '2025-03-03', paid: 9800 },
  { id: 'INV-3007', customerId: 'c9', customer: 'Tswane Tech Imports', shipment: 'SH-1018', amount: 4500, status: 'Sent', issued: '2025-01-30', due: '2025-03-01', paid: 0 },
  { id: 'INV-3008', customerId: 'c11', customer: 'Namaqua Minerals', shipment: 'SH-1009', amount: 31000, status: 'Sent', issued: '2025-01-31', due: '2025-04-30', paid: 0 },
  { id: 'INV-3009', customerId: 'c12', customer: 'JHB Cold Chain', shipment: 'SH-1010', amount: 11200, status: 'Draft', issued: '2025-01-31', due: '2025-03-02', paid: 0 },
  { id: 'INV-3010', customerId: 'c13', customer: 'Port Elizabeth Ports', shipment: 'SH-1011', amount: 19500, status: 'Paid', issued: '2025-01-31', due: '2025-04-30', paid: 19500 },
  { id: 'INV-3011', customerId: 'c3', customer: 'Highveld Logistics', shipment: 'SH-1013', amount: 42000, status: 'Draft', issued: '2025-01-31', due: '2025-04-30', paid: 0 },
  { id: 'INV-3012', customerId: 'c5', customer: 'Bush Bulk Transport', shipment: 'SH-1005', amount: 18600, status: 'Sent', issued: '2025-01-30', due: '2025-03-31', paid: 0 },
  { id: 'INV-3013', customerId: 'c1', customer: 'Apex Distributors', shipment: 'SH-1001', amount: 8400, status: 'Sent', issued: '2025-01-31', due: '2025-03-02', paid: 0 },
  { id: 'INV-3014', customerId: 'c14', customer: 'Bloemfontein Builders', shipment: 'SH-0999', amount: 9400, status: 'Overdue', issued: '2024-12-15', due: '2025-01-14', paid: 1800 },
]

export const SEED_VEHICLES = [
  { id: 'v1', reg: 'GP 12 ABC', make: 'Volvo', model: 'FH 460', type: 'Truck', capacity: 30000, status: 'In Use', km: 284500, service: '2025-03-15', rw: '2025-06-30', insurance: '2025-12-31', driver: 'Moses Sithole' },
  { id: 'v2', reg: 'MP 34 DEF', make: 'Mercedes', model: 'Actros 2644', type: 'Truck', capacity: 26000, status: 'Available', km: 192000, service: '2025-02-20', rw: '2025-09-30', insurance: '2025-12-31', driver: '—' },
  { id: 'v3', reg: 'KZN 56 GHI', make: 'MAN', model: 'TGX 26.440', type: 'Truck', capacity: 28000, status: 'In Use', km: 347800, service: '2025-04-10', rw: '2025-05-31', insurance: '2025-12-31', driver: 'Themba Khoza' },
  { id: 'v4', reg: 'LP 78 JKL', make: 'Scania', model: 'R500', type: 'Truck', capacity: 32000, status: 'In Use', km: 156200, service: '2025-02-28', rw: '2025-08-31', insurance: '2025-12-31', driver: 'Andre Botha' },
  { id: 'v5', reg: 'WC 90 MNO', make: 'Isuzu', model: 'FTR 850', type: 'Rigid', capacity: 8000, status: 'Maintenance', km: 98400, service: '2025-02-01', rw: '2025-07-31', insurance: '2025-12-31', driver: '—' },
  { id: 'v6', reg: 'NW 11 ABC', make: 'Scania', model: 'G500', type: 'Truck', capacity: 34000, status: 'In Use', km: 221300, service: '2025-03-20', rw: '2025-10-31', insurance: '2025-12-31', driver: 'Bongani Sithole' },
  { id: 'v7', reg: 'KZN 22 XYZ', make: 'Volvo', model: 'FMX 440', type: 'Truck', capacity: 28000, status: 'In Use', km: 178900, service: '2025-03-08', rw: '2025-11-30', insurance: '2025-12-31', driver: 'Leon Pretorius' },
  { id: 'v8', reg: 'GP 44 DEF', make: 'Mercedes', model: 'Sprinter 519', type: 'Van', capacity: 3500, status: 'In Use', km: 64700, service: '2025-02-14', rw: '2025-09-30', insurance: '2025-12-31', driver: 'Zanele Mthembu' },
  { id: 'v9', reg: 'NC 55 MNO', make: 'MAN', model: 'TGS 33.480', type: 'Truck', capacity: 30000, status: 'Available', km: 302100, service: '2025-04-01', rw: '2025-06-30', insurance: '2025-12-31', driver: '—' },
  { id: 'v10', reg: 'EC 33 PQR', make: 'DAF', model: 'XF 480', type: 'Truck', capacity: 26000, status: 'In Use', km: 411500, service: '2025-02-18', rw: '2025-04-30', insurance: '2025-12-31', driver: 'Sipho Ndlovu' },
  { id: 'v11', reg: 'GP 88 CLD', make: 'Volvo', model: 'FH 460 Reefer', type: 'Reefer', capacity: 22000, status: 'In Use', km: 142600, service: '2025-03-25', rw: '2025-08-31', insurance: '2025-12-31', driver: 'Moses Sithole' },
  { id: 'v12', reg: 'FS 77 STU', make: 'Hino', model: '500 1626', type: 'Rigid', capacity: 12000, status: 'Maintenance', km: 88200, service: '2025-02-07', rw: '2025-10-31', insurance: '2025-12-31', driver: '—' },
]

export const SEED_DRIVERS = [
  { id: 'd1', name: 'Moses Sithole', license: 'Code 14', prcp: 'Valid', medical: '2025-06-30', hours: 38, maxHours: 60, status: 'Active', phone: '082 100 2000', vehicle: 'GP 12 ABC', trips: 84 },
  { id: 'd2', name: 'Sipho Ndlovu', license: 'Code 14', prcp: 'Valid', medical: '2025-08-15', hours: 12, maxHours: 60, status: 'Active', phone: '083 200 3000', vehicle: 'EC 33 PQR', trips: 71 },
  { id: 'd3', name: 'Themba Khoza', license: 'Code 14', prcp: 'Valid', medical: '2025-03-01', hours: 55, maxHours: 60, status: 'Active', phone: '071 300 4000', vehicle: 'KZN 56 GHI', trips: 62 },
  { id: 'd4', name: 'Andre Botha', license: 'Code 14', prcp: 'Expiring', medical: '2025-12-31', hours: 44, maxHours: 60, status: 'Active', phone: '076 400 5000', vehicle: 'LP 78 JKL', trips: 93 },
  { id: 'd5', name: 'Zanele Mthembu', license: 'Code 10', prcp: 'Valid', medical: '2025-09-30', hours: 0, maxHours: 60, status: 'Off Duty', phone: '084 500 6000', vehicle: 'GP 44 DEF', trips: 34 },
  { id: 'd6', name: 'Bongani Sithole', license: 'Code 14', prcp: 'Valid', medical: '2026-01-15', hours: 48, maxHours: 60, status: 'Active', phone: '082 600 7000', vehicle: 'NW 11 ABC', trips: 57 },
  { id: 'd7', name: 'Leon Pretorius', license: 'Code 14', prcp: 'Valid', medical: '2025-11-20', hours: 29, maxHours: 60, status: 'Active', phone: '076 700 8000', vehicle: 'KZN 22 XYZ', trips: 45 },
  { id: 'd8', name: 'Fatima Ismail', license: 'Code 10', prcp: 'Expired', medical: '2025-05-14', hours: 0, maxHours: 60, status: 'Suspended', phone: '083 800 9000', vehicle: '—', trips: 28 },
  { id: 'd9', name: 'Patrick Moyo', license: 'Code 14', prcp: 'Valid', medical: '2025-10-31', hours: 52, maxHours: 60, status: 'Active', phone: '071 900 0001', vehicle: 'Available', trips: 39 },
  { id: 'd10', name: 'Christel van Rensburg', license: 'Code 14', prcp: 'Valid', medical: '2025-07-22', hours: 8, maxHours: 60, status: 'Active', phone: '084 010 1010', vehicle: 'Available', trips: 61 },
]

export const SEED_ROUTES = [
  { id: 'r1', origin: 'Johannesburg', dest: 'Cape Town', distance: 1398, transitDays: 2, baseRate: 8.50, cargoType: 'General', sla: '48h', volume: 24 },
  { id: 'r2', origin: 'Johannesburg', dest: 'Durban', distance: 569, transitDays: 1, baseRate: 6.20, cargoType: 'General', sla: '24h', volume: 38 },
  { id: 'r3', origin: 'Witbank', dest: 'Richards Bay', distance: 298, transitDays: 1, baseRate: 5.80, cargoType: 'Bulk', sla: '24h', volume: 15 },
  { id: 'r4', origin: 'Durban', dest: 'Maputo', distance: 312, transitDays: 2, baseRate: 12.40, cargoType: 'Cross-Border', sla: '48h', volume: 8 },
  { id: 'r5', origin: 'Polokwane', dest: 'Beit Bridge', distance: 290, transitDays: 1, baseRate: 11.20, cargoType: 'Cross-Border', sla: '24h', volume: 6 },
  { id: 'r6', origin: 'Rustenburg', dest: 'Durban Port', distance: 632, transitDays: 1, baseRate: 7.80, cargoType: 'Bulk', sla: '24h', volume: 19 },
  { id: 'r7', origin: 'Johannesburg', dest: 'Lusaka', distance: 1400, transitDays: 3, baseRate: 14.20, cargoType: 'Cross-Border', sla: '72h', volume: 4 },
  { id: 'r8', origin: 'Cape Town', dest: 'Bloemfontein', distance: 990, transitDays: 1, baseRate: 7.40, cargoType: 'General', sla: '24h', volume: 11 },
  { id: 'r9', origin: 'Johannesburg', dest: 'Harare', distance: 877, transitDays: 2, baseRate: 13.10, cargoType: 'Cross-Border', sla: '48h', volume: 5 },
  { id: 'r10', origin: 'Cape Town', dest: 'Saldanha Bay', distance: 126, transitDays: 1, baseRate: 4.90, cargoType: 'Bulk', sla: '24h', volume: 9 },
  { id: 'r11', origin: 'Johannesburg', dest: 'Port Elizabeth', distance: 1057, transitDays: 2, baseRate: 7.90, cargoType: 'General', sla: '48h', volume: 14 },
  { id: 'r12', origin: 'Johannesburg', dest: 'East London', distance: 1020, transitDays: 2, baseRate: 7.60, cargoType: 'General', sla: '48h', volume: 7 },
]

export const SEED_WAREHOUSES = [
  { id: 'w1', name: 'JHB Central Hub', city: 'Johannesburg', capacity: 5000, used: 3200, type: 'General', cold: false, hazmat: false, manager: 'Bongani Zulu' },
  { id: 'w2', name: 'Cape Town Gateway', city: 'Cape Town', capacity: 3000, used: 1100, type: 'General', cold: true, hazmat: false, manager: 'Nadia Petersen' },
  { id: 'w3', name: 'Durban Port Depot', city: 'Durban', capacity: 4000, used: 3800, type: 'Port Adjacent', cold: false, hazmat: true, manager: 'Raj Govender' },
  { id: 'w4', name: 'Pretoria North Yard', city: 'Pretoria', capacity: 2500, used: 1400, type: 'General', cold: false, hazmat: false, manager: 'Lungelo Mthembu' },
  { id: 'w5', name: 'Richards Bay Bulk', city: 'Richards Bay', capacity: 8000, used: 6400, type: 'Port Adjacent', cold: false, hazmat: true, manager: 'Steve Ramsamy' },
  { id: 'w6', name: 'Polokwane Distribution', city: 'Polokwane', capacity: 1800, used: 720, type: 'General', cold: false, hazmat: false, manager: 'Dineo Madiba' },
  { id: 'w7', name: 'PE Container Depot', city: 'Port Elizabeth', capacity: 3500, used: 2900, type: 'Port Adjacent', cold: false, hazmat: false, manager: 'Xolani Mbeki' },
]

export const SEED_CARRIERS = [
  { id: 'ca1', name: 'Speedy Freight SA', type: 'Road', rating: 4.5, shipments: 28, onTime: 89, status: 'Active', contact: 'Dave van Niekerk', phone: '011 600 7000' },
  { id: 'ca2', name: 'TransAfrica Hauliers', type: 'Cross-Border', rating: 4.2, shipments: 15, onTime: 80, status: 'Active', contact: 'Flora Banda', phone: '012 700 8000' },
  { id: 'ca3', name: 'MariLink Containers', type: 'Sea', rating: 4.7, shipments: 9, onTime: 94, status: 'Active', contact: 'Yuki Tanaka', phone: '021 800 9000' },
  { id: 'ca4', name: 'Zim Corridor Logistics', type: 'Cross-Border', rating: 3.9, shipments: 11, onTime: 76, status: 'Active', contact: 'Grace Makoni', phone: '012 900 0001' },
  { id: 'ca5', name: 'Cape Rail Freight', type: 'Rail', rating: 4.3, shipments: 22, onTime: 85, status: 'Active', contact: 'Etienne le Roux', phone: '021 010 1111' },
  { id: 'ca6', name: 'SkyBridge Cargo', type: 'Air', rating: 4.8, shipments: 6, onTime: 97, status: 'Active', contact: 'Priya Maharaj', phone: '011 020 2222' },
  { id: 'ca7', name: 'Moz Express Hauliers', type: 'Cross-Border', rating: 4.0, shipments: 8, onTime: 78, status: 'Active', contact: 'Armando Cumbe', phone: '+258 21 030 3333' },
]

export const SEED_COMPLIANCE = [
  { id: 'co1', category: 'Driver', entity: 'Moses Sithole', doc: 'PDP Certificate', expiry: '2025-07-15', status: 'Valid' },
  { id: 'co2', category: 'Driver', entity: 'Andre Botha', doc: 'PDP Certificate', expiry: '2025-02-28', status: 'Expiring' },
  { id: 'co3', category: 'Vehicle', entity: 'KZN 56 GHI', doc: 'Roadworthy Certificate', expiry: '2025-05-31', status: 'Valid' },
  { id: 'co4', category: 'Vehicle', entity: 'WC 90 MNO', doc: 'Cross-Border Permit', expiry: '2025-01-31', status: 'Expired' },
  { id: 'co5', category: 'Customer', entity: 'Highveld Logistics', doc: 'Service Contract', expiry: '2025-06-30', status: 'Valid' },
  { id: 'co6', category: 'Customer', entity: 'Pretoria Pharma (Lead)', doc: 'GDP Certificate', expiry: '2025-03-15', status: 'Expiring' },
  { id: 'co7', category: 'Driver', entity: 'Fatima Ismail', doc: 'PDP Certificate', expiry: '2024-11-30', status: 'Expired' },
  { id: 'co8', category: 'Vehicle', entity: 'EC 33 PQR', doc: 'Roadworthy Certificate', expiry: '2025-04-30', status: 'Expiring' },
  { id: 'co9', category: 'Company', entity: 'LogiCRM (Pty) Ltd', doc: 'SARS Tax Clearance', expiry: '2025-09-30', status: 'Valid' },
  { id: 'co10', category: 'Company', entity: 'LogiCRM (Pty) Ltd', doc: 'Freight Operators Licence', expiry: '2025-12-31', status: 'Valid' },
  { id: 'co11', category: 'Driver', entity: 'Themba Khoza', doc: 'Medical Certificate', expiry: '2025-03-01', status: 'Expiring' },
  { id: 'co12', category: 'Vehicle', entity: 'FS 77 STU', doc: 'Roadworthy Certificate', expiry: '2025-10-31', status: 'Valid' },
  { id: 'co13', category: 'Customer', entity: 'Platinum Ridge Mining', doc: 'Service Contract', expiry: '2025-12-31', status: 'Valid' },
  { id: 'co14', category: 'Customer', entity: 'Namaqua Minerals', doc: 'Service Contract', expiry: '2025-08-31', status: 'Valid' },
]

export const SEED_REVENUE_CHART = [
  { month: 'Aug', revenue: 184000, cost: 128000 },
  { month: 'Sep', revenue: 197000, cost: 134000 },
  { month: 'Oct', revenue: 223000, cost: 148000 },
  { month: 'Nov', revenue: 208000, cost: 141000 },
  { month: 'Dec', revenue: 195000, cost: 132000 },
  { month: 'Jan', revenue: 241000, cost: 158000 },
]

export const SEED_OTIF_CHART = [
  { month: 'Aug', otif: 84 }, { month: 'Sep', otif: 87 }, { month: 'Oct', otif: 91 },
  { month: 'Nov', otif: 88 }, { month: 'Dec', otif: 85 }, { month: 'Jan', otif: 93 },
]

// ── Seed function ─────────────────────────────────────────────────
export async function seedAll() {
  const collections = [
    { name: 'customers', data: SEED_CUSTOMERS },
    { name: 'contacts', data: SEED_CONTACTS },
    { name: 'leads', data: SEED_LEADS },
    { name: 'shipments', data: SEED_SHIPMENTS },
    { name: 'quotes', data: SEED_QUOTES },
    { name: 'invoices', data: SEED_INVOICES },
    { name: 'vehicles', data: SEED_VEHICLES },
    { name: 'drivers', data: SEED_DRIVERS },
    { name: 'routes', data: SEED_ROUTES },
    { name: 'warehouses', data: SEED_WAREHOUSES },
    { name: 'carriers', data: SEED_CARRIERS },
    { name: 'compliance', data: SEED_COMPLIANCE },
  ]

  // Write charts as a single config doc
  await setDoc(doc(db, 'config', 'charts'), {
    revenueChart: SEED_REVENUE_CHART,
    otifChart: SEED_OTIF_CHART,
  })

  for (const col of collections) {
    const batch = writeBatch(db)
    for (const item of col.data as any[]) {
      const ref = doc(collection(db, col.name), item.id)
      batch.set(ref, item)
    }
    await batch.commit()
    console.log(`✓ Seeded ${col.data.length} ${col.name}`)
  }

  console.log('✅ All data seeded!')
}
