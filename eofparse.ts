import { Chain, Common, Hardfork } from /** CHANGE ME */
import { validateCode } from /** CHANGE ME */

const fs = require('fs')
const readline = require('readline');

const c = new Common({
    chain: Chain.Mainnet,
    hardfork: Hardfork.London,
    eips: [3540, 5450, 3860, 5450, 4200, 4750, 3670],
  })

function parse(line: string) {
    let buffer
    if (line.substr(0, 2) === '0x') {
        buffer = Buffer.from(line.substr(2), 'hex')
    } else {
        buffer = Buffer.from(line, 'hex')
    }
    try {
        const buf = Buffer.from(line, 'hex')
        const container = validateCode(buf)
        if (container) {
            console.log("ok")
        } else {
            throw new Error("container invalid")
        }
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