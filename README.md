# THREE-events
## Install
    npm i three-events
## Import
    import ThreeEvents from 'three-events'
## Initialize (renderer, camera[, recursiveFlag])
    const threeEvents = new ThreeEvents(
        new THREE.WebGLRenderer(),
        new THREE.Camera()
    )
## addEventListener (object | objects, type, callback[, options])
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshBasicMaterial({ color: #fff })
    const cube = new THREE.Mesh(geometry, material)
    const handler = (event, object) => { console.log('hello') }
	
    threeEvents.addEventListener(cube, 'mousemove', handler)
##### The callback is called with parameters (event, object)
##### options is for default target.addEventListener(type, listener[, *options*]);    
## removeEventListener (object | objects, type, callback[, options])
##### Works also for anonymous functions!
    threeEvents.removeEventListener(cube, 'mousemove', handler);
###### Removing a listener will only work if the object's IDs are the same as when the listener was added!
