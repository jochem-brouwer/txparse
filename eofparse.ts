import { validateCode } from "./ethereumjs-monorepo/packages/evm/src/eof"
import { EVM } from "./ethereumjs-monorepo/packages/evm/src/evm";
import { Chain, Common, Hardfork } from "./ethereumjs-monorepo/packages/common/src";

const fs = require('fs')
const readline = require('readline');

const errors: string[] = []

const common: any = new Common({
    chain: Chain.Mainnet,
    hardfork: Hardfork.Merge,
    eips: [3540, 3670, 4200, 4750, 5450, 3860, 3855]
})


const eei: any = {}

const evm = new EVM({ common, eei } )

function getBuffer(line: string) {
    let input =  line.replace(/\W/g, "")
    if (input.substring(0, 1) === ' ') {
        input = input.substring(1)
    } else if (input.substring(0, 1) === '-') {
        input = input.substring(1)
    }
    if (input.substring(0, 2) === '0x') {
        const len = (input.length - 2) + input.length % 2
        return Buffer.from(input.substring(2).padStart(len, '0'), 'hex')
    } else {
        const len = input.length + input.length % 2
        return Buffer.from(input.padStart(len, '0'), 'hex')
    }
}

function parse(line: string, output?: string) {
    if (line.substring(0,1) === '#') {
        return
    }
    try {
        const buf = getBuffer(line)
        const container = validateCode(buf, evm._opcodes)
        if (container) {
            console.log("OK " + container.body.codeSections.map((e: Buffer) => e.toString('hex')).join(','))
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
        console.log("err: " + e.message + ', expected error: ' + output)
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