import { Chain, Common, Hardfork } from "@ethereumjs/common";
import { TransactionFactory } from "@ethereumjs/tx";
const fs = require('fs')
const readline = require('readline');

const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.London})

function parse(line: string) {
    let buffer
    if (line.substr(0, 2) === '0x') {
        buffer = Buffer.from(line.substr(2), 'hex')
    } else {
        buffer = Buffer.from(line, 'hex')
    }
    try {
        const tx = TransactionFactory.fromSerializedData(buffer, { common })
        console.log(tx.getSenderAddress().toString())
    } catch(e: any) {
        console.log("err: " + e.message)
    }
}

if (process.argv[2] === '--stdin') {
    var rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    
    rl.on('line', function(line: any){
        parse(line)
    })
} else {
    const input = fs.readFileSync('sample.input', 'utf-8');
    input.split(/\r?\n/).forEach((line: any) =>  {
        parse(line)
    })
}