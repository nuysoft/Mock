    try {
    	// for node
    	window
    } catch (error) {
    	window = {}
    }
    expose(
    	'mockjs', [],
    	factory,
    	function() {
    		// Browser globals
    		window.Mock = factory()
    		window.Random = Mock.Random
    	}
    )