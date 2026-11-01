(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.OfferCompare=factory();})(typeof globalThis!=='undefined'?globalThis:this,()=>{
  'use strict';
  function decimal(text,places=2,required=true){
    if(text===undefined||text===null||String(text).trim()===''){if(required)throw Error('Enter an amount, including an explicit zero.');return null;}
    const s=String(text).trim();
    if(!new RegExp('^\\d{1,12}(?:\\.\\d{1,'+places+'})?$').test(s))throw Error('Use a nonnegative plain decimal with up to '+places+' decimal places.');
    const [a,b='']=s.split('.');return BigInt(a)*10n**BigInt(places)+BigInt(b.padEnd(places,'0'));
  }
  function money(n){if(n===null)return null;return (n/100n)+'.'+String(n%100n).padStart(2,'0');}
  function date(s){if(!/^\d{4}-\d{2}-\d{2}$/.test(s)||Number(s.slice(0,4))<2000||Number(s.slice(0,4))>2100||new Date(s+'T00:00:00Z').toISOString().slice(0,10)!==s)throw Error('Use a valid date from 2000 to 2100.');return s;}
  function review(offer,asOf){
    date(asOf);if(!offer||typeof offer!=='object')throw Error('Offer must be an object.');
    const label=String(offer.label||'').trim();if(!label||label.length>120)throw Error('Give each offer a name, up to 120 characters.');
    const currency=String(offer.currency||'');if(!/^[A-Z]{3}$/.test(currency))throw Error('Choose a three-letter currency label.');
    const price=decimal(offer.price);if(price===0n)throw Error('Purchase price must be positive.');
    const area=decimal(offer.area,4);if(area===0n)throw Error('Area must be positive.');
    const fields=['transfer','fitout','other'],unknown=fields.filter(k=>offer[k]===null||offer[k]===undefined||String(offer[k]).trim()==='');
    const fees=fields.map(k=>decimal(offer[k],2,false));const subtotal=price+fees.reduce((a,b)=>a+(b??0n),0n);
    const annual=decimal(offer.annual,2,false);let scheduled=null,due=null;
    if(offer.schedule!==undefined&&offer.schedule!==null&&String(offer.schedule).trim()!==''){
      const lines=String(offer.schedule).trim().split(/\r?\n/);if(lines.length>60)throw Error('At most 60 payment milestones per offer.');scheduled=0n;due=0n;
      for(const line of lines){const parts=line.split(',').map(x=>x.trim());if(parts.length!==2)throw Error('Each milestone is date,amount.');date(parts[0]);const n=decimal(parts[1]);scheduled+=n;if(parts[0]<=asOf)due+=n;}
      if(scheduled!==price)throw Error('Milestones must add up exactly to the purchase price, excluding additional costs.');
    }
    const unit=(price*10000n+area/2n)/area;
    return {label,currency,price:money(price),area:String(offer.area),knownSubtotal:money(subtotal),total:unknown.length?null:money(subtotal),unknown,pricePerSqm:money(unit),annual:money(annual),scheduled:money(scheduled),dueByDate:money(due),asOf};
  }
  function compare(offers,asOf){if(!Array.isArray(offers)||offers.length<2||offers.length>4)throw Error('Compare two to four offers.');return offers.map(o=>review(o,asOf));}
  function csv(rows){const cell=x=>{let s=x===null||x===undefined?'Unknown':String(x);if(/^[=+\-@\t\r]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';};const keys=['label','currency','price','area','pricePerSqm','knownSubtotal','total','annual','dueByDate','asOf'];return [keys,...rows.map(r=>keys.map(k=>r[k]))].map(r=>r.map(cell).join(',')).join('\r\n');}
  return {decimal,money,date,review,compare,csv};
});
