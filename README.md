# THREE-events
### Install
    npm i three-events
### Usage
#### Import:
    import ThreeEvents from 'three-events'
#### Initialize three-events:
    const threeEvents = new ThreeEvents(render, camera/*, recursiveFlag = false*/ )
##### Add event handler:
    const geometry = new THREE.BoxGeometry( 1, 1, 1 )
    const material = new THREE.MeshBasicMaterial( { color: #fff } )
    const cube = new THREE.Mesh( geometry, material )
    const handler = (event, object) => { console.log('hello') }
	
    threeEvents.addEventListener([cube], 'mousemove', handler)
##### Remove event handler:
    threeEvents.removeEventListener([cube], 'mousemove', handler);
	// works also for anonymous functions!

