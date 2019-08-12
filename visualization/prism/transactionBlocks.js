let simulation = d3.forceSimulation(transactionBlocks)
    .force('collide', d3.forceCollide().radius(5*transactionBlockSize/8).iterations(10).strength(0.05))
    .force('x', d3.forceX(transactionScreenWidth/4).strength(0.05))
    .force('y', d3.forceY(transactionScreenHeight*0.2).strength(0.05))
    .alphaTarget(0.1)
    .on('tick', ticked)


function ticked() {
  transactionBlock.attr('transform', d => `translate(${d.x}, ${d.y})`)
		  .attr('opacity', d => {
			d.opacity+=0.01
			return d.opacity
		   })
}

const restart = () => {
  // Restart the simulation with new transaction block dataset
  transactionBlock = transactionGroup.selectAll('g').data(transactionBlocks, d => d.blockId)
  transactionBlock.exit()
      .remove()

  transactionBlockEnter = transactionBlock.enter().append('g')
          .attr('id', d => 'transactionBlock' + d.blockId )
          .attr('class', 'transactionBlock')
	  .attr('opacity', d => {
		d.opacity = 0
		return d.opacity
	  })
          .attr('transform', d => `translate(${d.x}, ${d.y})`)

  transactionBlockEnter.append('rect').attr('rx', 3)
          .attr('width', transactionBlockSize*1.25)
          .attr('height', transactionBlockSize)
          .style('filter', 'url(#blockGlow)')

  for(let y=5; y<=11; y+=3)
    transactionBlockEnter.append('line')
                   .attr('class', 'transaction')
                   .attr('x1', 4) 
                   .attr('y1', y) 
                   .attr('x2', 20) 
                   .attr('y2', y) 

  transactionBlock = transactionBlock.merge(transactionBlock)
   
  // Restart simulation
  simulation.nodes(transactionBlocks)
  simulation.alpha(0.1).restart()
}

restart()

const addTransactionBlock = (blockId, sourceNodeId) => {
  // Check if already added
  const check = transactionBlocks.find(b => b.blockId===blockId) 
  if(check==undefined){
    // Add a transaction block at the bottom of the screen
    pingNode(sourceNodeId)
    const sourceNode = globalNodesData.find(node => node.nodeId==sourceNodeId)
    transactionBlocks.push({x: sourceNode.x, y: sourceNode.y, blockId})
    restart()
 }
}