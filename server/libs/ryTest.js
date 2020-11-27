// describe, it, expect, afterEach, beforeEach, afterAll, beforeAll
// toEqual, toBe, 
// Total tests, total passed, total failed, test run time
let total = 0
let passed = 0
let failed = 0
const beforeEachArray = []
const beforeAllArray = []
const afterEachArray = []
const afterAllArray = []
let descriptions = {
	it: []
}
const results = []
let currentIt = {}

function afterEach(callback){
	afterEachArray.push(callback)
}

function afterAll(callback){
	afterAllArray.push(callback)
}

function beforeEach(callback){
	beforeEachArray.push(callback)
}

function beforeAll(callback){
	beforeAllArray.push(callback)
}

function describe(description, callback){
	descriptions = {
		it: []
	}

	for (let idx = 0; idx < beforeAllArray.length; idx++){
		beforeAllArray[idx].apply(this)
	}

	descriptions.name = description
	callback.apply(this)

	for (let idx = 0; idx < afterAllArray.length; idx++){
		afterAllArray[idx].apply(this)
	}
	results.push(descriptions)

}

function it (description, callback){
	total++

	for(let idx = 0; idx < beforeEachArray.length; idx++){
		beforeEachArray[idx].apply(this)
	}
	
	currentIt = {
		name: description,
		expects: []
	}

	callback.apply(this)
	
	for(let idx = 0; idx < afterEachArray.length; idx++){
		afterEachArray[idx].apply(this)
	}
	
	descriptions.it.push(currentIt)
}

function expect (actual){
	return {
		// Check if values are strict equal
		toBe: (expected) => {
			if(actual === expected){
				passed++
				currentIt.expects.push({ name: `expects '${actual}' toBe '${expected}'`, status: true})
			} else {
				failed++
				currentIt.expects.push({name: `expects '${actual}' toBe '${expected}'`, status: false})
			}
		},

		// Check if actual matches expectation
		toEqual: (expected) => {
			if(actual == expected){
				passed++
				currentIt.expects.push({ name: `expects '${actual}' toEqual '${expected}'`, status: true})
			} else {
				failed++
				currentIt.expects.push({name: `expects '${actual}' toEqual '${expected}'`, status: false})
			}
		}
	}
}

function showResults() {
	console.log()
	console.log(`Tests Passed: ${passed}, Total: ${total}
	`)

		for (let idx = 0; idx < results.length; idx++){
			let res = results[idx]
			const {name, it} = res
			console.log("Describe: " ,name)
			for (let i = 0; i < it.length; i++){
				const currIt = it[i]
				console.log(`  It: '${currIt.name}'`)
				for(let ii = 0; ii < currIt.expects.length; ii++){
					const expect = currIt.expects[ii]
					console.log(`   '${expect.name} ----- ${expect.status ? "Passed" : "Failed"}`)
				}
			}
		}
}

module.exports =
{ showResults,
describe,
 expect,
 it,
 beforeEach,
 beforeAll,
 afterEach,
 afterAll,
}