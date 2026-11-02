const test=require('node:test'),assert=require('node:assert/strict');
const {levelsFor,orientations,solved,bestSolution}=require('./helpers/optics.cjs');
test('all eight mirror layouts are solvable and require a player move',()=>{
 for(const [name,count] of [['vektor-cyberpath-logic.html',3],['lumina-valley.html',5]]){const levels=levelsFor(name);assert.equal(levels.length,count);for(const [index,level] of levels.entries()){assert.equal(solved(level,orientations(level)),false,name+' layout '+(index+1)+' starts solved');assert.ok(bestSolution(level),name+' layout '+(index+1)+' has no solution');}}
});
