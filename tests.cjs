const {test}=require('node:test'),a=require('node:assert/strict'),c=require('./core.js');
const o={label:'A',currency:'THB',price:'3500000',area:'80',transfer:'40000',fitout:'180000',other:'0',annual:'',schedule:'2026-11-01,350000\n2027-05-01,3150000'};
test('exact upfront totals, unit price, explicit deadline and unknown annual',()=>{const r=c.review(o,'2026-12-31');a.equal(r.total,'3720000.00');a.equal(r.pricePerSqm,'43750.00');a.equal(r.dueByDate,'350000.00');a.equal(r.annual,null);});
test('missing fees are not silently zero',()=>{const r=c.review({...o,transfer:''},'2026-12-31');a.equal(r.total,null);a.equal(r.knownSubtotal,'3680000.00');a.deepEqual(r.unknown,['transfer']);});
test('decimal cents do not accumulate binary rounding',()=>{a.equal(c.money(c.decimal('0.10')+c.decimal('0.20')),'0.30');});
test('payment mismatch and invalid dates rejected',()=>{a.throws(()=>c.review({...o,schedule:'2026-02-30,3500000'},'2026-12-31'));a.throws(()=>c.review({...o,schedule:'2026-11-01,1'},'2026-12-31'));});
test('foreign currency is retained, no conversion',()=>{const r=c.compare([o,{...o,label:'B',currency:'IDR'}],'2026-12-31');a.deepEqual(r.map(x=>x.currency),['THB','IDR']);});
test('area positive, precision and offer count bounded',()=>{a.throws(()=>c.review({...o,area:'0'},'2026-12-31'));a.throws(()=>c.decimal('1.001'));a.throws(()=>c.compare([o],'2026-12-31'));});
test('CSV protects formula-like labels',()=>{a.match(c.csv([{label:'=HYPERLINK("bad")'}]),/"'=HYPERLINK/);});
