import { Chain, Common, Hardfork } from '../../ejs/ethereumjs-monorepo/packages/common'
import { validateCode } from '../../ejs/ethereumjs-monorepo/packages/evm/src/eof/eof'

const fs = require('fs')
const readline = require('readline');

const c = new Common({
    chain: Chain.Mainnet,
    hardfork: Hardfork.London,
    eips: [3540, 5450, 3860, 5450, 4200, 4750, 3670],
  })

const errors: string[] = []

function parse(line: string, output?: string) {
    let buffer
    if (line.substr(0, 2) === '0x') {
        buffer = Buffer.from(line.substr(2), 'hex')
    } else {
        buffer = Buffer.from(line, 'hex')
    }
    try {
        let parse = line 
        if (parse.substring(0, 2) === '0x') {
            parse = line.substring(2)
        }
        const buf = Buffer.from(parse, 'hex')
        const container = validateCode(buf)
        if (container) {
            console.log("OK " + container.body.entireCode.toString('hex'))
            if (output && output.substring(0, 2) !== 'OK') {
                errors.push('expected invalid container: ' + line)
            }
        } else {
            if (output && !output.includes('err: ')) {
                errors.push('expected valid container: ' + line)
            }
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
    const output = fs.readFileSync('sample.output', 'utf-8').split(/\r?\n/)
    let i = 0;
    input.split(/\r?\n/).forEach((line: any) =>  {
        parse(line, output[i])
        i++
    })
    console.log(errors)
}