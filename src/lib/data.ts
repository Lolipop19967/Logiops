// LEGACY — this file is no longer used. All data now comes from Firestore.
// Run /seed in the app to populate Firestore from src/lib/seed.ts

// Centralised mock data — swap for real DB calls (Supabase, Prisma, etc.)

export const customers = [
  { id: 1, name: 'Apex Distributors', industry: 'FMCG', region: 'Gauteng', tier: 'Premium', revenue: 285000, shipments: 42, balance: 18500, status: 'Active', phone: '011 555 0101', email: 'ops@apexdist.co.za', contact: 'Thandi Mokoena', credit: 30 },
  { id: 2, name: 'Cape Cargo Co.', industry: 'Retail', region: 'Western Cape', tier: 'Standard', revenue: 142000, shipments: 28, balance: 4200, status: 'Active', phone: '021 555 0202', email: 'finance@capecargo.co.za', contact: 'Johan van der Berg', credit: 60 },
  { id: 3, name: 'Highveld Logistics', industry: 'Mining', region: 'Mpumalanga', tier: 'Enterprise', revenue: 620000, shipments: 95, balance: 0, status: 'Active', phone: '013 555 0303', email: 'admin@highveld.co.za', contact: 'Sipho Dlamini', credit: 90 },
  { id: 4, name: 'Durban Direct', industry: 'Import/Export', region: 'KwaZulu-Natal', tier: 'Standard', revenue: 98000, shipments: 17, balance: 32100, status: 'On Hold', phone: '031 555 0404', email: 'info@durbandirect.co.za', contact: 'Priya Naidoo', credit: 30 },
  { id: 5, name: 'Bush Bulk Transport', industry: 'Agriculture', region: 'Limpopo', tier: 'Standard', revenue: 74000, shipments: 21, balance: 0, status: 'Active', phone: '015 555 0505', email: 'ops@bushbulk.co.za', contact: 'Petrus Viljoen', credit: 60 },
]

export const contacts = [
  { id: 1, customerId: 1, customerName: 'Apex Distributors', name: 'Thandi Mokoena', role: 'Operations Manager', email: 't.mokoena@apexdist.co.za', phone: '083 111 2222', dept: 'Operations' },
  { id: 2, customerId: 1, customerName: 'Apex Distributors', name: 'Ravi Pillay', role: 'Finance Director', email: 'r.pillay@apexdist.co.za', phone: '082 333 4444', dept: 'Finance' },
  { id: 3, customerId: 2, customerName: 'Cape Cargo Co.', name: 'Johan van der Berg', role: 'Procurement', email: 'j.vdberg@capecargo.co.za', phone: '073 555 6666', dept: 'Procurement' },
  { id: 4, customerId: 3, customerName: 'Highveld Logistics', name: 'Sipho Dlamini', role: 'CEO', email: 's.dlamini@highveld.co.za', phone: '083 777 8888', dept: 'Executive' },
  { id: 5, customerId: 4, customerName: 'Durban Direct', name: 'Priya Naidoo', role: 'Accounts', email: 'p.naidoo@durbandirect.co.za', phone: '071 999 0000', dept: 'Finance' },
]

export const leads = [
  { id: 1, company: 'Joburg Wholesale', contact: 'Mark Smith', value: 85000, stage: 'Qualified', source: 'Referral', rep: 'Ayanda K.', notes: 'Needs refrigerated capacity', created: '2025-01-10' },
  { id: 2, company: 'Pretoria Pharma', contact: 'Dr. E. Botha', value: 220000, stage: 'Quoted', source: 'Web', rep: 'Ayanda K.', notes: 'GDP certified required', created: '2025-01-15' },
  { id: 3, company: 'Kimberley Miners', contact: 'Fanie du Plessis', value: 390000, stage: 'Prospect', source: 'Cold Call', rep: 'Lwando M.', notes: 'Large oversize loads', created: '2025-01-18' },
  { id: 4, company: 'East Rand Cold Storage', contact: 'James Lee', value: 150000, stage: 'Won', source: 'Tender', rep: 'Lwando M.', notes: '', created: '2025-01-05' },
  { id: 5, company: 'Bloemfontein Foods', contact: 'Zanele Khumalo', value: 60000, stage: 'Lost', source: 'Referral', rep: 'Ayanda K.', notes: 'Lost on price', created: '2024-12-20' },
]

export const shipments = [
  { id: 'SH-1001', customerId: 1, customer: 'Apex Distributors', origin: 'Johannesburg', dest: 'Cape Town', status: 'In Transit', driver: 'Moses Sithole', vehicle: 'GP 12 ABC', weight: 4200, cargo: 'FMCG', eta: '2025-02-03', created: '2025-01-28', legs: 2, value: 8400, pod: false },
  { id: 'SH-1002', customerId: 3, customer: 'Highveld Logistics', origin: 'Witbank', dest: 'Durban', status: 'Delivered', driver: 'Sipho Ndlovu', vehicle: 'MP 34 DEF', weight: 18500, cargo: 'Mining Equipment', eta: '2025-01-30', created: '2025-01-27', legs: 1, value: 24000, pod: true },
  { id: 'SH-1003', customerId: 2, customer: 'Cape Cargo Co.', origin: 'Cape Town', dest: 'Johannesburg', status: 'Booked', driver: '—', vehicle: '—', weight: 2100, cargo: 'Retail Goods', eta: '2025-02-06', created: '2025-01-30', legs: 1, value: 5200, pod: false },
  { id: 'SH-1004', customerId: 4, customer: 'Durban Direct', origin: 'Durban', dest: 'Maputo', status: 'Customs Hold', driver: 'Themba Khoza', vehicle: 'KZN 56 GHI', weight: 6800, cargo: 'Import Goods', eta: '2025-02-04', created: '2025-01-29', legs: 3, value: 14800, pod: false },
  { id: 'SH-1005', customerId: 5, customer: 'Bush Bulk Transport', origin: 'Polokwane', dest: 'Beit Bridge', status: 'In Transit', driver: 'Andre Botha', vehicle: 'LP 78 JKL', weight: 22000, cargo: 'Agricultural', eta: '2025-02-02', created: '2025-01-28', legs: 2, value: 18600, pod: false },
]

export const quotes = [
  { id: 'QT-2001', customerId: 1, customer: 'Apex Distributors', origin: 'Johannesburg', dest: 'Bloemfontein', cargo: 'FMCG', weight: 3000, amount: 6800, status: 'Sent', created: '2025-01-30', margin: 22, rep: 'Ayanda K.' },
  { id: 'QT-2002', customerId: 3, customer: 'Highveld Logistics', origin: 'Witbank', dest: 'Richards Bay', cargo: 'Coal', weight: 35000, amount: 42000, status: 'Accepted', created: '2025-01-28', margin: 18, rep: 'Lwando M.' },
  { id: 'QT-2003', customerId: 2, customer: 'Cape Cargo Co.', origin: 'Cape Town', dest: 'Port Elizabeth', cargo: 'Retail', weight: 1800, amount: 3400, status: 'Draft', created: '2025-01-31', margin: 28, rep: 'Ayanda K.' },
  { id: 'QT-2004', customerId: 5, customer: 'Bush Bulk Transport', origin: 'Musina', dest: 'Johannesburg', cargo: 'Produce', weight: 12000, amount: 14500, status: 'Rejected', created: '2025-01-25', margin: 15, rep: 'Lwando M.' },
]

export const invoices = [
  { id: 'INV-3001', customerId: 1, customer: 'Apex Distributors', shipment: 'SH-1002', amount: 24000, status: 'Paid', issued: '2025-01-30', due: '2025-03-01', paid: 24000 },
  { id: 'INV-3002', customerId: 3, customer: 'Highveld Logistics', shipment: 'SH-1002', amount: 42000, status: 'Sent', issued: '2025-01-29', due: '2025-02-28', paid: 0 },
  { id: 'INV-3003', customerId: 4, customer: 'Durban Direct', shipment: 'SH-1004', amount: 14800, status: 'Overdue', issued: '2025-01-01', due: '2025-01-31', paid: 5000 },
  { id: 'INV-3004', customerId: 2, customer: 'Cape Cargo Co.', shipment: 'SH-1003', amount: 5200, status: 'Draft', issued: '2025-01-31', due: '2025-03-01', paid: 0 },
]

export const vehicles = [
  { id: 1, reg: 'GP 12 ABC', make: 'Volvo', model: 'FH 460', type: 'Truck', capacity: 30000, status: 'In Use', km: 284500, service: '2025-03-15', rw: '2025-06-30', insurance: '2025-12-31', driver: 'Moses Sithole' },
  { id: 2, reg: 'MP 34 DEF', make: 'Mercedes', model: 'Actros 2644', type: 'Truck', capacity: 26000, status: 'Available', km: 192000, service: '2025-02-20', rw: '2025-09-30', insurance: '2025-12-31', driver: '—' },
  { id: 3, reg: 'KZN 56 GHI', make: 'MAN', model: 'TGX 26.440', type: 'Truck', capacity: 28000, status: 'In Use', km: 347800, service: '2025-04-10', rw: '2025-05-31', insurance: '2025-12-31', driver: 'Themba Khoza' },
  { id: 4, reg: 'LP 78 JKL', make: 'Scania', model: 'R500', type: 'Truck', capacity: 32000, status: 'In Use', km: 156200, service: '2025-02-28', rw: '2025-08-31', insurance: '2025-12-31', driver: 'Andre Botha' },
  { id: 5, reg: 'WC 90 MNO', make: 'Isuzu', model: 'FTR 850', type: 'Rigid', capacity: 8000, status: 'Maintenance', km: 98400, service: '2025-02-01', rw: '2025-07-31', insurance: '2025-12-31', driver: '—' },
]

export const drivers = [
  { id: 1, name: 'Moses Sithole', license: 'Code 14', prcp: 'Valid', medical: '2025-06-30', hours: 38, maxHours: 60, status: 'Active', phone: '082 100 2000', vehicle: 'GP 12 ABC', trips: 84 },
  { id: 2, name: 'Sipho Ndlovu', license: 'Code 14', prcp: 'Valid', medical: '2025-08-15', hours: 12, maxHours: 60, status: 'Active', phone: '083 200 3000', vehicle: 'Available', trips: 71 },
  { id: 3, name: 'Themba Khoza', license: 'Code 14', prcp: 'Valid', medical: '2025-03-01', hours: 55, maxHours: 60, status: 'Active', phone: '071 300 4000', vehicle: 'KZN 56 GHI', trips: 62 },
  { id: 4, name: 'Andre Botha', license: 'Code 14', prcp: 'Expiring', medical: '2025-12-31', hours: 44, maxHours: 60, status: 'Active', phone: '076 400 5000', vehicle: 'LP 78 JKL', trips: 93 },
  { id: 5, name: 'Zanele Mthembu', license: 'Code 10', prcp: 'Valid', medical: '2025-09-30', hours: 0, maxHours: 60, status: 'Off Duty', phone: '084 500 6000', vehicle: '—', trips: 34 },
]

export const routes = [
  { id: 1, origin: 'Johannesburg', dest: 'Cape Town', distance: 1398, transitDays: 2, baseRate: 8.50, cargoType: 'General', sla: '48h', volume: 24 },
  { id: 2, origin: 'Johannesburg', dest: 'Durban', distance: 569, transitDays: 1, baseRate: 6.20, cargoType: 'General', sla: '24h', volume: 38 },
  { id: 3, origin: 'Witbank', dest: 'Richards Bay', distance: 298, transitDays: 1, baseRate: 5.80, cargoType: 'Bulk', sla: '24h', volume: 15 },
  { id: 4, origin: 'Durban', dest: 'Maputo', distance: 312, transitDays: 2, baseRate: 12.40, cargoType: 'Cross-Border', sla: '48h', volume: 8 },
  { id: 5, origin: 'Polokwane', dest: 'Beit Bridge', distance: 290, transitDays: 1, baseRate: 11.20, cargoType: 'Cross-Border', sla: '24h', volume: 6 },
]

export const warehouses = [
  { id: 1, name: 'JHB Central Hub', city: 'Johannesburg', capacity: 5000, used: 3200, type: 'General', cold: false, hazmat: false, manager: 'Bongani Zulu' },
  { id: 2, name: 'Cape Town Gateway', city: 'Cape Town', capacity: 3000, used: 1100, type: 'General', cold: true, hazmat: false, manager: 'Nadia Petersen' },
  { id: 3, name: 'Durban Port Depot', city: 'Durban', capacity: 4000, used: 3800, type: 'Port Adjacent', cold: false, hazmat: true, manager: 'Raj Govender' },
]

export const carriers = [
  { id: 1, name: 'Speedy Freight SA', type: 'Road', rating: 4.5, shipments: 28, onTime: 89, status: 'Active', contact: 'Dave van Niekerk', phone: '011 600 7000' },
  { id: 2, name: 'TransAfrica Hauliers', type: 'Cross-Border', rating: 4.2, shipments: 15, onTime: 80, status: 'Active', contact: 'Flora Banda', phone: '012 700 8000' },
  { id: 3, name: 'MariLink Containers', type: 'Sea', rating: 4.7, shipments: 9, onTime: 94, status: 'Active', contact: 'Yuki Tanaka', phone: '021 800 9000' },
]

export const compliance = [
  { id: 1, category: 'Driver', entity: 'Moses Sithole', doc: 'PDP Certificate', expiry: '2025-07-15', status: 'Valid' },
  { id: 2, category: 'Driver', entity: 'Andre Botha', doc: 'PDP Certificate', expiry: '2025-02-28', status: 'Expiring' },
  { id: 3, category: 'Vehicle', entity: 'KZN 56 GHI', doc: 'Roadworthy Certificate', expiry: '2025-05-31', status: 'Valid' },
  { id: 4, category: 'Vehicle', entity: 'WC 90 MNO', doc: 'Cross-Border Permit', expiry: '2025-01-31', status: 'Expired' },
  { id: 5, category: 'Customer', entity: 'Highveld Logistics', doc: 'Service Contract', expiry: '2025-06-30', status: 'Valid' },
  { id: 6, category: 'Customer', entity: 'Pretoria Pharma (Lead)', doc: 'GDP Certificate', expiry: '2025-03-15', status: 'Expiring' },
]

export const revenueChart = [
  { month: 'Aug', revenue: 184000, cost: 128000 },
  { month: 'Sep', revenue: 197000, cost: 134000 },
  { month: 'Oct', revenue: 223000, cost: 148000 },
  { month: 'Nov', revenue: 208000, cost: 141000 },
  { month: 'Dec', revenue: 195000, cost: 132000 },
  { month: 'Jan', revenue: 241000, cost: 158000 },
]

export const otifChart = [
  { month: 'Aug', otif: 84 }, { month: 'Sep', otif: 87 }, { month: 'Oct', otif: 91 },
  { month: 'Nov', otif: 88 }, { month: 'Dec', otif: 85 }, { month: 'Jan', otif: 93 },
]
